import React, { useState, useEffect } from 'react';
import moment from "moment";
import "./style.css";
import { logout, useInput } from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import NavbarLoggedOut from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";
import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";

const Home = () => {

    const getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    } //Function to get a specific cookie. Source: W3Schools


    var [userToken, setUserToken] = useState("");
    var [userFirstname, setFirstname] = useState("");
    var [userLastname, setLastname] = useState("");
    var [newPortfolioName, setNewPortfolioName] = useInput();

    var [loading, setLoading] = useState(true);

    const createPortfolio = () => {
        if (newPortfolioName !== "") {
            API.createPortfolio(newPortfolioName, userToken, moment().format()).then(res => {
                console.log(res);
                document.getElementById("newPortfolioNameInput").value = "";
            });
        }
    }

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));

        API.fetchAccountDetails(getCookie("user_token")).then(res => {
            setFirstname(userFirstname => res.data.firstname);
            setLastname(userLastname => res.data.lastname);
            setLoading(loading => false);
        });
    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container">
                <div className="text-right">

                </div>

                <div className="col-md-12 mt-2">
                    <div className="text-center">
                        <div className="pt-2">
                            <BarLoader
                                css={override}
                                height={10}
                                color={"#123abc"}
                                loading={loading}
                            />
                            <h3 className="mb-3"><strong>{(userFirstname && userLastname) ? "Welcome," : ""} {userFirstname} {userLastname}</strong></h3>
                        </div>
                        {/*
                        <div>
                            <button type="button" id="open-auth-timeout-modal-btn" className="btn btn-sm mb-2" data-toggle="modal" data-target="#auth-timeout-modal">Test Auth Timeout Modal</button>
                        </div>
                        */}
                        <form>
                            <h4>Create a Portfolio</h4>
                            <div className="row pr-3 pl-3">
                                <div className="col-md-10 mt-auto mb-auto">
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="newPortfolioNameInput" aria-describedby="newPortfolioNameInput" placeholder="Enter your new portfolio's name..." onChange={setNewPortfolioName} />
                                    </div>
                                </div>
                                <div className="col-md-2 mt-auto mb-auto">
                                    <div className="form-group">
                                        <button type="button" className="btn btn-custom" onClick={createPortfolio}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <AuthTimeoutModal />
        </div>
    )

}

export default Home;