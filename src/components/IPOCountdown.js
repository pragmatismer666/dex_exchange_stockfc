import Web3 from 'web3'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setTimerStatus } from '../store/actions';
import { connect } from "react-redux";
import tokens from "../IPO/store/tokens";
import exchanges from "../IPO/store/exchanges";

import configURL from '../config/countdown.json'
import configURL2 from '../config/endpoints.json'
import configURL3 from '../config/player2id.json'

const countdownSetting = configURL.countdown;
const IMGURL = configURL2.imgURL;
const DATAURL = configURL2.playerdataURL;
const player2id = configURL3.player2id;

class IPOCountdown extends Component {

  state = {
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
    imgurl : null,
    fullname : null
  };
  // used to set and clear interval
  timer;
  // used to calculate the distance between "current date and time" and the "target date and time"
  distance;

  constructor(props) {
    super(props);
    this.readAccountDappValue = this.readAccountDappValue.bind(this);
  }

  readAccountDappValue = async (account1) => {
    let { totalBal, tokenbal } = this.state;
    let exchangeName=0;
    totalBal = 0;
    const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
    const networkId = await web3.eth.net.getId();
    var token = tokens[this.props.id].default;
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
  
  async componentDidMount() {
    if (this.props.account) {
      this.readAccountDappValue(this.props.account);
    }
    else {
      this.readAccountDappValue(localStorage.getItem("account-address"));
    }
    this.setDate(this.props.dispatch);
    this.counter(this.props.dispatch);

    let fulldata = await this.getFullData();
    this.setState({imgurl : this.getImgUrl()});
    if(fulldata){
      this.setState({
        fullname : fulldata.fullname
      })
    }
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
      await dispatch(setTimerStatus("soon"));
    }else{
      this.setState({ isSoon : false});
      // target date and time is less than current date and time
      if (this.distance < 0) {
        clearInterval(this.timer);
        this.setState({ isExpired: true });
        await dispatch(setTimerStatus("expired"));
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
        await dispatch(setTimerStatus("count"));
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

  getImgUrl(){
    let playerName = this.props.id, id;
    id = player2id[playerName];
    return IMGURL+id+'.png';
  }

  async getFullData(){
    let playerName = this.props.id, id, url, fulldata;
    id = player2id[playerName];
    url = DATAURL + id;
    await fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "text/plain"
      }
    }).then(response => response.json())
    .then(data => {
      fulldata = data;
    }).catch(error => {
      this.setState({error : error});
    });
    return fulldata;
  }

  render() {
    const { remaining, isExpired, totalBal, tokenbal , isSoon, Date_start} = this.state;
    return (
      <>
        <div className="market-news mt15">
          <h2 className="heading">IPO Info &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.fullname}</b></h2>
          <ul>
            <li>
              <Link to="/news-details">
                <h2>
                  {
                    ( isSoon ? <p className="">Cooming Soon</p> : 
                      (!isExpired) ? (
                        'Sale Ends in: ' + (remaining.days * 24 + remaining.hours) + ' : ' + remaining.minutes + ' : ' + remaining.seconds
                      ) : (
                        <p className="">IPO Closed</p>
                      )
                    )
                  }
                </h2>
                <p>{(isSoon ? ("Start Date : " + Date_start.toString()) : "")}</p>

              </Link>
            </li>
            <li>
              <Link to="/news-details">
                <strong>{eval((totalBal - tokenbal).toFixed(0))}/100000 Sold</strong>
              </Link>
            </li>
            <li>
              <img className="ProfileImage" src={this.state.imgurl} />
            </li>
          </ul>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(IPOCountdown);
