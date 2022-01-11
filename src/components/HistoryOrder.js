import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import {
    myFilledOrdersLoadedSelector,
    myFilledOrdersSelector,
    myOpenOrdersLoadedSelector,
    myOpenOrdersSelector,
    exchangeSelector,
    accountSelector,
    tokenSelector,
    orderCancellingSelector,
    web3Selector,
} from '../store/selectors'
import {
    etherBalanceLoaded,
    tokenBalanceLoaded,
} from '../store/actions'

import interactions from "../store/interactions";

//for hide when make order
import { io } from "socket.io-client";
const socket = io("https://data.stocksfc.com:3000/");


const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const showMyFilledOrders = (props) => {
    const { myFilledOrders } = props
    return (
        <>
            {myFilledOrders.map((order) => {
                return (
                    <ul className="d-flex justify-content-between market-order-item" key={order.id}>
                        <li >{order.formattedTimestamp}</li>
                        <li>{order.orderType}</li>
                        <li >{order.tokenPrice}</li>
                        <li >{order.orderSign}{order.tokenAmount}</li>
                    </ul>
                )
            })}
        </>
    )
}

const showMyOpenOrders = (props) => {
    const { myOpenOrders, dispatch, exchange, account, token, web3 } = props
    let id = props.id;
    const { cancelOrder } = !interactions[id] ? interactions["cronaldo"] : interactions[id];

    const updatebalance = async (account) => {
        const etherBalance = await web3.eth.getBalance(account)
        // alert(etherBalance)
        dispatch(etherBalanceLoaded(etherBalance))
        // Token balance in wallet
        const tokenBalance = await token.methods.balanceOf(account).call()
        dispatch(tokenBalanceLoaded(tokenBalance))
    }

    const cancel_update = async (order) => {
        await cancelOrder(dispatch, exchange, order, account, token, true);
        await updatebalance(account);
    }

    return (
        <>
            {myOpenOrders.map((order) => {
                return (
                    <ul className="d-flex justify-content-between market-order-item" key={order.id}>
                        <li className="amount-type"  >{order.formattedTimestamp}</li>
                        <li>{order.orderType}</li>
                        <li >{order.tokenPrice}</li>
                        <li >{order.orderSign}{order.tokenAmount}</li>
                        <button style={{ border: 'none', outline: 'none' }}
                            className="text-muted cancel-order"
                            onClick={(e) => {
                                cancel_update(order);
                            }}
                        >X</button>
                    </ul>
                )
            })}
        </>
    )
}

const HistoryOrder = (props) => {
    const {
        dispatch,
        token,
        web3,
        account,
    } = props

    const [showFlag, setshowFlag] = useState(true);

    // const updatebalance = async (account) => {
    //   const etherBalance = await web3.eth.getBalance(account)
    //   dispatch(etherBalanceLoaded(etherBalance))
    //   // Token balance in wallet
    //   const tokenBalance = await token.methods.balanceOf(account).call()
    //   dispatch(tokenBalanceLoaded(tokenBalance))
    // }

    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket.id);
        });
        socket.on("broadcast_flag", (data) => {
            let msg = JSON.parse(data);
            // if (msg.token === token.options.address) {
            if (msg.state === 'start') {
                setshowFlag(false);
            } else {
                if (account) {
                    // updatebalance(account);
                }
                setshowFlag(true);
            }
            // }
        });
    }, []);
    

    return (
        <>
            <div className="market-history market-order mt15">
                <Tabs defaultActiveKey="open-orders">
                    <Tab eventKey="open-orders" title="Open Orders">
                        <ul className="d-flex justify-content-between market-order-item">
                            <li className="amount-type" >Time</li>
                            <li>Buy/Sell</li>
                            <li>Price</li>
                            <li>Amount</li>
                            <li>Cancel</li>
                        </ul>
                        {(props.showMyOpenOrders && showFlag) ? showMyOpenOrders(props) :
                            <table className="table">
                                <Spinner type='table' />
                            </table>}
                    </Tab>
                    <Tab eventKey="order-history" title="Order history">
                        <ul className="d-flex justify-content-between market-order-item">
                            <li>Time</li>
                            <li>Buy/Sell</li>
                            <li>Price</li>
                            <li>Amount</li>
                        </ul>
                        {(props.showMyFilledOrders && showFlag) ? showMyFilledOrders(props) :
                            <table className="table">
                                <Spinner type='table' />
                            </table>}
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}


function mapStateToProps(state) {
    const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state)
    const orderCancelling = orderCancellingSelector(state)

    return {
        myFilledOrders: myFilledOrdersSelector(state),
        showMyFilledOrders: myFilledOrdersLoadedSelector(state),
        myOpenOrders: myOpenOrdersSelector(state),
        showMyOpenOrders: myOpenOrdersLoaded && !orderCancelling,
        exchange: exchangeSelector(state),
        token: tokenSelector(state),
        account: accountSelector(state),
        web3: web3Selector(state),
    }
}

export default connect(mapStateToProps)(HistoryOrder);
