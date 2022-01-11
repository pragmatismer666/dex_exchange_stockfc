import Web3 from 'web3'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import Exchanges from "../store/exchanges";
import Tokens from "../store/tokens";
import { ETHER_ADDRESS } from '../helpers'
import { db } from "./firebase/firebase";






class Recentall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeName: 'exchange',
      transaction: [],
      id: 0
    }
    this.showmyRecent = this.showmyRecent.bind(this);
  }

  showmyRecent = async (props) => {
    let { exchangeName, id, transaction } = this.state;
    exchangeName = 'exchange';
    transaction = [];
    id = Object.entries(Exchanges)[props.id][0];
    exchangeName = Object.entries(Tokens)[props.id][0]
    const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
    const networkId = await web3.eth.net.getId();
    const exchange = Exchanges[id];
    const simpleExchange = new web3.eth.Contract(exchange.default.abi, exchange.default.networks[networkId].address)
    // Fetch filled orders with the "Trade" event stream
    const tradeStream = await simpleExchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
    // Format filled orders
    const filledOrders = tradeStream.map((event) => event.returnValues)
    transaction = filledOrders;
    await transaction.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    });
    this.setState({ id, exchangeName, transaction });
  }
  componentDidMount() {
    db.collection('stateRealtime').doc('changeState').onSnapshot((snap) => {
      this.showmyRecent(this.props);
    })
    this.showmyRecent(this.props);
  }
  render() {
    let { exchangeName, transaction } = this.state;
    return (
      <>
        {transaction.length > 0 &&
          <>
            <tbody>
              {transaction.map((order) => (
                <tr className={`order-${order.id}`} key={order.id}>
                  <td >{exchangeName}</td>
                  <td >{new Date(order.timestamp * 1000).toLocaleDateString("en-US")}</td>
                  {order.tokenGive == ETHER_ADDRESS ? <td >{order.amountGive / order.amountGet}</td> : <td >{order.amountGet / order.amountGive}</td>}
                  {order.tokenGive == ETHER_ADDRESS ? <td >{order.amountGet / (10 ** 18)}</td> : <td >{order.amountGive / (10 ** 18)}</td>}
                </tr>
              )
              )}
            </tbody>
          </>
        }
      </>
    )
  }
}
function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(Recentall);
