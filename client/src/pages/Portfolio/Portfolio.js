import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import NavbarLoggedOut from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";
import EditInvestmentModal from "../../components/EditInvestmentModal/EditInvestmentModal";
import InvestmentTable from "../../components/InvestmentTable/InvestmentTable";
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

    const purchaseInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true).then(res => {
            console.log(res);
            renderPortfolioData();
        })
    }

    const sellInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, false).then(res => {
            console.log(res);
            renderPortfolioData();
        })
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

    const generateInvestmentData = () => {
        let portfolioInvestmentSymbols = [];

        for (let i = 0; i < investments.length; i++) {
            portfolioInvestmentSymbols.push(investments[i].symbol)
        };

        API.generateInvestmentData(PortfolioID, userToken, portfolioInvestmentSymbols).then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));
        renderPortfolioData();
    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container page-content text-center">
                <div className="col-md-12 mt-2 pt-1 pb-1">
                    <h5><strong>{portfolio !== undefined ? portfolio.name : ""}</strong></h5>
                    <div className="row justify-content-center">
                        <button type="button" className="btn btn-sm" data-toggle="modal" data-target="#addInvestmentModal">
                            Add Investment
                        </button>
                    </div>
                    <div className="row justify-content-center m-1">
                        <button type="button" className="btn btn-sm" onClick={generateInvestmentData}>
                            Generate Data
                        </button>
                    </div>
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="pills-watch-list-tab" data-toggle="pill" href="#pills-watch-list" role="tab" aria-controls="pills-watch-list" aria-selected="true">Watch List</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="pills-owned-tab" data-toggle="pill" href="#pills-owned" role="tab" aria-controls="pills-owned" aria-selected="false">Owned</a>
                        </li>
                    </ul>
                    <div className="mt-2">
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-watch-list" role="tabpanel" aria-labelledby="pills-watch-list-tab">
                                <InvestmentTable
                                    investments={investments}
                                    purchased={false}
                                    editInvestmentFunction={editInvestment}
                                    purchaseInvestment={purchaseInvestment}
                                    sellInvestment={sellInvestment}
                                    setEditInvestmentNameInput={setEditInvestmentNameInput}
                                    setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                    setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                />
                            </div>
                            <div className="tab-pane fade" id="pills-owned" role="tabpanel" aria-labelledby="pills-owned-tab">
                                <InvestmentTable
                                    investments={investments}
                                    purchased={true}
                                    editInvestmentFunction={editInvestment}
                                    purchaseInvestment={purchaseInvestment}
                                    sellInvestment={sellInvestment}
                                    setEditInvestmentNameInput={setEditInvestmentNameInput}
                                    setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                    setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                />
                            </div>
                        </div>

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