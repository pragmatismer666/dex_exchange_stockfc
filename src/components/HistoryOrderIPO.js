import Web3 from 'web3'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Exchanges from "../store/exchanges";
import Tokens from "../store/tokens";
import { ETHER_ADDRESS } from '../helpers';
import { db } from "./firebase/firebase";
import Spinner from './Spinner';

class HistoryOrderIPO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelorderId: [],
      fillorderId: [],
      myOpenOrders: [],
      orderArray: [],
      exchangeName: 'exchange',
      id: 0,
      isWorking: false,
    }
    this.accountAddress = localStorage.getItem("account-address");
    this.showMyOpenOrders = this.showMyOpenOrders.bind(this);
  }

  showMyOpenOrders = async (props) => {
    let { fillorderId, myOpenOrders, cancelorderId, id, orderArray, exchangeName } = this.state;
    this.setState({isWorking : true});
    cancelorderId = [];
    fillorderId = [];
    myOpenOrders = [];
    orderArray = [];
    exchangeName = 'exchange';
    var propid = parseInt(props.id)

    for (let index = 0; index <= propid; index++) {
      id = Object.entries(Exchanges)[index][0];

      exchangeName = Object.entries(Tokens)[index][0]
      let i = 0, j = 0;
      const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
      const networkId = await web3.eth.net.getId();
      const exchange = Exchanges[id];
      const simpleExchange = new web3.eth.Contract(exchange.default.abi, exchange.default.networks[networkId].address)
      // Fetch cancelled orders with the "Cancel" event stream
      const cancelStream = await simpleExchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
      // Format cancelled orders
      const cancelledOrders = cancelStream.map((event) => event.returnValues)
      for (i = 0; i < cancelledOrders.length; i++) {
        cancelorderId.push(cancelledOrders[i].id);
      }
      // Fetch filled orders with the "Trade" event stream
      const tradeStream = await simpleExchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
      // Format filled orders
      const filledOrders = tradeStream.map((event) => event.returnValues)
      for (i = 0; i < filledOrders.length; i++) {
        fillorderId.push(filledOrders[i].id);
      }
      // Load order stream
      const orderStream = await simpleExchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })
      // Format order stream
      const allOrders = orderStream.map((event) => event.returnValues);
      for (i = 0; i < allOrders.length; i++) {
        var openOrderflag = false;
        for (j = 0; j < cancelorderId.length; j++) {
          if (allOrders[i].id == cancelorderId[j]) {
            openOrderflag = true;
          }
        }
        for (j = 0; j < fillorderId.length; j++) {
          if (allOrders[i].id == fillorderId[j]) {
            openOrderflag = true;
          }
        }
        if (openOrderflag) {
          continue;
        } else {
          var data = {...allOrders[i], exchangeName}
          myOpenOrders.push(data);
        }
      }
    }
    

    await myOpenOrders.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    });
    this.setState({ fillorderId, myOpenOrders, cancelorderId, id, orderArray, exchangeName });
    this.setState({isWorking : false});
  }

  componentDidMount() {
    db.collection('stateRealtime').doc('changeState').onSnapshot((snap) => {
      this.showMyOpenOrders(this.props);
    })
    this.showMyOpenOrders(this.props);
  }
  render() {
    let { fillorderId, myOpenOrders, cancelorderId, id, orderArray, exchangeName, isWorking} = this.state;
    return (
      (isWorking == false) ? 
      (myOpenOrders.length > 0 ?
        <>
          {
            myOpenOrders.map((order) => (
              (order.user == this.accountAddress) ?
              <ul className="d-flex justify-content-between market-order-item" key=''>
                <li className="amount-type" ><a href={`/players/${order.exchangeName}`}>{order.exchangeName}</a></li>
                <li className="amount-type" >{new Date(order.timestamp * 1000).toLocaleDateString("en-US")}</li>
                {order.tokenGive == ETHER_ADDRESS ? <li className="amount-type" >"Buy"</li> : <li className="amount-type" >"Sell"</li>}
                {order.tokenGive == ETHER_ADDRESS ? <li className="amount-type" >{order.amountGive / order.amountGet}</li> : <li className="amount-type" >{order.amountGet / order.amountGive}</li>}
                {order.tokenGive == ETHER_ADDRESS ? <li className="amount-type" >{order.amountGet / (10 ** 18)}</li> : <li className="amount-type" >{order.amountGive / (10 ** 18)}</li>}
              </ul>
              :<></>
              )
            )
          }
        </> 
        :
        <ul className="d-flex justify-content-between market-order-item" key=''>
          <li className="amount-type" ><a href={`/players/${exchangeName}`}>{exchangeName} &nbsp; No Open orders</a></li>
        </ul>)
      : 
      // <></>
      <Spinner type="table" />
    )
  }
}
function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(HistoryOrderIPO);
