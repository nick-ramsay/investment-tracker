import React, { useState, useEffect } from 'react';
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import HashLoader from "react-spinners/HashLoader";
import NavbarLoggedOut from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";
import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";

const Home = () => {

    var [userToken, setUserToken] = useState(getCookie("user_token"));
    var [userFirstname, setFirstname] = useState("");
    var [userLastname, setLastname] = useState("");
    var [newPortfolioName, setNewPortfolioName] = useInput();
    var [portfolios, setPortfolios] = useState([]);

    var [loading, setLoading] = useState(true);

    const createPortfolio = () => {
        if (newPortfolioName !== "" && newPortfolioName !== undefined) {
            API.createPortfolio(newPortfolioName, userToken, moment().format()).then(res => {
                document.getElementById("newPortfolioNameInput").value = "";
                renderPortfolios();
            });

        }
    }

    const renderPortfolios = () => {
        API.fetchPortfolios(userToken).then(res => {
            setPortfolios(portfolios => res.data);
            setLoading(loading => false);
        })
    }
    
    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));

        API.fetchAccountDetails(getCookie("user_token")).then(res => {
            setFirstname(userFirstname => res.data.firstname);
            setLastname(userLastname => res.data.lastname);
            renderPortfolios();
        });
    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container">
                <div className="col-md-12 mt-4">
                    {loading ?
                        <HashLoader
                            css={override}
                            size={250}
                            margin={6}
                            color={"#880085"}
                            loading={loading}
                        /> :
                        <div className="text-center">
                            <div className="pt-2">
                                <h3 className="mb-3"><strong>{(userFirstname && userLastname) ? "Welcome," : ""} {userFirstname} {userLastname}</strong></h3>
                            </div>
                            {/*
                        <div>
                            <button type="button" id="open-auth-timeout-modal-btn" className="btn btn-sm mb-2" data-toggle="modal" data-target="#auth-timeout-modal">Test Auth Timeout Modal</button>
                        </div>
                        */}
                            <div className="page-content p-3">
                                <h4 className="pt-1">Create a Portfolio</h4>
                                <form>
                                    <div className="row pr-3 pl-3">
                                        <div className="col-md-10 mt-auto mb-auto">
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="newPortfolioNameInput" aria-describedby="newPortfolioNameInput" placeholder="Enter your new portfolio's name..." onChange={setNewPortfolioName} />
                                            </div>
                                        </div>
                                        <div className="col-md-2 mt-auto mb-auto">
                                            <div className="form-group">
                                                <button type="button" className="btn btn-sm btn-custom" onClick={createPortfolio}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="col-md-12 text-left">
                                    {portfolios.length > 0 ? portfolios.map((portfolio, p) =>
                                        <div className="card mb-2 p-2">
                                            <div className="card-body pt-0 pb-0">
                                                <div className="row">
                                                    <h6 key={p}><strong>{portfolio.name}</strong></h6>
                                                </div>
                                                <div className="row">
                                                    <a className="btn btn-sm" href={'./portfolio/' + portfolio._id}>Open Portfolio</a>
                                                </div>
                                            </div>
                                        </div>
                                    ) : <p className="mt-2 mb-2 p-2 text-center"><strong>No Portfolios</strong></p>}
                                </div>
                            </div>

                        </div>
                    }
                </div>

            </div>
            <AuthTimeoutModal />
        </div>
    )

}

export default Home;