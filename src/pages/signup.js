import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import Web3 from 'web3'

import * as routes from "../components/constants/routes";
import { db } from "../components/firebase/firebase";
import { auth } from "../components/firebase";
// import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

import Swal from 'sweetalert2'

import configURL from '../config/wallets.json'
const ethSendState = configURL.ethSend;
const depositAmount = configURL.depositAmount;
const depositWallet = configURL.depositWallet;
const depositPrivate = configURL.depositPrivate;

const gasPrice = 0; //or get with web3.eth.gasPrice
const gasLimit = 6721975;

const SignUpPage = ({ history }) => (
  <div>
    <div className="div-flex">
      <div>
        <Signup history={history} />
      </div>
    </div>
  </div>
);
const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
  showingAlert: false
};

//A Higher order function with prop name as key and the value to be assigned to
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class Signup extends Component {
  constructor(props){
    super(props);
    this.sendRequest = this.sendRequest.bind(this);
  }

  //defining state
  state = {
    ...INITIAL_STATE
  };

  // onChange = (propName, value) => {
  //   this.setState({
  //     [propName]: value
  //   });
  // };
  sendRequest = async (address) => {
    let url = 'https://data.stocksfc.com/newuser.php';

    var formdata = new FormData();
    formdata.append("address", address);

    let requestOptions = {
        method: 'POST',
        // headers: {},
        // headers: { 'Content-Type': 'application/json' },
        body: formdata,
        redirect: 'follow'
    };
    let responseData = await fetch(url, requestOptions)
    .then(response => response.json())
    .catch(error => {
      console.log(error);
      return false;
    });
    let status = responseData.status;
    console.log('status', status);
    if(status == 'success'){
        return true;
    }else{
        return false;
    }
  };

  // sendToken = async (TokenAmount, senderPrivatekey, senderAddress, receiverAddress) =>  {
  //   if (TokenAmount && senderPrivatekey && senderAddress && receiverAddress) {
  //     const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  //     const amountToSend = web3.utils.toWei(TokenAmount.toString(), 'ether')
  //     const nonce = await web3.eth.getTransactionCount(senderAddress);
  //     const transaction = {
  //         "from": senderAddress,
  //         "nonce": web3.utils.toHex(nonce),
  //         "gasPrice": web3.utils.toHex(gasPrice * 1e9),
  //         "gasLimit": web3.utils.toHex(gasLimit),
  //         "to": receiverAddress,
  //         "value": amountToSend,
  //     };
  //     const tx = await web3.eth.accounts.signTransaction(transaction, senderPrivatekey)
  //     const hash = await web3.eth.sendSignedTransaction(tx.rawTransaction)
  //     console.log("success",hash);
  //   }
  // }

  onSubmit = async (event) => {
    event.preventDefault();

    const web3 = new Web3(new Web3.providers.HttpProvider('http://138.68.129.183:7545'));
    var account1 = web3.eth.accounts.create();
    if(ethSendState == "on"){
      // this.sendToken(depositAmount, depositPrivate, depositWallet, account1.address);
      await this.sendRequest(account1.address);
      // alert(account1.privateKey);
    }
    const { username, email, passwordOne } = this.state;
    const { history } = this.props;

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://localhost:3002/finishSignUp?cartId=1234',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'example.page.link'
    };

    // auth.sendSignInLinkToEmail(email, actionCodeSettings)
    // .then(() => {
    //   // The link was successfully sent. Inform the user.
    //   // Save the email locally so you don't need to ask the user for it again
    //   // if they open the link on the same device.
    //   window.localStorage.setItem('emailForSignIn', email);
    //   // ...
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });
    
      auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      //it the above functions resolves, reset the state to its initial state values, otherwise, set the error object
      .then(authUser => {
        db.collection('users').doc(authUser.user.uid).set({
          uid: authUser.user.uid,
          Firstname: username,
          email: email,
          passwordOne: passwordOne,
          address: account1.address,
          privateKey: account1.privateKey,
        })
          // sending alert if it success
          .then(() => {
            console.log('Thank you for Subscribing Mailing list');
          })
          // sending the error if it fails.
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: error.message,
              
            })
          });
      });
    history.push(routes.SIGN_IN);
  };

  timer = () => {
    this.setState({
      showingAlert: true
    });

    setTimeout(() => {
      this.setState({
        showingAlert: false
      });
    }, 4000);
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
      showingAlert
    } = this.state;
    //a boolen to perform validation
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <div>
        {showingAlert && (
          <Alert color="danger" onLoad={this.timer}>
            {error.message}
          </Alert>
        )}
        <div className="vh-100 d-flex justify-content-center">
          <div className="form-access my-auto">
            <form onSubmit={this.onSubmit}>
              <span>Create Account</span>
              <div className="form-group">
                <input
                  type="username"
                  name="username"
                  id="userName"
                  className="form-control"
                  placeholder="Full Name"
                  value={username}
                  onChange={e =>
                    this.setState(byPropKey("username", e.target.value))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  className="form-control"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => this.setState(byPropKey("email", e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  id="examplePassword1"
                  className="form-control"
                  placeholder="Password"
                  value={passwordOne}
                  onChange={e =>
                    this.setState(byPropKey("passwordOne", e.target.value))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  id="examplePassword2"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={passwordTwo}
                  onChange={e =>
                    this.setState(byPropKey("passwordTwo", e.target.value))
                  }
                  required
                />
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="form-checkbox"
                  required
                />
                <label className="custom-control-label" htmlFor="form-checkbox">
                  I agree to the{' '}
                  <Link to="/terms-and-conditions">Terms & Conditions</Link>
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
            </form>
            <h2>
              Already have an account?
              <Link to="/login"> Sign in here</Link>
            </h2>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(SignUpPage); //using a HoC to get access to history
export { Signup };
