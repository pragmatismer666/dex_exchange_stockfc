import Web3 from 'web3'
import makeBatchRequest from 'web3-batch-request'
import React, { Component } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from 'react-redux'
import tokens from "../store/tokens";
import Exchanges from "../store/exchanges";
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import {
    accountSelector, tokenBalanceSelector, etherBalanceSelector
} from "../store/selectors";

import configURL from '../config/endpoints.json'
import configURL2 from '../config/player2id.json'
import configURL3 from '../config/fullnames.json'

const IMGURL = configURL.imgURL;
var player2id = configURL2.player2id;
const fullname = configURL3.fullname;


class PortfolioList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenbal: [],
            exchangeses: [],
            token_cost: [],
            token_price: [],
            token_percent: [],
            tokenName: [],
            loading: false,
            exchangeName: [],
            isOpen: false
        }

        this.readAccountDappValue = this.readAccountDappValue.bind(this);
    }

    readAccountDappValue = async (account1) => {
        if (account1 == null || account1 == undefined)
            return;
        let {
            loading,
            tokenName,
            exchangeName,
            tokenbal,
            exchangeses,
            token_cost,
            token_price,
            token_percent,
        } = this.state;
        tokenbal = [];
        this.setState( tokenbal, async () => { 
            exchangeses = [];
            token_cost = [];
            token_price = [];
            tokenName = [];
            exchangeName = [];
            const web3 = new Web3(
                new Web3.providers.HttpProvider("https://data.stocksfc.com:3200")
            );
            const networkId = await web3.eth.net.getId();
            for (var i = 0; i < Object.entries(tokens).length; i++) {
                tokenName.push(Object.entries(tokens)[i][0]);
                exchangeName.push(Object.entries(Exchanges)[i][0]);
            }
            // batchRequest ==>;
            var batch = new web3.eth.BatchRequest();
            for (var i = 0; i < tokenName.length; i++) {
                var token = tokens[tokenName[i]].default;
                var exchang = Exchanges[exchangeName[i]].default;
                var tokenInst = new web3.eth.Contract(
                    token.abi,
                    token.networks[networkId].address
                );
                // let bal = await tokenInst.methods.balanceOf(account1).call();
                this.addBatchItem(tokenInst, batch, account1, token);
                // batch.add(tokenInst.methods.balanceOf(account1).call.request({from: '0x0000000000000000000000000000000000000000'}, (err, res) => {
                //     tokenbal.push(res / 10 ** 18);
                // }));
                exchangeses.push(
                    new web3.eth.Contract(exchang.abi, exchang.networks[networkId].address)
                );
            }
            batch.execute();
            // <==
            for (var j = 0; j < exchangeName.length; j++) {
                var token = tokens[tokenName[j]].default;
                var tradeStream = await exchangeses[j].getPastEvents("Trade", {
                    fromBlock: 0,
                    toBlock: "latest",
                });
                var filledOrders = tradeStream.map((event) => event.returnValues);
                var tmp_cost = 0;
                var tmp_price = 0;
                var tmp_percent = 0;
                if (filledOrders.length > 0) {
                    var cnt = 0;
                    for (var i = 0; i < filledOrders.length; i++) {
                        let unix_timestamp = filledOrders[i].timestamp;
                        var date = new Date(unix_timestamp * 1000);
                        var pricedate = date.getDate();
                        var currentdate = new Date();
                        var datetime = currentdate.getDate();
                        if (datetime - pricedate == 1) {
                            if (
                                filledOrders[i].tokenGive == token.networks[networkId].address
                            ) {
                                cnt++;
                                tmp_percent =
                                    (tmp_percent * (cnt - 1) +
                                        filledOrders[i].amountGet / filledOrders[i].amountGive) /
                                    cnt;
                            } else {
                                cnt++;
                                tmp_percent =
                                    (tmp_percent * (cnt - 1) +
                                        filledOrders[i].amountGive / filledOrders[i].amountGet) /
                                    cnt;
                            }
                        }
                        if (
                            filledOrders[i].userFill != filledOrders[i].user &&
                            filledOrders[i].userFill == account1 &&
                            filledOrders[i].tokenGive == token.networks[networkId].address
                        ) {
                            tmp_cost += filledOrders[i].amountGet / 10 ** 18;
                        }
                        if (
                            filledOrders[i].userFill != filledOrders[i].user &&
                            filledOrders[i].user == account1 &&
                            filledOrders[i].tokenGet == token.networks[networkId].address
                        ) {
                            tmp_cost += filledOrders[i].amountGive / 10 ** 18;
                        }
                    }
                    if (
                        filledOrders[filledOrders.length - 1].tokenGive ==
                        token.networks[networkId].address
                    ) {
                        tmp_price =
                            filledOrders[filledOrders.length - 1].amountGet /
                            filledOrders[filledOrders.length - 1].amountGive;
                    } else {
                        tmp_price =
                            filledOrders[filledOrders.length - 1].amountGive /
                            filledOrders[filledOrders.length - 1].amountGet;
                    }
                }
                token_price.push(tmp_price);
                token_cost.push(tmp_cost);
                token_percent.push(tmp_percent);
            }
            loading = true;
            this.setState({
                loading,
                tokenName,
                exchangeName,
                // tokenbal,
                exchangeses,
                token_cost,
                token_price,
                token_percent,
            });
        })
    };

    addBatchItem = (tokenInst, tokenbal_batch, account1, token) => {
        // console.log(token.contractName);
        tokenbal_batch.add(tokenInst.methods.balanceOf(account1).call.request({ from: '0x0000000000000000000000000000000000000000' }, (err, res) => {
            // console.log(token, res, "tokenbal");
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
        else {
            this.readAccountDappValue(localStorage.getItem("account-address"));
        }
    }

    render() {
        let { loading, tokenName, exchangeName, tokenbal, exchangeses, token_cost, token_price, token_percent } = this.state;

        return (
            <>
                <div className="markets pb70">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="markets-pair-list">
                                    <Tabs defaultActiveKey="Portfolio">
                                        <Tab eventKey="Portfolio" title="Portfolio">
                                            <div className="table-responsive">
                                                <table className="table star-active">
                                                    <thead>
                                                        <tr>
                                                            <th>Player</th>
                                                            <th>Photo</th>
                                                            <th>Amount</th>
                                                            <th>Cost Paid</th>
                                                            <th>Current Value</th>
                                                            <th>Total Value</th>
                                                            <th>24 HR Change</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            tokenName.map((obj, key) => (
                                                                tokenbal[key] > 0 ? <tr data-href="exchange-light.html">
                                                                    <td><a href={`/players/${obj}`}>{fullname[obj]}</a></td>
                                                                    <td><img src={`${IMGURL + player2id[obj]}.png`} alt="eth" style={{ width: "60%" }} /></td>
                                                                    <td><a href={`/players/${obj}`}>{obj}</a></td>
                                                                    <td>{eval((tokenbal[key]).toFixed(2))}</td>
                                                                    {token_cost[key] ? <td>{eval((token_cost[key]).toFixed(2))}</td> : <td>0</td>}
                                                                    {token_price[key] ? <td>{eval((token_price[key]).toFixed(2))}</td> : <td>0</td>}
                                                                    {tokenbal[key] && token_price[key] ? <td>{eval(token_price[key].toFixed(4))}</td> : <td>0</td>}
                                                                    {/* {
                                  token_cost[key] !== 0 && token_cost[key] ? 
                                  (
                                  <td className="green">{eval(((tokenbal[key] * token_price[key] - token_cost[key]) * 100 / token_cost[key]).toFixed(2))}</td> 
                                  ): 
                                  <td>0</td>
                                  } */}
                                                                    {
                                                                        token_percent[key] ? (
                                                                            (((100 * token_price[key]) / token_percent[key] - 100) >= 0) ?
                                                                                (<td className="green"><up>{
                                                                                    eval((
                                                                                        ((100 * token_price[key]) /
                                                                                            token_percent[key]) - 100
                                                                                    ).toFixed(0)
                                                                                    )}%</up></td>)
                                                                                : (<td className="red"><down>{eval(
                                                                                    (
                                                                                        ((100 * token_price[key]) /
                                                                                            token_percent[key] - 100)
                                                                                    ).toFixed(0)
                                                                                )}%</down></td>)) : (
                                                                            <td className="green">0%</td>
                                                                        )
                                                                    }
                                                                </tr> : <></>
                                                            )
                                                            )
                                                        }
                                                        {!loading && <Spinner type='table' />}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                    <div className="text-center">
                                        {
                                            loading && <a href="#!" className="load-more btn">
                                                Load More <i className="icon ion-md-arrow-down"></i>
                                            </a>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
function mapStateToProps(state) {
    return {
        account: accountSelector(state),
        etherBalance: etherBalanceSelector(state),
    }
}

export default connect(mapStateToProps)(PortfolioList)
