import Web3 from 'web3'
import React, { Component, useEffect, useState } from 'react'
import {  } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from 'react-redux'
import tokens from "../store/tokens";
import Exchanges from "../store/exchanges";
import Spinner from './Spinner'
import {
    accountSelector, tokenBalanceSelector,
} from "../store/selectors";
import { Tabs, Tab } from 'react-bootstrap';
import { isEmpty } from 'lodash';

import configURL from '../config/endpoints.json'
import configURL2 from '../config/player2id.json'
import configURL3 from '../config/fullnames.json'

const IMGURL = configURL.imgURL;
var player2id = configURL2.player2id;
var fullname = configURL3.fullname;


const ShowForm = (state) => {
    let { loading, tokenName, exchangeName, tokenbal, exchangeses, token_percent, token_price, sell_price, buy_price, matchflag, platform } = state;
    const [filtername, setFiltername] = useState("");
    const [flagArray, setFlagArray] = useState(matchflag);
    const [emptyFlag, setemptyFlag] = useState(true);

    const onChange = (e) => {
        setFiltername(e.target.value);
        if (e.target.value == "") {
            setemptyFlag(true);
        } else {
            setemptyFlag(false);
        }

        var flags = [];
        for (var i = 0; i < tokenName.length; i++) {
            if (fullname[tokenName[i]].toLowerCase().includes(filtername.toLowerCase())) {
                flags[i] = true;
            }
            else {
                flags[i] = false;
            }
        }
        if (e.target.value === '') {
            for (var i = 0; i < tokenName.length; i++) {
                flags[i] = true;
            }
        }
        setFlagArray(flags);
    }
    // useEffect(async () => {
    //   var flag=[]
    //   for (var i = 0; i < tokenName.length; i++) {
    //     flag[i] = true;
    // }
    //   await setFlagArray(flag);
    // }, []);
    return (
        <main className="market-pairs">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-sm">
                        <i className="icon ion-md-search"></i>
                    </span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Player"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={(e) => onChange(e)}
                    value={filtername}
                    required
                />
            </div>
            <Tabs defaultActiveKey="PL">
                <Tab eventKey="PL" title="PL">
                    <table className="table">
                        {/* <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Last Price</th>
                                <th>Change</th>
                            </tr>
                        </thead> */}
                        {(platform == "mobile") ? (
                            <tbody style={{ height: "100%" }}>
                                <tr className="text-center">
                                    <td className="text-center">Photo</td>
                                    <td><div style={{ width: '100%' }}>Name</div></td>
                                    <td>Price</td>
                                    <td>24 Hour</td>
                                </tr>
                                {
                                    tokenName.map((obj, key) => (
                                        flagArray[key] && tokenbal[key] && !emptyFlag ? <tr>
                                            {/* <td> <a href={`/players/${obj}`}>{obj}</a></td> */}
                                            <td> <img className="photo" src={`${IMGURL + player2id[obj]}.png`} /></td>
                                            <td><div style={{ width: '100%' }}><a href={`/players/${obj}`}>{fullname[obj]}</a></div></td>
                                            {token_price[key] ? <td>{eval((token_price[key]).toFixed(2))}</td> : <td>0</td>}
                                            {token_percent[key] !== 0 && token_percent[key] ?
                                                ((((100 * token_price[key]) / token_percent[key] - 100) >= 0) ?
                                                    <td className="green">{eval((100 * token_price[key] / token_percent[key] - 100).toFixed(0))}%</td> :
                                                    <td className="red">{eval((100 * token_price[key] / token_percent[key] - 100).toFixed(0))}%</td>
                                                )
                                                : <td>0</td>}
                                        </tr> : <></>
                                    )
                                    )
                                }
                            </tbody>
                        ) : (
                            <tbody>
                                <tr className="text-center">
                                    <td className="text-center">Photo</td>
                                    <td><div style={{ width: '100%' }}>Name</div></td>
                                    <td>Price</td>
                                    <td>24 Hour</td>
                                </tr>
                                {
                                    tokenName.map((obj, key) => (
                                        flagArray[key] && tokenbal[key] ? <tr>
                                            {/* <td> <a href={`/players/${obj}`}>{obj}</a></td> */}
                                            <td> <img className="photo" src={`${IMGURL + player2id[obj]}.png`} /></td>
                                            <td> <div style={{ width: '100%' }}><a href={`/players/${obj}`}>{fullname[obj]}</a></div></td>
                                            {token_price[key] ? <td>{eval((token_price[key]).toFixed(2))}</td> : <td>0</td>}
                                            {token_percent[key] !== 0 && token_percent[key] ?
                                                ((((100 * token_price[key]) / token_percent[key] - 100) >= 0) ?
                                                    <td className="green">{eval((100 * token_price[key] / token_percent[key] - 100).toFixed(0))}%</td> :
                                                    <td className="red">{eval((100 * token_price[key] / token_percent[key] - 100).toFixed(0))}%</td>
                                                )
                                                : <td>0</td>}
                                        </tr> : <></>
                                    )
                                    )
                                }
                            </tbody>
                        )}
                    </table>
                </Tab>
            </Tabs>
        </main>
    )
}
class MarketPairs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenbal: [],
            exchangeses: [],
            token_percent: [],
            token_price: [],
            sell_price: [],
            buy_price: [],
            tokenName: [],
            loading: false,
            exchangeName: [],
            isOpen: false,
            matchflag: []
        }

        this.readAccountDappValue = this.readAccountDappValue.bind(this);
    }

    readAccountDappValue = async (account1) => {
        let { loading, tokenName, exchangeName, tokenbal, exchangeses, token_percent, token_price, sell_price, buy_price, matchflag } = this.state;
        tokenbal = [];
        this.setState( tokenbal, async () => { 
            exchangeses = [];
            token_percent = [];
            token_price = [];
            sell_price = [];
            buy_price = [];
            tokenName = [];
            exchangeName = [];
            matchflag = [];
            const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
            const networkId = await web3.eth.net.getId();
            for (var i = 0; i < Object.entries(tokens).length; i++) {
                tokenName.push(Object.entries(tokens)[i][0])
                exchangeName.push(Object.entries(Exchanges)[i][0])
            }
            // batch request ==>
            var batch_tokenbal = new web3.eth.BatchRequest();
            for (var i = 0; i < tokenName.length; i++) {
                var token = tokens[tokenName[i]].default;
                var exchang = Exchanges[exchangeName[i]].default;
                var tokenInst = new web3.eth.Contract(token.abi, token.networks[networkId].address);
                // add request in batch_tokenbal
                // batch_tokenbal.add(tokenInst.methods.totalSupply().call.request({ from: '0x0000000000000000000000000000000000000000' }, (err, res) => {
                //     tokenbal.push(res);
                // }));
                this.addBatchItem(tokenInst, batch_tokenbal, token);
                exchangeses.push(new web3.eth.Contract(exchang.abi, exchang.networks[networkId].address));
            }
            // execute batch_tokenbal
            batch_tokenbal.execute();

            for (var j = 0; j < exchangeName.length; j++) {
                var token = tokens[tokenName[j]].default;
                var tradeStream = await exchangeses[j].getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
                var filledOrders = tradeStream.map((event) => event.returnValues)
                const cancelStream = await exchangeses[j].getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
                // Format cancelled orders
                const cancelledOrders = cancelStream.map((event) => event.returnValues)
                const orderStream = await exchangeses[j].getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })
                // Format order stream
                const allOrders = orderStream.map((event) => event.returnValues)
                var tmp_percent = 0;
                var tmp_price = 0;
                var max_price = 0;
                var min_price = 0;
                if (filledOrders.length > 0) {
                    var cnt = 0;
                    for (var i = 0; i < filledOrders.length; i++) {
                        let unix_timestamp = filledOrders[i].timestamp
                        var date = new Date(unix_timestamp * 1000);
                        var pricedate = date.getDate();
                        var currentdate = new Date();
                        var datetime = currentdate.getDate();
                        if (datetime - pricedate == 1) {
                            if (filledOrders[i].tokenGive == token.networks[networkId].address) {
                                cnt++
                                tmp_percent = (tmp_percent * (cnt - 1) + filledOrders[i].amountGet / filledOrders[i].amountGive) / cnt;
                            }
                            else {
                                cnt++
                                tmp_percent = (tmp_percent * (cnt - 1) + filledOrders[i].amountGive / filledOrders[i].amountGet) / cnt;
                            }
                        }
                    }
                    if (filledOrders[filledOrders.length - 1].tokenGive == token.networks[networkId].address) {
                        tmp_price = filledOrders[filledOrders.length - 1].amountGet / filledOrders[filledOrders.length - 1].amountGive;
                    }
                    else {
                        tmp_price = filledOrders[filledOrders.length - 1].amountGive / filledOrders[filledOrders.length - 1].amountGet;
                    }
                }
                if (allOrders.length > 0) {
                    var cnt = 0;
                    var flag = false;
                    for (var i = 0; i < allOrders.length; i++) {
                        var cancel_flag = false;
                        for (var k = 0; k < cancelledOrders.length; k++) {
                            if (allOrders[i].id == cancelledOrders[k].id) {
                                cancel_flag = true;
                                break;
                            }
                        }
                        if (cancel_flag) continue;
                        for (var l = 0; l < filledOrders.length; l++) {
                            if (allOrders[i].id == filledOrders[l].id) {
                                cancel_flag = true;
                            }
                        }
                        if (cancel_flag) continue;
                        if (!flag) {
                            if (allOrders[i].tokenGive == token.networks[networkId].address) {
                                // max_price = allOrders[i].amountGet / allOrders[i].amountGive;
                                min_price = allOrders[i].amountGet / allOrders[i].amountGive;
                                flag = true;
                            }
                            else {
                                max_price = allOrders[i].amountGive / allOrders[i].amountGet;
                                // min_price = allOrders[i].amountGive / allOrders[i].amountGet;
                                flag = true;
                            }

                        }
                        else {
                            if (allOrders[i].tokenGive == token.networks[networkId].address) {
                                if (flag && min_price == 0) { min_price = 99999 }
                                // if (max_price < allOrders[i].amountGet / allOrders[i].amountGive) { max_price = allOrders[i].amountGet / allOrders[i].amountGive; }
                                if (min_price > allOrders[i].amountGet / allOrders[i].amountGive) { min_price = allOrders[i].amountGet / allOrders[i].amountGive; }
                            }
                            else {
                                if (max_price < allOrders[i].amountGive / allOrders[i].amountGet) { max_price = allOrders[i].amountGive / allOrders[i].amountGet; }
                                // if (min_price > allOrders[i].amountGive / allOrders[i].amountGet) { min_price = allOrders[i].amountGive / allOrders[i].amountGet; }
                            }

                        }
                    }
                }
                sell_price.push(max_price);
                buy_price.push(min_price);
                token_price.push(tmp_price);
                token_percent.push(tmp_percent);
            }
            loading = true;
            for (var i = 0; i < tokenName.length; i++) {
                matchflag[i] = true;
            }
            this.setState({
                loading, tokenName, exchangeName,
                // tokenbal,
                exchangeses, token_percent, token_price, sell_price, buy_price, matchflag
            });
        })
    }

    addBatchItem = (tokenInst, tokenbal_batch, token) => {
        // console.log(token.contractName);
        tokenbal_batch.add(tokenInst.methods.totalSupply().call.request({ from: '0x0000000000000000000000000000000000000000' }, (err, res) => {
            var balance = {};
            balance[token.contractName] = res / 10 ** 18;
            this.setState(prevState => ({
                tokenbal: [...prevState.tokenbal, balance]
            }), () => {
                // console.log(this.state.tokenbal);
            });
        }));
    }
    
    openModal = () => {
        this.setState({ isOpen: true }, () => {
            this.readAccountDappValue(this.props.account);
        });
    }
    closeModal = () => this.setState({ isOpen: false });

    componentDidMount() {
        if (this.props.account) {
            this.readAccountDappValue(this.props.account);
        }
    }

    render() {
        let { loading, tokenName, exchangeName, tokenbal, exchangeses, token_percent, token_price, sell_price, buy_price, matchflag } = this.state;

        return (
            <>
                {loading ? <ShowForm {...this.state} platform={this.props.platform}></ShowForm> : 
                <table className="table">
                    <Spinner type='table' />
                </table>
                }
            </>
        )

    }
}

function mapStateToProps(state) {
    return {
        account: accountSelector(state),
    }
}

export default connect(mapStateToProps)(MarketPairs)
