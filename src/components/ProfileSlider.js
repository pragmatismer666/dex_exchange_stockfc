import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PriceChart from './PriceChart';
import { ThemeConsumer } from '../context/ThemeContext';
import { exchangeSelector, priceChartLoadedSelector, priceChartSelector ,contractsLoadedSelector } from '../store/selectors'
import { connect } from 'react-redux'
import interactions from "../store/interactions";
import { db } from "./firebase/firebase";
import configURL from '../config/endpoints.json'
import configURL2 from '../config/wallets.json'
import configURL3 from '../config/player2id.json'
import OrderBook from '../components/OrderBook';

const IMGURL = configURL.imgURL;
const DATAURL = configURL.playerdataURL;
const deadwallet = configURL2.deadWallet;
const player2id = configURL3.player2id;
const player2season = configURL.season_state;


class ProfileSlider extends Component {
  constructor(props){
    super(props);
    this.state = {
      season_state : null
    }
    this.getFullData = this.getFullData.bind(this);
  }

  componentWillMount() {
    this.loadBlockchainData(this.props)
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

  async loadBlockchainData(props) {
    let id = props.id;
    const { loadAllOrders } = !interactions[id] ? interactions["cronaldo"] : interactions[id];
    const { dispatch, exchange} = props

    await loadAllOrders(exchange, dispatch)
  }
  
  getseasondata(data, season_id){
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if(element.season_id == season_id){
        return element;
      }
    }
    return null;
  }

  async componentDidMount() {
    db.collection('stateRealtime').doc('changeState').onSnapshot((snap) => {
    })
    let fulldata = await this.getFullData();
    if(fulldata){
      let seasonlist = fulldata.stats.data;
      let current_season_id = fulldata.team.data.current_season_id;
      let seasondata = this.getseasondata(seasonlist, current_season_id)
      this.setState({
        season_state : JSON.stringify(seasondata)
      });
    }
  }

  showSeasonData(data){
    let jsondata = JSON.parse(data);

    return(
      <table className="table">
        <thead>
          <tr>
            <th>Option Name</th>
            <th>Season Status Data</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><h5>minutes</h5></td><td>{jsondata.minutes}</td></tr>
            <tr><td><h5>appearences</h5></td><td>{jsondata.appearences}</td></tr>
            <tr><td><h5>substitute_in</h5></td><td>{jsondata.substitute_in}</td></tr>
            <tr><td><h5>substitute_out</h5></td><td>{jsondata.substitute_out}</td></tr>
            <tr><td><h5>goals</h5></td><td>{jsondata.goals}</td></tr>
            <tr><td><h5>owngoals</h5></td><td>{jsondata.owngoals}</td></tr>
            <tr><td><h5>assists</h5></td><td>{jsondata.assists}</td></tr>
            <tr><td><h5>saves</h5></td><td>{jsondata.saves}</td></tr>
            <tr><td><h5>inside_box_saves</h5></td><td>{jsondata.inside_box_saves}</td></tr>
            <tr><td><h5>dispossesed</h5></td><td>{jsondata.dispossesed}</td></tr>
            <tr><td><h5>interceptions</h5></td><td>{jsondata.interceptions}</td></tr>
            <tr><td><h5>yellowcards</h5></td><td>{jsondata.yellowcards}</td></tr>
            <tr><td><h5>yellowred</h5></td><td>{jsondata.yellowred}</td></tr>
            <tr><td><h5>redcards</h5></td><td>{jsondata.redcards}</td></tr>
            <tr><td><h5>tackles</h5></td><td>{jsondata.tackles}</td></tr>
            <tr><td><h5>blocks</h5></td><td>{jsondata.blocks}</td></tr>
            <tr><td><h5>hit_post</h5></td><td>{jsondata.hit_post}</td></tr>
            <tr><td><h5>cleansheets</h5></td><td>{jsondata.cleansheets}</td></tr>
            <tr><td><h5>fouls.committed</h5></td><td>{jsondata.fouls.committed}</td></tr>
            <tr><td><h5>fouls.drawn</h5></td><td>{jsondata.fouls.drawn}</td></tr>
            <tr><td><h5>crosses.total</h5></td><td>{jsondata.crosses.total}</td></tr>
            <tr><td><h5>crosses.accurate</h5></td><td>{jsondata.crosses.accurate}</td></tr>
            <tr><td><h5>dribbles.attempts</h5></td><td>{jsondata.dribbles.attempts}</td></tr>
            <tr><td><h5>dribbles.success</h5></td><td>{jsondata.dribbles.success}</td></tr>
            <tr><td><h5>dribbles.dribbled_past</h5></td><td>{jsondata.dribbles.dribbled_past}</td></tr>
            <tr><td><h5>shots.shots_total</h5></td><td>{jsondata.shots.shots_total}</td></tr>
            <tr><td><h5>shots.shots_total</h5></td><td>{jsondata.shots.shots_total}</td></tr>
            <tr><td><h5>duels.total</h5></td><td>{jsondata.duels.total}</td></tr>
            <tr><td><h5>duels.won</h5></td><td>{jsondata.duels.won}</td></tr>
            <tr><td><h5>passes.total</h5></td><td>{jsondata.passes.total}</td></tr>
            <tr><td><h5>passes.accuracy</h5></td><td>{jsondata.passes.accuracy}</td></tr>
            <tr><td><h5>passes.key_passes</h5></td><td>{jsondata.passes.key_passes}</td></tr>
            <tr><td><h5>penalties.won</h5></td><td>{jsondata.penalties.won}</td></tr>
            <tr><td><h5>penalties.scores</h5></td><td>{jsondata.penalties.scores}</td></tr>
            <tr><td><h5>penalties.missed</h5></td><td>{jsondata.penalties.missed}</td></tr>
            <tr><td><h5>penalties.committed</h5></td><td>{jsondata.penalties.committed}</td></tr>
            <tr><td><h5>penalties.saves</h5></td><td>{jsondata.penalties.saves}</td></tr>

          
        </tbody>
      </table>
    );

  }

  render(){
    return (
      <>
        <div className="market-history market-order mt15">
          <Tabs defaultActiveKey="chart">
            <Tab eventKey="chart" title="Chart">
              {/* <ul className="d-flex justify-content-between market-order-item"> */}
              <ThemeConsumer>
                {({ data }) => {
                  return data.theme === 'light' ? (
                    <PriceChart theme={'light'}/>
                  ) : (
                    <PriceChart theme={'dark'}/>
                  );
                }}
              </ThemeConsumer>
              {/* </ul> */}
            </Tab>
            <Tab eventKey="stats" title="Stats">
              <ul className="d-flex justify-content-between market-order-item">
                {this.state.season_state ? 
                  this.showSeasonData(this.state.season_state) : "No Season Data"  
                }
              </ul>
            </Tab>
              <Tab eventKey="depth" title="Market Depth">
                <OrderBook id={this.props.id} />
            </Tab>
            <Tab eventKey="rewards" title="Rewards">
              <ul className="d-flex justify-content-between market-order-item">

              </ul>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  }
}


function mapStateToProps(state) {
  return {
    priceChartLoaded: priceChartLoadedSelector(state),
    priceChart: priceChartSelector(state),
    exchange: exchangeSelector(state),
    contractsLoaded: contractsLoadedSelector(state),
  }
}

export default connect(mapStateToProps)(ProfileSlider)
