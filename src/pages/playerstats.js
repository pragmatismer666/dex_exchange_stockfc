import React, { Component } from 'react';
import PlayerStats from '../components/PlayerStats';
import PlayerStats2 from '../components/PlayerStats2';
import ProfileSlider from '../components/ProfileSlider';
import AboutPlayer from "../components/AboutPlayer"
import interactions from "../store/interactions";
import { db } from "../components/firebase/firebase";
import { exchangeSelector, priceChartLoadedSelector, priceChartSelector } from '../store/selectors'
import { connect } from 'react-redux'


class Stats extends Component {
  constructor(props){
    super(props);

    this.loadBlockchainData = this.loadBlockchainData.bind(this);
  }

  componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
    let id = props.id;
    const { loadAllOrders } = !interactions[id] ? interactions["cronaldo"] : interactions[id];
    const { dispatch, exchange} = props
    await loadAllOrders(exchange, dispatch)
  }

  componentDidMount() {
    // db.collection('stateRealtime').doc('changeState').onSnapshot((snap) => {
    //   this.loadBlockchainData(this.props)
    // })
  }

  render() {
    return(
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
                  {/* <PlayerStats /> */}
              <AboutPlayer  id={this.props.id} />
            </div>
              <div className="col-md-6">
                <PlayerStats2 id={this.props.id}/>
              </div>
          </div>
        </div>
        <ProfileSlider id={this.props.id}/>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    exchange: exchangeSelector(state),
    priceChartLoaded: priceChartLoadedSelector(state),
    priceChart: priceChartSelector(state),
  }
}

export default connect(mapStateToProps)(Stats);
