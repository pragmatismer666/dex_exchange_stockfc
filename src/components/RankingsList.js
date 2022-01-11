import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import FlipMove from "react-flip-move";
// import { Flipper, Flipped } from "react-flip-toolkit";
import Swal from 'sweetalert2';
import Spinner from './Spinner'
import configURL from "../config/endpoints.json";
const rankdataurl = configURL.ratingURL;

class PlayerData extends Component {
  constructor(props){
    super(props);
    this.showDlg = this.showDlg.bind(this);
  }

  showDlg(){
    var splitdata = this.props.data;
    Swal.fire({
      title: "" + splitdata[2] + "<P>Score : " + splitdata[29] ,
      imageUrl: splitdata[0],
      html: "<p>Position : " + splitdata[3] + "</p>"
      + "<p>GameID : " + splitdata[4] + "</p>"
      + "<p>Goals : " + splitdata[5] + "</p>"
      + "<p>Assists : " + splitdata[6] + "</p>"
      + "<p>shots_total : " + splitdata[8] + "</p>"
      + "<p>shots_on_goal : " + splitdata[9] + "</p>"
      + "<p>key_passes : " + splitdata[10] + "</p>"
      + "<p>interceptions : " + splitdata[11] + "</p>"
      + "<p>hit_woodwork : " + splitdata[12] + "</p>"
      + "<p>pen_won : " + splitdata[13] + "</p>"
      + "<p>tackles : " + splitdata[14] + "</p>"
      + "<p>blocks : " + splitdata[15] + "</p>"
      + "<p>Successful Dribble : " + splitdata[16] + "</p>"
      + "<p>saves : " + splitdata[17] + "</p>"
      + "<p>pen_saved : " + splitdata[18] + "</p>"
      + "<p>conceded : " + splitdata[19] + "</p>"
      + "<p>owngoals : " + splitdata[20] + "</p>"
      + "<p>yellowcards : " + splitdata[21] + "</p>"
      + "<p>redcards : " + splitdata[22] + "</p>"
      + "<p>yellowredcards : " + splitdata[23] + "</p>"
      + "<p>pen_missed : " + splitdata[24] + "</p>"
      + "<p>pen_committed : " + splitdata[25] + "</p>"
      + "<p>dispossesed : " + splitdata[26] + "</p>"
      + "<p>CleanSheet : " + splitdata[27] + "</p>"
      + "<p>Winning Team : " + splitdata[28] + "</p>"
                                                                                                            
    });
  }

  render() {
    var splitdata = this.props.data;
    return(
      <tr>
        <td>
          <img className="photo" src={splitdata[0]}/>
          <p>{splitdata[2]}</p>
        </td>
        <td>
          <img className="photo" src={splitdata[1]}/>
        </td>
        <td>{splitdata[3]}</td>
        <td>{splitdata[4]}</td>
        <td>{splitdata[5]}</td>
        <td>{splitdata[6]}</td>
        <td>{splitdata[7]}</td>
        {/* <td>{splitdata[8]}</td>
        <td>{splitdata[9]}</td>
        <td>{splitdata[10]}</td>
        <td>{splitdata[11]}</td>
        <td>{splitdata[12]}</td>
        <td>{splitdata[13]}</td> 
        <td>{splitdata[14]}</td> 
        <td>{splitdata[15]}</td> 
        <td>{splitdata[16]}</td> 
        <td>{splitdata[17]}</td> 
        <td>{splitdata[18]}</td> 
        <td>{splitdata[19]}</td> 
        <td>{splitdata[20]}</td> 
        <td>{splitdata[21]}</td> 
        <td>{splitdata[22]}</td>
        <td>{splitdata[23]}</td> 
        <td>{splitdata[24]}</td>
        <td>{splitdata[25]}</td>
        <td>{splitdata[26]}</td> 
        <td>{splitdata[27]}</td>
        <td>{splitdata[28]}</td>
        <td>{splitdata[29]}</td> */}
        <td><button class="btn btn-outline-success" onClick={this.showDlg}>Full Score</button></td>
      </tr>
    );
  }
}

class RankingsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankdata: null,
      isloading: false,
    };
  }

  async getPlayerData() {
    let rankdata;
    rankdata = await fetch(rankdataurl)
      .then((response) => response.text())
      .catch((error) => {
      });
    return rankdata;
  }

  async componentDidMount() {
    let rankdata = await this.getPlayerData();
    this.setState({
      rankdata: rankdata,
    });

    var intervalId = setInterval(async () => {
      this.setState({ isloading : true});
      let rankdata = await this.getPlayerData();
      const data = this.state.rankdata;
      if (rankdata != data) {
        this.setState({
          rankdata: rankdata,
        });
      }
      this.setState({ isloading : false});
    }, 60000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    if (this.state.rankdata) {
      let playerdatalist = this.state.rankdata.split("\n");
      return (
        <>
          <div className="markets pb70">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="markets-pair-list">
                    <Tabs defaultActiveKey="PL">
                      <Tab eventKey="PL" title="PL">
                        <div className="table-responsive">
                          <table className="table star-active">
                          <thead>
                            <tr>
                              <th>Player</th>
                              <th>Club</th>
                              <th>Position</th>
                              <th>GameID</th>
                              <th>Goals</th>
                              <th>Assists</th>
                              <th>Score</th>
                              {/* <th>SOT</th>
                              <th>Key Passes</th>
                              <th>Tackles</th>
                              <th>Interceptions</th>
                              <th>Full Data</th>
                              <th>Scores</th> */}
                              <th>ViewAll</th>
                            </tr>
                          </thead>
                          <tbody>
                          {/* <FlipMove
                            typeName="flip-wrapper"
                            staggerDurationBy={30}
                            duration={500}
                            delay={30}
                          > */}
                            {/* <Flipper
                              flipKey={this.state.data.join("")}
                              element="ul"
                              className="list"
                            > */}
                            { !this.state.isloading ? playerdatalist.map((obj, key) => {
                              let splitdata = obj.split(" ");
                              if (!splitdata[0]) return <></>;
                              else
                                return (
                                  <PlayerData data={splitdata} />
                                );
                            }) : <Spinner type="table" />}
                            {/* </Flipper> */}
                          {/* </FlipMove> */}
                          </tbody>
                          </table>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <div className="markets pb70">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="markets-pair-list">
              <Tabs defaultActiveKey="PL">
                <Tab eventKey="PL" title="Live results will appear here when the matches begin">
                  <div className="table-responsive">
                    <table className="table star-active">
                    <thead>

                    </thead>
                    <tbody>

                    </tbody>
                    </table>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>;
    }
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(RankingsList);
