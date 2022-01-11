import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import {
    exchangeSelector,
    tokenSelector,
    orderBookSelector,
    tokenBalanceSelector,
    accountSelector,
    etherBalanceSelector,
    web3Selector,
    buyOrderSelector,
    sellOrderSelector
} from '../store/selectors'
import {
    buyOrderAmountChanged,
    buyOrderPriceChanged,
    sellOrderAmountChanged,
    sellOrderPriceChanged,
    etherBalanceLoaded,
    tokenBalanceLoaded,
} from '../store/actions'
import { db } from "./firebase/firebase";
import interactions from "../store/interactions";
import { Tabs, Tab } from 'react-bootstrap';
import Swal from 'sweetalert2'
import { io } from "socket.io-client";
import config from "../config/wallets.json"

import MaskedInput from 'react-maskinput'

const socket = io("https://data.stocksfc.com:3000/");


socket.on("connect", () => {
});

const ShowForm = (props) => {
    const {
        dispatch,
        buyOrder,
        exchange,
        token,
        web3,
        account,
        sellOrder,
        showBuyTotal,
        showSellTotal,
        tokenBalance,
        etherBalance
    } = props

    // const { register, handleSubmit, control } = useForm();

    const [ethAmount, setEthAmount] = useState("");
    const [ethPrice, setEthPrice] = useState("");

    const [sellethAmount, setsellEthAmount] = useState("");
    const [sellethPrice, setsellEthPrice] = useState("");

    const [methAmount, msetEthAmount] = useState("");
    const [methPrice, msetEthPrice] = useState("");

    const [msellethAmount, msetsellEthAmount] = useState("");
    const [msellethPrice, msetsellEthPrice] = useState("");
    const [showbuttonFlag, setshowbuttonFlag] = useState(true);

    const onbuyChangeEthAmount = (e) => {
        let realvalue = e.target.value;
        if (realvalue) {
            realvalue = parseInt(realvalue);
            if (realvalue < 0)
                realvalue = 0;
            else if (realvalue > 999999)
                realvalue = 999999;
        }
        dispatch(buyOrderAmountChanged(realvalue))
        setEthAmount(realvalue);
    }

    const onbuyChangeEthPrice = (e) => {
        let realvalue = e.target.value;
        if (realvalue) {
            realvalue = parseFloat(realvalue);
            if (realvalue < 0.01) {
                realvalue = 0.01;
            } else if (realvalue <= 9999.99) {
                realvalue = eval(realvalue.toFixed(2));
            } else {
                realvalue = 9999.99;
            }
        }
        dispatch(buyOrderPriceChanged(realvalue))
        setEthPrice(realvalue);
    }

    const onsellChangeEthAmount = (e) => {
        let realvalue = e.target.value;
        if (realvalue) {
            realvalue = parseInt(realvalue);
            if (realvalue < 0)
                realvalue = 0;
            else if (realvalue > 999999)
                realvalue = 999999;
        }
        dispatch(sellOrderAmountChanged(realvalue))
        setsellEthAmount(realvalue);
    }

    const onsellChangeEthPrice = (e) => {
        let realvalue = e.target.value;
        if (realvalue) {
            realvalue = parseFloat(realvalue);
            if (realvalue < 0.01) {
                realvalue = 0.01;
            } else if (realvalue <= 9999.99) {
                realvalue = eval(realvalue.toFixed(2));
            } else {
                realvalue = 9999.99;
            }
        }
        dispatch(sellOrderPriceChanged(realvalue))
        setsellEthPrice(realvalue);
    }

    const onbuyChangeEthAmountMarket = (e) => {
        dispatch(buyOrderAmountChanged(e.target.value))
        msetEthAmount(e.target.value);
        var minprice = 0;
        if (props.orderBook.sellOrders.length > 0) {
            var minprice = props.orderBook.sellOrders[0].tokenPrice;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Retry to type limit amount. Can't use price 0!",
            });
            return;
        }
        for (var i = 0; i < props.orderBook.sellOrders.length; i++) {
            if (minprice > props.orderBook.sellOrders[i].tokenPrice) {
                minprice = props.orderBook.sellOrders[i].tokenPrice
            }
        }
        dispatch(buyOrderPriceChanged(minprice))
        msetEthPrice(minprice);
    }

    const onsellChangeEthAmountMarket = (e) => {
        dispatch(sellOrderAmountChanged(e.target.value))
        msetsellEthAmount(e.target.value);
        var maxprice = 0;
        if (props.orderBook.buyOrders > 0) {
            maxprice = props.orderBook.sellOrders[0].tokenPrice;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Retry to type limit amount. Can't use price 0!",
            })
            return;
        }
        for (var i = 0; i < props.orderBook.buyOrders.length; i++) {
            if (maxprice < props.orderBook.buyOrders[i].tokenPrice) {
                maxprice = props.orderBook.buyOrders[i].tokenPrice
            }
        }
        dispatch(sellOrderPriceChanged(maxprice))
        msetsellEthPrice(maxprice);
    }

    const updatebalance = async (account) => {
        const etherBalance = await web3.eth.getBalance(account)
        dispatch(etherBalanceLoaded(etherBalance))
        // Token balance in wallet
        const tokenBalance = await token.methods.balanceOf(account).call()
        dispatch(tokenBalanceLoaded(tokenBalance))
    }

    useEffect(() => {
        socket.on("broadcast_flag", (data) => {
            let msg = JSON.parse(data);
            if (msg.token === token.options.address) {
                if (msg.state === 'start') {
                    setshowbuttonFlag(false);
                } else {
                    if (account) {
                        updatebalance(account);
                    }
                    setshowbuttonFlag(true);
                    setEthAmount('');
                    setsellEthAmount('');
                    setEthPrice('');
                    setsellEthPrice('');
                    // window.location.reload();
                }
            }
    
        });
    }, []);

    useEffect(() => {
        db.collection('fill').doc(account).onSnapshot((snap) => {
            if (snap.data()) {
                let { price, amount, ordertype } = snap.data();
                if (ordertype == "buy") {
                    if (ethPrice !== price) {
                        dispatch(buyOrderPriceChanged(price))
                        setEthPrice(price);
                        db.collection('fill').doc(account).set({
                            ordertype: 0,
                            price: 0,
                            amount: 0,
                            flag: 0
                        })
                    }
                    if (ethAmount !== amount) {
                        dispatch(buyOrderAmountChanged(amount))
                        setEthAmount(amount);
                        db.collection('fill').doc(account).set({
                            ordertype: 0,
                            price: 0,
                            amount: 0,
                            flag: 0
                        })
                    }
                }
                if (ordertype == "sell") {
                    if (sellethAmount !== price) {
                        dispatch(sellOrderPriceChanged(price))
                        setsellEthPrice(price);
                        db.collection('fill').doc(account).set({
                            ordertype: 0,
                            price: 0,
                            amount: 0,
                            flag: 0
                        })
                    }
                    if (sellethPrice !== amount) {
                        dispatch(sellOrderAmountChanged(amount))
                        setsellEthAmount(amount);
                        db.collection('fill').doc(account).set({
                            ordertype: 0,
                            price: 0,
                            amount: 0,
                            flag: 0
                        })
                    }
                }
            }
        })
    }, []);

    let id = props.id;
    const { makeBuyOrder, makeSellOrder } = !interactions[id] ? interactions["cronaldo"] : interactions[id];
    return (
        <>{showbuttonFlag ? <Tabs defaultActiveKey="limit">
            <Tab eventKey="limit" title="Limit">
                <div className="d-flex justify-content-between">
                    <div className="market-trade-buy">
                        <form action="#" onSubmit={(event) => {
                            event.preventDefault(id)
                            makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account, tokenBalance, etherBalance, props.orderBook.sellOrders, id)
                        }}>
                            <p>Cash Balance {etherBalance ? etherBalance : ""}</p>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    onChange={(e) => onbuyChangeEthPrice(e)}
                                    placeholder="Price"
                                    value={ethPrice}
                                    // max="9999.99"
                                    // min="0.01"
                                    required
                                // strict="true"
                                />
                                {/* <MaskedInput
                    className="form-control"
                    placeholder="Price"
                    // mask="00.00"
                    size="7"
                    value={ethPrice}
                    onChange={(e) => onbuyChangeEthPrice(e)}
                /> */}
                                <div className="input-group-append">
                                    <span className="input-group-text">Price</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Amount"
                                    onChange={(e) => onbuyChangeEthAmount(e)}
                                    value={ethAmount}
                                    min="0"
                                    max="100000"
                                    mask="999999"
                                    required
                                    strict="true"
                                />
                                {/* <MaskedInput
                    className="form-control"
                    placeholder="Amount"
                    mask="000000"
                    size="6"
                    value={ethAmount}
                    onChange={(e) => onbuyChangeEthAmount(e)}
                  /> */}
                                <span className="input-group-text">Amount</span>
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Total"
                                    defaultValue={(ethPrice * ethAmount).toFixed(2)}
                                    required
                                    strict="true"
                                />
                                <span className="input-group-text">TOTAL</span>
                            </div>
                            <p>Shareburn={config.shareburnFee}%</p>
                            {
                                ethAmount ? <p>You will receive = {ethAmount * (1 - 0.01 * parseInt(config.shareburnFee))} Tokens</p> : <></>
                            }
                            <button type="submit" className="btn buy" id="btn-buy">
                                Buy
                            </button>
                        </form>
                    </div>
                    <div className="market-trade-sell">
                        <form action="#" onSubmit={(event) => {
                            event.preventDefault()
                            makeSellOrder(dispatch, exchange, token, web3, sellOrder, account, tokenBalance, etherBalance, props.orderBook.buyOrders, id)
                        }}>
                            <p>Token Balance {tokenBalance ? tokenBalance : ""}</p>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Price"
                                    value={sellethPrice}
                                    onChange={(e) => onsellChangeEthPrice(e)}
                                    // max="9999.99"
                                    // min="0.01"
                                    required
                                // strict="true"
                                />
                                {/* <MaskedInput
                    className="form-control"
                    placeholder="Price"
                    mask="00.00"
                    size="5"
                    value={sellethPrice}
                    onChange={(e) => onsellChangeEthPrice(e)}
                /> */}
                                <div className="input-group-append">
                                    <span className="input-group-text">Price</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Amount"
                                    value={sellethAmount}
                                    onChange={(e) => onsellChangeEthAmount(e)}
                                    min="0"
                                    max="100000"
                                    required
                                    strict="true"
                                />
                                {/* <MaskedInput
                    className="form-control"
                    placeholder="Amount"
                    mask="000000"
                    size="6"
                    value={sellethAmount}
                    onChange={(e) => onsellChangeEthAmount(e)}
                /> */}

                                <span className="input-group-text">Amount</span>
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Total"
                                    defaultValue={(sellethAmount * sellethPrice).toFixed(2)}
                                    required
                                    strict="true"
                                />
                                <span className="input-group-text">TOTAL</span>
                            </div>
                            <p>Fee={config.feesFee}%</p>
                            {
                                sellethAmount ? <p>You will receive = {(sellethAmount * sellethPrice * (1 - 0.01 * parseInt(config.feesFee))).toFixed(2)} Tokens</p> : <></>
                            }
                            <button type="submit" className="btn sell" id="btn-sell">Sell</button>
                        </form>
                    </div>
                </div>
            </Tab>
            <Tab eventKey="market" title="Market">
                <div className="d-flex justify-content-between">
                    <div className="market-trade-buy">
                        <form action="#" onSubmit={(event) => {
                            event.preventDefault()
                            makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account, tokenBalance, etherBalance, props.orderBook.sellOrders, id)
                        }}>
                            <p>eth balance {etherBalance ? etherBalance : ""}</p>
                            <div className="input-group">
                                {/* <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  onChange={(e) => onbuyChangeEthAmountMarket(e)}
                  value={methAmount}
                  required
                  strict="true"
                /> */}
                                <MaskedInput
                                    className="form-control"
                                    placeholder="Amount"
                                    mask="000000"
                                    size="6"
                                    value={methAmount}
                                    onChange={(e) => onbuyChangeEthAmountMarket(e)}
                                />
                                <span className="input-group-text">SHARES</span>
                            </div>

                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Total"
                                    defaultValue={(methPrice * methAmount).toFixed(2)}
                                    required
                                    strict="true"
                                />
                                <span className="input-group-text">TOTAL</span>
                            </div>
                            <p>Shareburn={config.shareburnFee}%</p>
                            {
                                methAmount ? <p>You will receive = {methAmount * (1 - 0.01 * parseInt(config.shareburnFee))} Tokens</p> : <></>
                            }
                            <button type="submit" className="btn buy" >
                                Buy
                            </button>
                        </form>
                    </div>
                    <div className="market-trade-sell">
                        <form action="#" onSubmit={(event) => {
                            event.preventDefault()
                            makeSellOrder(dispatch, exchange, token, web3, sellOrder, account, tokenBalance, etherBalance, props.orderBook.buyOrders, id)
                        }}>
                            <p>user token balance {tokenBalance ? tokenBalance : ""}</p>
                            <div className="input-group">
                                {/* <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={msellethAmount}
                  onChange={(e) => onsellChangeEthAmountMarket(e)}
                  required
                  strict="true"
                /> */}
                                <MaskedInput
                                    className="form-control"
                                    placeholder="Amount"
                                    mask="000000"
                                    size="6"
                                    value={msellethAmount}
                                    onChange={(e) => onsellChangeEthAmountMarket(e)}
                                />
                                <span className="input-group-text">SHARES</span>
                            </div>

                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Total"
                                    defaultValue={(msellethAmount * msellethPrice).toFixed(2)}
                                    required
                                    strict="true"
                                />
                                <span className="input-group-text">TOTAL</span>
                            </div>
                            <p>Fee={config.feesFee}%</p>
                            {
                                msellethAmount ? <p>You will receive = {(msellethAmount * msellethPrice * (1 - 0.01 * parseInt(config.feesFee))).toFixed(2)} Tokens</p> : <></>
                            }
                            <button type="submit" className="btn sell">Sell</button>
                        </form>
                    </div>
                </div>
            </Tab>
        </Tabs> : <Spinner />}</>
    )
}

class MarketTrade extends Component {
    render() {

        return (
            <>
                <div className="market-trade">
                    <ShowForm {...this.props}></ShowForm>
                </div>
            </>
        );
    }
}
function mapStateToProps(state) {
    const buyOrder = buyOrderSelector(state)
    const sellOrder = sellOrderSelector(state)

    return {
        tokenBalance: tokenBalanceSelector(state),
        account: accountSelector(state),
        exchange: exchangeSelector(state),
        etherBalance: etherBalanceSelector(state),
        token: tokenSelector(state),
        web3: web3Selector(state),
        orderBook: orderBookSelector(state),
        buyOrder,
        sellOrder,
        showForm: !buyOrder.making && !sellOrder.making,
        showBuyTotal: buyOrder.amount && buyOrder.price,
        showSellTotal: sellOrder.amount && sellOrder.price
    }
}

export default connect(mapStateToProps)(MarketTrade)
