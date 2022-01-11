import Web3 from 'web3'
import React, { Component } from 'react'
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from 'react-redux'
import tokens from "../store/tokens";
import Exchanges from "../store/exchanges";
import Spinner from './Spinner'
import {
	accountSelector,
} from "../store/selectors";
import { Tabs, Tab } from 'react-bootstrap';

import configURL from '../config/wallets.json'
import configURL2 from '../config/endpoints.json'
import configURL3 from '../config/player2id.json'
import configURL4 from '../config/fullnames.json'

const deadwallet = configURL.deadWallet;
const IMGURL = configURL2.imgURL;
var player2id = configURL3.player2id;
const fullname = configURL4.fullname;

class PlayersList extends Component {
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
			isOpen: false
		}
		this.readAccountDappValue = this.readAccountDappValue.bind(this);
	}

	readAccountDappValue = async (account1) => {
		let { loading, tokenName, exchangeName, tokenbal, exchangeses, token_percent, token_price, sell_price, buy_price } = this.state;
		tokenbal = [];
		exchangeses = [];
		token_percent = [];
		token_price = [];
		sell_price = [];
		buy_price = [];
		tokenName = [];
		exchangeName = [];
		const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
		const networkId = await web3.eth.net.getId();
		for (var i = 0; i < Object.entries(tokens).length; i++) {
			tokenName.push(Object.entries(tokens)[i][0])
			exchangeName.push(Object.entries(Exchanges)[i][0])
		}
		// batch request ==>
		// let bals = [];
		// let minus_balance_burneds = [];
		// var balance_batch = new web3.eth.BatchRequest();
		// var total_batch = new web3.eth.BatchRequest();
		for (var i = 0; i < tokenName.length; i++) {
			var token = tokens[tokenName[i]].default;
			var exchang = Exchanges[exchangeName[i]].default;
			var tokenInst = new web3.eth.Contract(token.abi, token.networks[networkId].address);
			let bal = await tokenInst.methods.totalSupply().call()
			let minus_balance_burned = await tokenInst.methods.balanceOf(account1).call();
			tokenbal.push((bal - minus_balance_burned) / (10 ** 18));
			// balance_batch.add(tokenInst.methods.balanceOf(account1).call.request({ from: '0x0000000000000000000000000000000000000000' }, (err, res) => {
			// 	// console.log(token, res, "tokenbal");
			// 	// var balance = {};
			// 	// balance[token.contractName] = res;
			// 	minus_balance_burneds.push(res);
			// }));
			// total_batch.add(tokenInst.methods.totalSupply().call.request({ from: '0x0000000000000000000000000000000000000000' }, (err, res) => {
			// 	// console.log(token, res, "tokenbal");
			// 	// var balance = {};
			// 	// balance[token.contractName] = res;
			// 	bals.push(res);
			// }));
			exchangeses.push(new web3.eth.Contract(exchang.abi, exchang.networks[networkId].address))
		}
		// balance_batch.execute();
		// total_batch.execute();
		// <==
		for (var j = 0; j < exchangeName.length; j++) {
			var token = tokens[tokenName[j]].default;
			var tradeStream = await exchangeses[j].getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
			var filledOrders = await tradeStream.map((event) => event.returnValues)
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
		// for ( let k = 0; k < bals.length; k++ ) {
		// 	tokenbal.push((bals[k] - minus_balance_burneds[k]) / (10 ** 18));
		// }
		loading = true;
		this.setState({ loading, tokenName, exchangeName, 
			tokenbal, 
			exchangeses, token_percent, token_price, sell_price, 
			buy_price,
		});
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
		let { loading, tokenName, exchangeName, tokenbal, exchangeses, token_percent, token_price, sell_price, buy_price } = this.state;

		return (
			<>
				<div className="markets pb70">
					<div className="container-fluid">
						<div className="row">
							<div className="col-md-12">
								<div className="markets-pair-list">
									<Tabs defaultActiveKey="PL">
										<Tab eventKey="PL" title="★ PL">
											<div className="table-responsive">
												<table className="table star-active">
													<thead>
														<tr>
															<th>Photo</th>
															<th>Token</th>
															<th>Amount</th>
															<th>Current Value</th>
															<th>Percentage</th>
															<th>Best sell price</th>
															<th>Best buy price</th>
														</tr>
													</thead>
													<tbody>
														{
															tokenName.map((obj, key) => (
																tokenbal[key] ? <tr data-href="exchange-light.html">
																	<td><img src={`${IMGURL + player2id[obj]}.png`} style={{ width: "60%" }} /></td>
																	<td><a href={`/players/${obj}`}>{fullname[obj]}</a></td>
																	<td><img src={'img/icon/1.png'} alt="eth" />{eval((tokenbal[key]).toFixed(1))}</td>
																	{token_price[key] ? <td>{eval((token_price[key]).toFixed(2))}</td> : <td>0</td>}
																	{token_percent[key] !== 0 && token_percent[key] ?
																		((((100 * token_price[key]) / token_percent[key] - 100) >= 0) ?
																			<td className="green">{eval((100 * token_price[key] / token_percent[key] - 100).toFixed(0))}%</td> :
																			<td className="red">{eval((100 * token_price[key] / token_percent[key] - 100).toFixed(0))}%</td>
																		)
																		: <td className="green">0%</td>
																	}
																	{sell_price[key] ? <td><a href={`/players/${obj}`}><Button variant="success">{(sell_price[key]).toFixed(2)} Sell</Button></a></td>
																		: <td><Button variant="warning">Unavailable</Button></td>}
																	{buy_price[key] ? <td><a href={`/players/${obj}`}><Button variant="danger">{(buy_price[key]).toFixed(2)} Buy</Button></a></td>
																		: <td><Button variant="warning">Unavailable</Button></td>}
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
	}
}

export default connect(mapStateToProps)(PlayersList)
