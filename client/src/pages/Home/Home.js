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
                                <h3><strong>{(userFirstname && userLastname) ? "Welcome," : ""} {userFirstname} {userLastname}</strong></h3>
                            </div>
                            <button type="button" class="btn btn-sm" data-toggle="modal" data-target="#createPortfolioModal">
                                    Create New Portfolio
                                </button>
                                <div class="modal fade" id="createPortfolioModal" tabindex="-1" role="dialog" aria-labelledby="createPortfolioModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="createPortfolioModalLabel">Create New Portfolio</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <form>
                                                    <div className="row pr-3 pl-3">
                                                        <div className="col-md-12 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" id="newPortfolioNameInput" aria-describedby="newPortfolioNameInput" placeholder="Enter your new portfolio's name..." onChange={setNewPortfolioName} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-sm btn-red" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-sm" onClick={createPortfolio}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <div className="page-content p-3">
                                <div className="col-md-12 text-left">
                                    {portfolios.length > 0 ? portfolios.map((portfolio, p) =>
                                        <div className="card mb-2 p-2">
                                            <div className="card-body pt-0 pb-0">
                                                <div className="row">
                                                    <h6 key={p}><strong>{portfolio.name}</strong></h6>
                                                </div>
                                                <div className="row">
                                                    <a className="btn btn-sm mr-1 mb-1" href={'./portfolio/' + portfolio._id}>Open Portfolio</a>
                                                    <a className="btn btn-sm mb-1" href={'./performance/' + portfolio._id}>View Performance</a>
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