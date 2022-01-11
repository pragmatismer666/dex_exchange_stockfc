import React, { useEffect, useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { auth } from "../components/firebase/firebase";
import { doGetAnUser, updateUserData } from "../components/firebase/auth";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState({
    currentPasswordError: "",
    confirmPasswordError: "",
  });
  const account = localStorage.getItem("account-info");
  const history = useHistory();
  const currentUser = auth.currentUser;
  useEffect(() => {
    if (!account) {
      localStorage.clear();
      history.push("/login");
    }
    doGetAnUser(account).then((query) => {
      if (query.docs.length !== 0) {
        let res = query.docs[0].data();
        setUser(res);
      }
    });
  }, []);
  const changePassword = (e) => {
    //doPasswordChange();
    e.preventDefault();
    if (user.passwordOne !== passwordData.currentPassword) {
      setPasswordError({
        ...passwordError,
        currentPasswordError: "Please enter valid current password",
      });
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError({
        ...passwordError,
        confirmPasswordError: "Confirm password is incorrect",
      });
      return false;
    }
    setPasswordError({
      currentPasswordError: "",
      confirmPasswordError: "",
    });
    currentUser
      .updatePassword(passwordData.newPassword)
      .then(() => {
        var newUser = { ...user };
        newUser["passwordOne"] = passwordData.newPassword;
        updateUserData(account, newUser);
        Swal.fire({
          icon: "success",
          title: "Password Change",
          text: "Password successfully changed",
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: error.message,
        });
      });
  };
  return (
    <>
      <div className="settings mtb15">
        <div className="container-fluid">
          <Tab.Container defaultActiveKey="profile">
            <Row>
              <Col lg={3}>
                <Nav variant="pills" className="settings-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">General Information</h5>
                        <div className="settings-profile">
                          <form>

                            <div className="form-row mt-4">
                              <div className="col-md-6">
                                <label htmlFor="formFirst">Name</label>
                                <input
                                  id="formFirst"
                                  type="text"
                                  className="form-control"
                                  placeholder="First name"
                                  value={user?.Firstname}
                                />
                              </div>
                              {/* <div className="col-md-6">
                                <label htmlFor="formLast">Last name</label>
                                <input
                                  id="formLast"
                                  type="text"
                                  className="form-control"
                                  placeholder="Last name"
                                />
                              </div> */}
                              <div className="col-md-6">
                                <label htmlFor="emailAddress">Email</label>
                                <input
                                  id="emailAddress"
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter your email"
                                  value={user?.email}
                                />
                              </div>


                              <div className="col-md-12">
                                <input type="submit" value="Update" />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      {currentUser?.providerData[0]?.providerId ==
                        "password" && (
                        <div className="card-body">
                          <h5 className="card-title">Password Change</h5>
                          <div className="settings-profile">
                            <form onSubmit={(e) => changePassword(e)}>
                              <div className="form-row">
                                <div className="col-md-6">
                                  <label htmlFor="currentPass">
                                    Current password
                                  </label>
                                  <input
                                    id="currentPass"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    onChange={(e) =>
                                      setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value,
                                      })
                                    }
                                  />
                                  {passwordError.currentPasswordError && (
                                    <p className="alert alert-danger">
                                      {passwordError.currentPasswordError}
                                    </p>
                                  )}
                                </div>
                                <div className="col-md-6">
                                  <label htmlFor="newPass">New password</label>
                                  <input
                                    id="newPass"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter new password"
                                    onChange={(e) =>
                                      setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label htmlFor="newPass">
                                    Confirm password
                                  </label>
                                  <input
                                    id="repPass"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter confirm password"
                                    onChange={(e) =>
                                      setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value,
                                      })
                                    }
                                  />
                                  {passwordError.confirmPasswordError && (
                                    <p className="alert alert-danger">
                                      {passwordError.confirmPasswordError}
                                    </p>
                                  )}
                                </div>
                                {/* <div className="col-md-6">
                                <label htmlFor="securityOne">
                                  Security questions #1
                                </label>
                                <select
                                  id="securityOne"
                                  className="custom-select"
                                >
                                  <option defaultValue>
                                    What was the name of your first pet?
                                  </option>
                                  <option>
                                    What's your Mother's middle name?
                                  </option>
                                  <option>
                                    What was the name of your first school?
                                  </option>
                                  <option>
                                    Where did you travel for the first time?
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="securityAnsOne">Answer</label>
                                <input
                                  id="securityAnsOne"
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter your answer"
                                />
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="securityTwo">
                                  Security questions #2
                                </label>
                                <select
                                  id="securityTwo"
                                  className="custom-select"
                                >
                                  <option defaultValue>Choose...</option>
                                  <option>
                                    What was the name of your first pet?
                                  </option>
                                  <option>
                                    What's your Mother's middle name?
                                  </option>
                                  <option>
                                    What was the name of your first school?
                                  </option>
                                  <option>
                                    Where did you travel for the first time?
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="securityAnsTwo">Answer</label>
                                <input
                                  id="securityAnsTwo"
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter your answer"
                                />
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="securityThree">
                                  Security questions #3
                                </label>
                                <select
                                  id="securityThree"
                                  className="custom-select"
                                >
                                  <option defaultValue>Choose...</option>
                                  <option>
                                    What was the name of your first pet?
                                  </option>
                                  <option>
                                    What's your Mother's middle name?
                                  </option>
                                  <option>
                                    What was the name of your first school?
                                  </option>
                                  <option>
                                    Where did you travel for the first time?
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="securityFore">Answer</label>
                                <input
                                  id="securityFore"
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter your answer"
                                />
                              </div> */}
                                <div className="col-md-12">
                                  <input type="submit" value="Update" />
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                      {currentUser?.providerData[0]?.providerId !=
                        "password" && (
                        <div className="card-body">
                          <h5 className="card-title">Social Account Linked</h5>
                          {user?.authProvider?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </>
  );
}
