import Web3 from "web3";
import React, { Component, useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Dropdown, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ThemeConsumer } from "../context/ThemeContext";
import tokens from "../store/tokens";
import Exchanges from "../store/exchanges";
import {
    accountSelector,
    etherBalanceSelector,
    userEmailSelector,
    userNameSelector,
} from "../store/selectors";
import { db } from "./firebase/firebase";
import { auth } from "../components/firebase";


const Notification = (props) => {
    const account = localStorage.getItem("account-address");
    const [fillFlag, setFillflag] = useState(false);
    const [showName, setshowName] = useState([]);
    const [orderAmount, setorderAmount] = useState([]);
    const [tokenFlag, setTokenflag] = useState(false);
    const [notificationCount, setNotificationcount] = useState(0);
    const [ethBal, setEthBal] = useState(0);
    const [showEth, setShowEth] = useState([]);
    const [loading, setloading] = useState(false);
    const web3 = new Web3(new Web3.providers.HttpProvider('https://data.stocksfc.com:3200'));
    function clearnotify() {
        setFillflag(false)
        setTokenflag(false)
        setshowName([])
        setorderAmount([])
        setShowEth([]);
        setNotificationcount(0)
        db.collection('notification-eth').doc(account).set({
            notificationCount: 0,
            tokenFlag: false,
            showEth: [],
            flag: false
        })
        db.collection('notification-token').doc(account).set({
            notificationCount: 0,
            fillFlag: false,
            orderAmount: [],
            showName: [],
            flag: false
        })
    }
    async function loaddata() {
        await db.collection('notification-eth').doc(account).get()
            .then(snap => {
                if (snap.data()) {
                    let { notificationCount, tokenFlag, showEth, flag } = snap.data();
                    if (flag) {
                        setNotificationcount(notificationCount)
                        setTokenflag(tokenFlag);
                        setShowEth(showEth)
                    }
                }
            })
        await db.collection('notification-token').doc(account).get()
            .then(snap => {
                if (snap.data()) {
                    let { notificationCount, fillFlag, orderAmount, showName, flag } = snap.data();
                    if (flag) {
                        setorderAmount(orderAmount)
                        setshowName(showName)
                        setNotificationcount(notificationCount)
                        setFillflag(fillFlag)
                    }
                }
            })
        setloading(true);
    }

    useEffect(() => {
        if (!loading && account) {
            loaddata();
        }
        let interval = null;
        if (1) {
            interval = setInterval(async () => {
                if (account) {
                    let snap = await db.collection('notification').doc(account).get();
                    if (snap.data()) {
                        let { type, amount, id } = snap.data();
                        let amt = orderAmount;
                        let nameid = showName;
                        if (type === 'changed') {
                            await db.collection('notification').doc(account).set({
                                type: 'unchanged',
                                amount: 0,
                                id: ''
                            })
                            amt.push(amount);
                            setorderAmount(amt)
                            nameid.push(id);
                            setshowName(nameid)
                            let cnt = notificationCount;
                            cnt++;
                            setNotificationcount(cnt)
                            setFillflag(true)
                            await db.collection('notification-token').doc(account).set({
                                notificationCount: cnt,
                                fillFlag: true,
                                orderAmount: amt,
                                showName: nameid,
                                flag: true
                            })
                        }
                    }
                    let ethbalan = showEth;
                    let result = await web3.eth.getBalance(account);
                    var etherval = web3.utils.fromWei(result, "ether");
                    if (ethBal === 0) {
                        setEthBal(etherval);
                    }
                    else if (ethBal !== etherval && ethBal < etherval) {
                        ethbalan.push(etherval - ethBal);
                        setShowEth(ethbalan)
                        setEthBal(etherval);
                        let cnt = notificationCount;
                        cnt++;
                        setNotificationcount(cnt)
                        setTokenflag(true);
                        await db.collection('notification-eth').doc(account).set({
                            notificationCount: cnt,
                            tokenFlag: true,
                            showEth: ethbalan,
                            flag: true
                        })
                    }
                }
            }, 10000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [notificationCount, orderAmount, showName, loading, ethBal, showEth, loading]);

    return (
        <>
            <Dropdown className="header-custom-icon">
                <ThemeConsumer>
                    {({ data, update }) => (
                        <Button variant="default" onClick={update} id="darkTheme">
                            {data.theme === 'light' ? (
                                <i className="icon ion-md-moon"></i>
                            ) : (
                                <i className="icon ion-md-sunny"></i>
                            )}
                        </Button>
                    )}
                </ThemeConsumer>
                <Dropdown.Toggle variant="default">
                    <i className="icon ion-md-notifications"></i>
                    {notificationCount > 0 && <span className="circle-pulse"></span>}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <div className="dropdown-header d-flex align-items-center justify-content-between">
                        {notificationCount > 0 && <><p className="mb-0 font-weight-medium">
                            {notificationCount} New Notifications
                        </p>
                            <a href="#!" onClick={() => clearnotify()} className="text-muted">
                                Clear all
                            </a></>}
                    </div>
                    <div className="dropdown-body">
                        {
                            fillFlag && <>{
                                orderAmount.map((obj, key, index) => (
                                    <a key={index.toString() + "fillFlag"} href="#!" className="dropdown-item">
                                        <div className="icon">
                                            <i className="icon ion-logo-bitcoin"></i>
                                        </div>
                                        <div className="content">
                                            <p>Order filled for {obj} of {showName[key]}</p>
                                            {/* <p className="sub-text text-muted">2 s ago</p> */}
                                        </div>
                                    </a>
                                ))
                            }</>

                        }
                        {   
                            tokenFlag && <>{
                                showEth.map((obj, key, index) => (
                                    <a key={index.toString() + "tokenFlag"} href="#!" className="dropdown-item">
                                        <div className="icon">
                                            <i className="icon ion-logo-usd"></i>
                                        </div>
                                        <div className="content">
                                            <p>You have received {eval((obj).toFixed(2))} Ethereum</p>
                                            {/* <p className="sub-text text-muted">4 hrs ago</p> */}
                                        </div>
                                    </a>
                                ))
                        }
                        </>}
                    </div>
                    {notificationCount == 0 && <div className="dropdown-footer d-flex align-items-center justify-content-center">
                        <a href="#!">no new notifications</a>
                    </div>}
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenbal: [],
            exchangeses: [],
            token_cost: [],
            token_percent: [],
            token_price: [],
            tokenName: [],
            loading: false,
            exchangeName: [],
            isOpen: false
        }

        this.readAccountDappValue = this.readAccountDappValue.bind(this);
    }


    readTickerData = async () => {
        let {
            tokenName,
            token_percent,
            exchangeName,
            exchangeses,
            token_price,
        } = this.state;
        tokenName = [];
        token_percent = [];
        const web3 = new Web3(
            new Web3.providers.HttpProvider("https://data.stocksfc.com:3200")
        );
        const networkId = await web3.eth.net.getId();
        for (var i = 0; i < Object.entries(tokens).length; i++) {
            tokenName.push(Object.entries(tokens)[i][0]);
            exchangeName.push(Object.entries(Exchanges)[i][0]);
        }
        for (var i = 0; i < tokenName.length; i++) {
            var token = tokens[tokenName[i]].default;
            var exchang = Exchanges[exchangeName[i]].default;
            exchangeses.push(
                new web3.eth.Contract(exchang.abi, exchang.networks[networkId].address)
            );
        }
        for (var j = 0; j < exchangeName.length; j++) {
            var token = tokens[tokenName[j]].default;
            var tradeStream = await exchangeses[j].getPastEvents("Trade", {
                fromBlock: 0,
                toBlock: "latest",
            });
            var filledOrders = await tradeStream.map((event) => event.returnValues);
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
            token_percent.push(tmp_percent);
        }

        this.setState({
            tokenName,
            token_percent,
            exchangeName,
            exchangeses,
            token_price,
        });
    }

    readAccountDappValue = (account1) => {
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
        this.setState(tokenbal, async () => {
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
            // define batch request
            var tokenbal_batch = new web3.eth.BatchRequest();
            for (var i = 0; i < tokenName.length; i++) {
                var token = tokens[tokenName[i]].default;
                var exchang = Exchanges[exchangeName[i]].default;
                var tokenInst = new web3.eth.Contract(
                    token.abi,
                    token.networks[networkId].address
                );
                this.addBatchItem(tokenInst, tokenbal_batch, account1, token);
                exchangeses.push(
                    new web3.eth.Contract(exchang.abi, exchang.networks[networkId].address)
                );
            }
            // execute batch request
            tokenbal_batch.execute();

            // var tradeStream_batch = new web3.eth.BatchRequest();
            for (var j = 0; j < exchangeName.length; j++) {
                var token = tokens[tokenName[j]].default;
                var tradeStream = await exchangeses[j].getPastEvents("Trade", {
                    fromBlock: 0,
                    toBlock: "latest",
                });
                var filledOrders = await tradeStream.map((event) => event.returnValues);
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
            // tradeStream_batch.execute();
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
        });
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

    async componentDidMount() {
        let el = document.querySelector("#darkTheme");
        if (el) {
            el.addEventListener("click", function () {
                document.body.classList.toggle("dark");
            });
        }
        this.readTickerData();
        if (this.props.account) {
            this.readAccountDappValue(this.props.account);
        } else {
            this.readAccountDappValue(localStorage.getItem("account-address"));
        }
        let uid = localStorage.getItem("account-info");
        this.setState({ uid: uid });
        const query = await db.collection("users").where("uid", "==", uid).get();
        if (query.docs.length !== 0) {
            let user = query.docs[0].data();
            let name = user.Firstname;
            let email = user.email;
            this.setState({ email, name });
        }

        if (this.state.tokenName.length == 0) {

        }
    }

    logout() {
        localStorage.clear();
        this.setState({ uid: "" });
        auth.doSignOut();
    }

    render() {
        let {
            loading,
            tokenName,
            exchangeName,
            tokenbal,
            exchangeses,
            token_cost,
            token_price,
            token_percent,
            uid,
            name,
            email,
        } = this.state;
        return (
            <>
                <header className="light-bb">
                    <Navbar expand="lg">
                        <Link className="navbar-brand" to="/">
                            <ThemeConsumer>
                                {({ data }) => {
                                    return data.theme === "light" ? (
                                        <img src={"/img/stocksfc.png"} alt="logo" />
                                    ) : (
                                        <img src={"/img/stocksfc.png"} alt="logo" />
                                    );
                                }}
                            </ThemeConsumer>
                        </Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="navbar-nav mr-auto">
                                <a className="nav-link" href="/players/cronaldo">
                                    Exchange
                                </a>
                                <NavDropdown title="Players">
                                    <a className="dropdown-item" href="/orders">
                                        all orders
                                    </a>
                                    <a className="dropdown-item" href="/recents">
                                        all transactions
                                    </a>
                                    <Link to="/players" className="dropdown-item">
                                        All Players
                                    </Link>
                                    <Link to="/ipos" className="dropdown-item">
                                        IPO's
                                    </Link>
                                </NavDropdown>
                                <Link to="/portfolio" className="nav-link">
                                    Portfolio
                                </Link>
                                <NavDropdown title="Rewards">
                                    <Link to="/rankings" className="dropdown-item">
                                        Rankings
                                    </Link>
                                    <Link to="/payouts" className="dropdown-item">
                                        Payouts
                                    </Link>
                                </NavDropdown>
                            </Nav>
                            <Nav className="navbar-nav ml-auto">
                                <Notification {...this.props}></Notification>
                                <Dropdown className="header-img-icon">
                                    <Dropdown.Toggle variant="default">
                                        <img src={"/img/avatar.svg"} alt="avatar" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className="dropdown-header d-flex flex-column align-items-center">
                                            <div className="figure mb-3">
                                                <img src={"/img/avatar.svg"} alt="" />
                                            </div>
                                            <div className="info text-center">
                                                <p
                                                    id="avata-name"
                                                    className="name font-weight-bold mb-0"
                                                >
                                                    {name}
                                                </p>
                                                <p id="avata-email" className="email text-muted mb-3">
                                                    {email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="dropdown-body">
                                            <ul className="profile-nav">
                                                {uid !== "" && uid !== null ? (
                                                    <>
                                                        <li className="nav-item">
                                                            <Link to="/profile" className="nav-link">
                                                                <i className="icon ion-md-person"></i>
                                                                <span>Profile</span>
                                                            </Link>
                                                        </li>


                                                        <li className="nav-item">
                                                            <a
                                                                href="javascript:void(0);"
                                                                className="nav-link"
                                                                onClick={() => this.logout()}
                                                            >
                                                                <i className="icon ion-md-power"></i>

                                                                <span>Log Out</span>
                                                            </a>
                                                        </li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li className="nav-item">
                                                            <Link to="/login" className="nav-link">
                                                                <i className="icon ion-md-power"></i>
                                                                <span>Login</span>
                                                            </Link>
                                                        </li>
                                                        <li className="nav-item">
                                                            <Link to="/signup" className="nav-link">
                                                                <i className="icon ion-md-power"></i>
                                                                <span>Signup</span>
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>

                    <div className="ticker-wrap">
                        <div className="ticker">
                            {
                                tokenName.map((obj, key, index) =>
                                    token_percent[key] ? (
                                        <>
                                            {
                                                (((100 * token_price[key]) / token_percent[key] - 100) >= 0) ? (
                                                    <div className="ticker__item">
                                                        <up>
                                                            {" "}
                                                            {obj}:{" "}
                                                            <span className="price">
                                                                ({eval(token_price[key].toFixed(4))})
                                                            </span>{" "}
                                                            <span className="percent">
                                                                {eval(
                                                                    (
                                                                        ((100 * token_price[key]) /
                                                                            token_percent[key]) - 100
                                                                    ).toFixed(0)
                                                                )}
                                                                % &#8593;
                                                            </span>
                                                        </up>
                                                    </div>
                                                ) : (
                                                    <div className="ticker__item">
                                                        <down>
                                                            {obj} :{" "}
                                                            <span className="price">
                                                                ({eval(token_price[key].toFixed(4))})
                                                            </span>{" "}
                                                            <span className="percent">
                                                                {eval(
                                                                    (
                                                                        ((100 * token_price[key]) /
                                                                            token_percent[key] - 100)
                                                                    ).toFixed(0)
                                                                )}
                                                                % &#8595;
                                                            </span>
                                                        </down>{" "}
                                                    </div>
                                                )}
                                        </>
                                    ) : (
                                            <div className="ticker__item">
                                                <up>
                                                    {" "}
                                                    {obj} :{" "}
                                                    <span className="price">
                                                        ({eval(token_price[key].toFixed(4))})
                                                    </span>{" "}
                                                    <span className="percent">0% &#8593;</span>
                                                </up>
                                            </div>
                                        )
                                )}
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

function mapStateToProps(state) {
    const userName = userNameSelector(state);
    const userEmail = userEmailSelector(state);

    return {
        userName: userName,
        account: accountSelector(state),
        userEmail: userEmail,
        etherBalance: etherBalanceSelector(state),
    };
}

export default connect(mapStateToProps)(Header);
