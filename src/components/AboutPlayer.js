import { connect } from 'react-redux'
import React, { Component } from 'react'
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


class AboutPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgurl: null,
            fullname: null,
            nationality: null,
            birthday: null,
            height: null,
            weight: null,
            error: null,
            balace: 1000000,
            //new state for deadwallet
            // tokenbal: [],
            // exchangeses: [],
            // token_percent: [],
            // token_price: [],
            // sell_price: [],
            // buy_price: [],
            // tokenName: [],
            // loading: false,
            // exchangeName: [],
            // isOpen: false
        }
        this.tokenName = [];
        this.tokenbal = [];

        this.getFullData = this.getFullData.bind(this);
        // this.readAccountDappValue = this.readAccountDappValue.bind(this);
    }


    // readAccountDappValue = async (account1) => {
    //   let {loading, tokenName, exchangeName, tokenbal, exchangeses, token_percent, token_price, sell_price, buy_price } = this.state;
    //   tokenbal = [];
    //   exchangeses = [];
    //   token_percent = [];
    //   token_price = [];
    //   sell_price = [];
    //   buy_price = [];
    //   tokenName = [];
    //   exchangeName = [];
    //   const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
    //   const networkId = await web3.eth.net.getId();
    //   for (var i = 0; i < Object.entries(tokens).length; i++) {
    //     tokenName.push(Object.entries(tokens)[i][0])
    //     exchangeName.push(Object.entries(Exchanges)[i][0])
    //   }
    //   for (var i = 0; i < tokenName.length; i++) {
    //     var token = tokens[tokenName[i]].default;
    //     var exchang = Exchanges[exchangeName[i]].default;
    //     var tokenInst = new web3.eth.Contract(token.abi, token.networks[networkId].address)
    //     let bal = await tokenInst.methods.totalSupply().call();
    //     let bal_burned = await tokenInst.methods.balanceOf(deadwallet).call();
    //     tokenbal.push((bal - bal_burned) / (10 ** 18));
    //     exchangeses.push(new web3.eth.Contract(exchang.abi, exchang.networks[networkId].address))
    //   }
    //   for (var j = 0; j < exchangeName.length; j++) {
    //     var token = tokens[tokenName[j]].default;
    //     var tradeStream = await exchangeses[j].getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
    //     var filledOrders = await tradeStream.map((event) => event.returnValues)
    //     const cancelStream = await exchangeses[j].getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
    //     // Format cancelled orders
    //     const cancelledOrders = cancelStream.map((event) => event.returnValues)
    //     const orderStream = await exchangeses[j].getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })
    //     // Format order stream
    //     const allOrders = orderStream.map((event) => event.returnValues)
    //     var tmp_percent = 0;
    //     var tmp_price = 0;
    //     var max_price = 0;
    //     var min_price = 0;
    //     if (filledOrders.length > 0) {
    //       var cnt = 0;
    //       for (var i = 0; i < filledOrders.length; i++) {
    //         let unix_timestamp = filledOrders[i].timestamp
    //         var date = new Date(unix_timestamp * 1000);
    //         var pricedate = date.getDate();
    //         var currentdate = new Date();
    //         var datetime = currentdate.getDate();
    //         if (datetime - pricedate == 1) {
    //           if (filledOrders[i].tokenGive == token.networks[networkId].address) {
    //             cnt++
    //             tmp_percent = (tmp_percent * (cnt - 1) + filledOrders[i].amountGet / filledOrders[i].amountGive) / cnt;
    //           }
    //           else {
    //             cnt++
    //             tmp_percent = (tmp_percent * (cnt - 1) + filledOrders[i].amountGive / filledOrders[i].amountGet) / cnt;
    //           }
    //         }
    //       }
    //       if (filledOrders[filledOrders.length - 1].tokenGive == token.networks[networkId].address) {
    //         tmp_price = filledOrders[filledOrders.length - 1].amountGet / filledOrders[filledOrders.length - 1].amountGive;
    //       }
    //       else {
    //         tmp_price = filledOrders[filledOrders.length - 1].amountGive / filledOrders[filledOrders.length - 1].amountGet;
    //       }
    //     }
    //     if (allOrders.length > 0) {
    //       var cnt = 0;
    //       var flag = false;
    //       for (var i = 0; i < allOrders.length; i++) {
    //         var cancel_flag = false;
    //         for (var k = 0; k < cancelledOrders.length; k++) {
    //           if (allOrders[i].id == cancelledOrders[k].id) {
    //             cancel_flag = true;
    //             break;
    //           }
    //         }
    //         if (cancel_flag) continue;
    //         for (var l = 0; l < filledOrders.length; l++) {
    //           if (allOrders[i].id == filledOrders[l].id) {
    //             cancel_flag = true;
    //           }
    //         }
    //         if (cancel_flag) continue;
    //         if (!flag) {
    //           if (allOrders[i].tokenGive == token.networks[networkId].address) {
    //             // max_price = allOrders[i].amountGet / allOrders[i].amountGive;
    //             min_price = allOrders[i].amountGet / allOrders[i].amountGive;
    //             flag = true;
    //           }
    //           else {
    //             max_price = allOrders[i].amountGive / allOrders[i].amountGet;
    //             // min_price = allOrders[i].amountGive / allOrders[i].amountGet;
    //             flag = true;
    //           }

    //         }
    //         else {
    //           if (allOrders[i].tokenGive == token.networks[networkId].address) {
    //             if (flag && min_price == 0) { min_price = 99999 }
    //             // if (max_price < allOrders[i].amountGet / allOrders[i].amountGive) { max_price = allOrders[i].amountGet / allOrders[i].amountGive; }
    //             if (min_price > allOrders[i].amountGet / allOrders[i].amountGive) { min_price = allOrders[i].amountGet / allOrders[i].amountGive; }
    //           }
    //           else {
    //             if (max_price < allOrders[i].amountGive / allOrders[i].amountGet) { max_price = allOrders[i].amountGive / allOrders[i].amountGet; }
    //             // if (min_price > allOrders[i].amountGive / allOrders[i].amountGet) { min_price = allOrders[i].amountGive / allOrders[i].amountGet; }
    //           }

    //         }
    //       }
    //     }
    //     sell_price.push(max_price);
    //     buy_price.push(min_price);
    //     token_price.push(tmp_price);
    //     token_percent.push(tmp_percent);
    //   }
    //   loading=true;
    //   this.setState({loading, tokenName, exchangeName, tokenbal, exchangeses, token_percent, token_price, sell_price, buy_price });
    // }

    // openModal = () => {
    //   this.setState({ isOpen: true }, () => {
    //     this.readAccountDappValue(this.props.account);
    //   });
    // }
    // closeModal = () => this.setState({ isOpen: false });


    // getFullName(){
    //   return this.state.fulldata.fullname;
    // }

    getImgUrl() {
        let playerName = this.props.id, id;
        id = player2id[playerName];
        return IMGURL + id + '.png';
    }

    async getFullData() {
        let playerName = this.props.id, id, url, fulldata;
        id = player2id[playerName];
        url = DATAURL + id;
        await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "text/plain"
            }
        }).then(response => response.json())
            .then((data) => {
                fulldata = data;
            }).catch(error => {
                this.setState({ error: error });
            });
        return fulldata;
    }


    render() {
        return (
            <>
                <div className="market-news mt15">
                    <h2 className="heading">{this.state.fullname}</h2>
                    <ul>
                        <li>
                            <Link to={"/playerstats/" + this.props.id}>

                                <img className="ProfileImage" src={this.state.imgurl} /><p />
                                <div>
                                    <h6>Name: <small>{this.state.fullname}</small></h6>
                                    <h6>Country: <small>{this.state.nationality}</small></h6>
                                    <h6>Date Of Birth: <small>{this.state.birthday}</small></h6>
                                    <h6>Height: <small>{this.state.height}</small></h6>
                                    <h6>Weight: <small>{this.state.weight}</small></h6>
                                    <h6>Total Supply: <small>{this.state.balace}</small></h6>
                                </div>

                            </Link>
                        </li>
                    </ul>
                </div>
            </>
        );
    }

    async componentDidMount() {
        let fulldata = await this.getFullData();
        this.setState({ imgurl: this.getImgUrl() });
        if (fulldata) {
            this.setState({
                fullname: fulldata.fullname,
                nationality: fulldata.nationality,
                birthday: fulldata.birthdate,
                height: fulldata.height,
                weight: fulldata.weight
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
            if (this.props.id == this.tokenName[i]) {
                this.setState({
                    balace: (1000000 - bal_burned / (10 ** 18))
                });
            }
        }

        // //for deadwallet
        // if (this.props.id) {
        //   this.readAccountDappValue(this.props.id);
        // }
        // else{
        //   this.readAccountDappValue(localStorage.getItem("account-address"));
        // }
    }

}
function mapStateToProps(state) {
    return {
    }
}

export default connect(mapStateToProps)(AboutPlayer)
