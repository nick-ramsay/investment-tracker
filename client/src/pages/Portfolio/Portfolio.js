import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import NavbarLoggedOut from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";
import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";

const Portfolio = () => {

    var PortfolioID = useParams().id;
    var [userToken, setUserToken] = useState(getCookie("user_token"));


    var [loading, setLoading] = useState(true);

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));

    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container page-content">
                <div className="col-md-12 mt-2 pt-1 pb-1 text-center">
                    <h5><strong>{"You're on the page for the following portfolio: " + PortfolioID}</strong></h5>
                    <button type="button" className="btn btn-sm btn-primary" data-toggle="modal" data-target="#addInvestmentModal">
                        Add Investment
                    </button>
                </div>
                <div className="modal fade" id="addInvestmentModal" tabindex="-1" role="dialog" aria-labelledby="addInvestmentLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addInvestmentLabel">Enter New Investment Details</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label for="addTickerSymbolInput">Ticker Symbol</label>
                                        <input type="text" className="form-control" id="addTickerSymbolInput" placeholder="Enter an investment symbol (example: AAPL)..." />
                                    </div>
                                    <div className="form-group">
                                        <label for="addInvestmentNameInput">Investment Name</label>
                                        <input type="text" className="form-control" id="addInvestmentNameInput" placeholder="Enter an investment name (example: Apple Inc.)..." />
                                    </div>
                                    <div className="form-group">
                                        <label for="addInvestmentPriceInput">Current Price</label>
                                        <div class="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">$</span>
                                            </div>
                                            <input type="number" className="form-control" id="addInvestmentPriceInput" min="0" step="0.01" placeholder="Enter the current investment price per share..." />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="addInvestmentTargetPriceInput">Target Price</label>
                                        <div class="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">$</span>
                                            </div>
                                            <input type="number" className="form-control" id="addInvestmentTargetPriceInput" min="0" step="0.01" placeholder="Enter the analyst target price per share..." />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthTimeoutModal />
        </div>
    )

}

export default Portfolio;