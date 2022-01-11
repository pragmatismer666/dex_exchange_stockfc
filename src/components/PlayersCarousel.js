import React ,{ Component } from 'react';
import Slider from 'react-slick';
import Web3 from 'web3'
import tokens from "../IPO/store/tokens";
import exchanges from "../IPO/store/exchanges";

import configURL from '../config/wallets.json'
import configURL2 from '../config/endpoints.json'
import configURL3 from '../config/player2id.json'
import configURL4 from '../config/ipo.json'
import configURL5 from '../config/fullnames.json'
import configURL6 from '../config/countdown.json'

const deadwallet = configURL.deadWallet;
const IMGURL = configURL2.imgURL;
const DATAURL = configURL2.playerdataURL;
const player2id = configURL3.player2id;
const iponamelist = configURL4.iponamelist;
const fullname = configURL5.fullname;
const countdownSetting = configURL6.countdown;

class PlayersCarouselItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      remaining: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      totalBal: 0,
      tokenbal: 0,
      isExpired: false,
      isSoon : true,
      Date_start : new Date(),
    }
    this.readAccountDappValue = this.readAccountDappValue.bind(this);
  }

  // used to set and clear interval
  timer;
  // used to calculate the distance between "current date and time" and the "target date and time"
  distance;

  async componentDidMount() {
    if (this.props.id) {
      this.readAccountDappValue(this.props.id);
    }
    else {
      this.readAccountDappValue(localStorage.getItem("account-address"));
    }

    
    this.setDate(this.props.dispatch);
    this.counter(this.props.dispatch);
  }

  setDate = async (dispatch) => {
    var member = this.props.id;
    var configInfo = countdownSetting[member];
    var startdate = configInfo["startdate"];
    var enddate = configInfo["enddate"];
    var timeInfo_start = startdate.split(',');
    var timeInfo_end = enddate.split(',');
    var now = new Date(), countDownDate_start, countDownDate_end;
    countDownDate_end = new Date(timeInfo_end[0], timeInfo_end[1] - 1, timeInfo_end[2], timeInfo_end[3], timeInfo_end[4]);
    countDownDate_start = new Date(timeInfo_start[0], timeInfo_start[1] - 1, timeInfo_start[2], timeInfo_start[3], timeInfo_start[4]);
    this.setState({Date_start : countDownDate_start});
    // Find the distance between now and the count down date
    var canstart =  countDownDate_start.getTime() - now.getTime();
    this.distance = countDownDate_end.getTime() - now.getTime();

    if(canstart > 0){
      clearInterval(this.timer);
      this.setState({ isSoon : true});
      // await dispatch(setTimerStatus("soon"));
    }else{
      this.setState({ isSoon : false});
      // target date and time is less than current date and time
      if (this.distance < 0) {
        clearInterval(this.timer);
        this.setState({ isExpired: true });
        // await dispatch(setTimerStatus("expired"));
      } else {
        this.setState({
          remaining: {
            days: Math.floor(this.distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((this.distance % (1000 * 60)) / 1000)
          },
          isExpired: false
        });
        // await dispatch(setTimerStatus("count"));
      }
    }
  }

  counter(dispatch) {
    this.timer = setInterval(() => {
      this.setDate(dispatch);
      if (this.props.account) {
        this.readAccountDappValue(this.props.account);
      }
      else {
        this.readAccountDappValue(localStorage.getItem("account-address"));
      }
    }, 1000);
  }

  readAccountDappValue = async (account1) => {
    let { totalBal, tokenbal } = this.state;
    let exchangeName=0;
    totalBal = 0;
    const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
    const networkId = await web3.eth.net.getId();
    let token = tokens[this.props.id]['default'];
    for (let nameid = 0; nameid < Object.entries(tokens).length; nameid++) {
      if (this.props.id === Object.entries(tokens)[nameid][0]){
        exchangeName=Object.entries(exchanges)[nameid][0];
      }
    }
    let adminaddress=exchanges[exchangeName].default.networks[networkId].address;
    var tokenInst = new web3.eth.Contract(token.abi, token.networks[networkId].address)
    let bal = await tokenInst.methods.totalSupply().call();
    totalBal = (bal / (10 ** 18));
    bal = await tokenInst.methods.balanceOf(adminaddress).call();
    tokenbal = (bal / (10 ** 18));
    this.setState({ totalBal, tokenbal });
  }

  render(){
    let obj = this.props.id;
    const { remaining, isExpired, totalBal, tokenbal , isSoon, Date_start} = this.state;

    return(
      <div className="market-carousel-item">
          <div className="market-carousel-item-name">
          <img src={IMGURL + player2id[obj] + '.png'} alt="" />
            <strong>{fullname[obj]}</strong>
          </div>
          <h2>
            {
            ( isSoon ? <p className="">Cooming Soon</p> : 
            (!isExpired) ? (
              'Price Drops in ' + (remaining.days * 24 + remaining.hours) + ' : ' + remaining.minutes + ' : ' + remaining.seconds
            ) : (
              <p className="">IPO Closed</p>
            ))
          }
          </h2>
          <p>{eval((totalBal - tokenbal).toFixed(0))}/{totalBal} Sold</p>
          <a href={'/ipo/'+obj}>
          <button className="btn buy">Buy</button>
          </a>
        </div>
    );
  }
}



export default function PlayersCarousel() {
  const settings = {
    infinite: true,
    speed: 900,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="market-carousel">
      <Slider {...settings}>
        {
          iponamelist.map((obj, key) => (
           <PlayersCarouselItem id={obj}/> 
          ))
        }
        <div className="market-carousel-item">
          <div className="market-carousel-item-name">
            <strong>IPO Coming Soon</strong>
          </div>
        </div>
        <div className="market-carousel-item">
          <div className="market-carousel-item-name">
            <strong>IPO Coming Soon</strong>
          </div>
        </div>

      </Slider>
    </div>
  );
}
