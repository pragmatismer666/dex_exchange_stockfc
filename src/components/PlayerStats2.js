import { connect } from 'react-redux'
import React, { Component} from 'react'
import { Navbar, Nav, NavDropdown, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Web3 from 'web3'
import tokens from "../store/tokens";
import Exchanges from "../store/exchanges";

import configURL from '../config/wallets.json'
import configURL2 from '../config/endpoints.json'
import configURL3 from '../config/player2id.json'

const deadwallet = configURL.deadWallet;
const IMGURL = configURL2.imgURL;
const DATAURL = configURL2.playerdataURL;
const player2id = configURL3.player2id;

class PlayerStats2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error : null,
      balace : 1000000,
      teamname : null,
      twitter : null,
      country_id : null,
      national_team : null,
      founded : null,
      logo_path : null,
      venue_id : null
    }
    this.tokenName = [];
    this.tokenbal = [];

    this.getFullData = this.getFullData.bind(this);
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


  render(){
    return (
      <>
        <div className="market-news mt15">
          <h2 className="heading">{this.state.fullname}</h2>
          <ul>
            <li>
              <Link to="/news-details">

                <img className="ProfileImage" src={this.state.logo_path} /><p />
                <div>
                <h6>Team Name: <small>{this.state.teamname}</small></h6>
                <h6>Twitter: <small>{this.state.twitter}</small></h6>
                <h6>Country: <small>{this.state.country_id}</small></h6>
                <h6>National Team: <small>{this.state.national_team}</small></h6>
                <h6>Founded: <small>{this.state.founded}</small></h6>
                <h6>Venue : <small>{this.state.venue_id}</small></h6>
                </div>

              </Link>
            </li>
          </ul>
        </div>
      </>
    );
  }

  async componentDidMount(){
    let fulldata = await this.getFullData();
    if(fulldata){
      this.setState({
      teamname : fulldata.team.data.name,
      twitter : fulldata.team.data.twitter,
      country_id : fulldata.team.data.country_id,
      national_team : fulldata.team.data.national_team,
      founded : fulldata.team.data.founded,
      logo_path : fulldata.team.data.logo_path,
      venue_id : fulldata.team.data.venue_id
      });
    }

    //get balace
    const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
    const networkId = await web3.eth.net.getId();
    for (var i = 0; i < Object.entries(tokens).length; i++) {
      this.tokenName.push(Object.entries(tokens)[i][0])
    }
    for (var i = 0; i < this.tokenName.length; i++) {
      var token = tokens[this.tokenName[i]].default;
      var tokenInst = new web3.eth.Contract(token.abi, token.networks[networkId].address)
      let bal = await tokenInst.methods.totalSupply().call();
      let bal_burned = await tokenInst.methods.balanceOf(configURL.deadWallet).call();
      this.tokenbal.push((bal - bal_burned) / (10 ** 18));
      if(this.props.id == this.tokenName[i]){
        this.setState ({
          balace : (1000000 - bal_burned/(10 ** 18))
        });
      }
    }
  }

  
}
function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(PlayerStats2)
