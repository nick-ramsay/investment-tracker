import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import NavbarLoggedOut from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";
import EditInvestmentModal from "../../components/EditInvestmentModal/EditInvestmentModal";
import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";


const Portfolio = () => {

    var PortfolioID = useParams().id;
    var [addTickerSymbol, setAddTickerSymbol] = useInput();
    var [addInvestmentName, setAddInvestmentName] = useInput();
    var [userToken, setUserToken] = useState(getCookie("user_token"));
    var [portfolio, setPortfolio] = useState();
    var [currentSort, setCurrentSort] = useState("");
    var [investments, setInvestments] = useState();
    var [editInvestmentNameInput, setEditInvestmentNameInput] = useInput();
    var [editInvestmentPriceInput, setEditInvestmentPriceInput] = useInput();
    var [editInvestmentTargetInput, setEditInvestmentTargetInput] = useInput();

    var [loading, setLoading] = useState(true);

    const renderPortfolioData = () => {
        API.fetchPortfolioData(PortfolioID, userToken).then(
            (res) => {
                setInvestments(investments => {
                    switch (currentSort) {
                        case "sortInvestmentPercentageAsc":
                            return res.data.investments.sort(sortInvestmentPercentageAsc)
                            break;
                        default:
                            return res.data.investments.sort(sortInvestmentPercentageDesc)
                    }
                });
                setPortfolio(portfolio => res.data);
            });
    }

    const sortInvestmentPercentageDesc = (a, b) => {
        if (a.target_percentage > b.target_percentage) {
            return -1;
        }
        if (a.target_percentage < b.target_percentage) {
            return 1;
        }
        return 0;
    }

    const sortInvestmentPercentageAsc = (a, b) => {
        if (a.target_percentage < b.target_percentage) {
            return -1;
        }
        if (a.target_percentage > b.target_percentage) {
            return 1;
        }
        return 0;
    }

    const editInvestment = (event) => {
        let investmentIndex = event.currentTarget.getAttribute("data-investment_index");
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        let investmentName = document.getElementById("editInvestmentNameInput" + investmentIndex).value;
        let investmentPrice = document.getElementById("editInvestmentPriceInput" + investmentIndex).value;
        let investmentPriceTarget = document.getElementById("editInvestmentTargetPriceInput" + investmentIndex).value;

        let updatedInvestmentData = {
            "symbol": investmentSymbol,
            "name": investmentName,
            "price": investmentPrice,
            "price_target": investmentPriceTarget
        }

        API.updateInvestment(PortfolioID, userToken, updatedInvestmentData).then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    const saveNewInvestment = () => {
        if (addTickerSymbol && addInvestmentName) {
            var newInvestmentData = {
                symbol: addTickerSymbol.toUpperCase(),
                name: addInvestmentName,
                price: 0,
                price_target: 0,
                target_percentage: 0,
                purchased: false,
                purchase_date: null,
                purchase_amount: 0,
                purchase_price: 0
            }

            API.addInvestment(PortfolioID, userToken, newInvestmentData).then(res => {
                console.log(res);
                renderPortfolioData();
            });

            document.getElementById("addTickerSymbolInput").value = "";
            document.getElementById("addInvestmentNameInput").value = "";
            addTickerSymbol = "";
            addInvestmentName = "";
        }
    }

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));
        renderPortfolioData();
    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container page-content">
                <div className="col-md-12 mt-2 pt-1 pb-1 text-center">
                    <h5><strong>{portfolio !== undefined ? portfolio.name : ""}</strong></h5>
                    <button type="button" className="btn btn-sm" data-toggle="modal" data-target="#addInvestmentModal">
                        Add Investment
                    </button>
                    <div className="mt-2">
                        <table className="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Symbol</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Price Target</th>
                                    <th scope="col">Gain/Loss Potential</th>
                                    <th scope="col">Controls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investments !== undefined && investments.length > 0 ? investments.map((investment, i) => {
                                    return (
                                        <tr>
                                            <td>{investment.symbol}</td>
                                            <td>{investment.name}</td>
                                            <td>{"$" + investment.price.toFixed(2)}</td>
                                            <td>{"$" + investment.price_target.toFixed(2)}</td>
                                            <td>
                                                {investment.target_percentage < 1 ?
                                                    <span class="badge badge-pill badge-danger p-2">{((investment.target_percentage * 100).toFixed(2) - 100) + '% Loss'}</span> : <span class="badge badge-pill badge-success p-2">+{((investment.target_percentage * 100).toFixed(2) - 100) + '% Gain'}</span>

                                                }
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-sm m-1" data-toggle="modal" data-target={"#editInvestmentModal" + i}>Edit</button>
                                                <button type="button" className="btn btn-sm m-1">Buy</button>
                                                <button type="button" className="btn btn-sm m-1">Sell</button>
                                            </td>
                                            <EditInvestmentModal
                                                i={i}
                                                investmentName={investment.name}
                                                investmentSymbol={investment.symbol}
                                                investmentPrice={investment.price}
                                                investmentTarget={investment.price_target}
                                                editInvestmentFunction={editInvestment}
                                                setEditInvestmentNameInput={setEditInvestmentNameInput}
                                                setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                                setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                            />
                                        </tr>

                                    )
                                })
                                    : <tr>
                                        <td colspan="6">No Investments</td>
                                    </tr>

                                }
                            </tbody>
                        </table>
                    </div>
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
                                        <input type="text" className="form-control" id="addTickerSymbolInput" maxLength="5" onChange={setAddTickerSymbol} placeholder="Enter an investment symbol (example: AAPL)..." />
                                    </div>
                                    <div className="form-group">
                                        <label for="addInvestmentNameInput">Investment Name</label>
                                        <input type="text" className="form-control" id="addInvestmentNameInput" onChange={setAddInvestmentName} placeholder="Enter an investment name (example: Apple Inc.)..." />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-sm" data-dismiss="modal" onClick={saveNewInvestment}>Save</button>
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