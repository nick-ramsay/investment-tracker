import React, { useState, useEffect, useCallback } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
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
                        case "sortInvestmentPercentageDesc":
                            return res.data.investments.sort(sortInvestmentPercentageDesc)
                            break;
                        default:
                            return res.data.investments.sort(sortInvestmentPercentageAsc)
                    }
                });
                setPortfolio(portfolio => res.data);
                setLoading(loading => false);
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
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true, false).then(res => {
            console.log(res);
            renderPortfolioData();
        })
    }

    const sellInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, false, false).then(res => {
            console.log(res);
            renderPortfolioData();
        })
    }

    const holdInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true, true).then(res => {
            console.log(res);
            renderPortfolioData();
        })
    }

    const unholdInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true, false).then(res => {
            console.log(res);
            renderPortfolioData();
        })
    }



    const saveNewInvestment = () => {
        let investmentAlreadyExists = false;
        for (let i = 0; i < investments.length; i++) {
            if (investments[i].symbol.toUpperCase() === addTickerSymbol.toUpperCase()) {
                investmentAlreadyExists = true;
            }
        }

        if (addTickerSymbol && addInvestmentName) {
            var newInvestmentData = {
                symbol: addTickerSymbol.toUpperCase(),
                name: addInvestmentName,
                price: 0,
                price_target: 0,
                target_percentage: 0,
                purchased: false,
                longTermHold: false,
                purchase_date: null,
                purchase_amount: 0,
                purchase_price: 0
            }

            if (!investmentAlreadyExists) {
                API.addInvestment(PortfolioID, userToken, newInvestmentData).then(res => {
                    console.log(res);
                    renderPortfolioData();
                });
            }


            document.getElementById("addTickerSymbolInput").value = "";
            document.getElementById("addInvestmentNameInput").value = "";
            addTickerSymbol = "";
            addInvestmentName = "";
        }
    }

    const generateInvestmentData = () => {
        setLoading(loading => true);
        let portfolioInvestmentData = [[]];

        //let limit = 250;
        let arrayIndex = 0;

        for (let i = 0; i < investments.length; i++) {
            if (i % 90 === 0 && i !== 0) {
                portfolioInvestmentData.push([]);
                arrayIndex += 1;
            }
            portfolioInvestmentData[arrayIndex].push({
                symbol: investments[i].symbol,
                target_price: investments[i].price_target
            });
        }//Breaks data in investment hook into multiple arrays with max length of 90

        API.generateInvestmentData(PortfolioID, userToken, portfolioInvestmentData).then(res => {
            console.log(res);
            renderPortfolioData();
        })
    }

    const generateTargetPriceData = () => {
        setLoading(loading => true);
        let portfolioInvestmentData = [[]];

        //let limit = 250;
        let arrayIndex = 0;

        for (let i = 0; i < investments.length; i++) {
            if (i % 90 === 0 && i !== 0) {
                portfolioInvestmentData.push([]);
                arrayIndex += 1;
            }
            portfolioInvestmentData[arrayIndex].push({
                symbol: investments[i].symbol,
                price: investments[i].price
            });
        }//Breaks data in investment hook into multiple arrays with max length of 90

        API.generateTargetPriceData(PortfolioID, userToken, portfolioInvestmentData).then(res => {
            console.log(res);
            renderPortfolioData();
        })
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
                    <p style={{ fontSize: 12, fontWeight: "bold" }}>{portfolio !== undefined && portfolio.targetPricesUpdated !== undefined ? "Target prices last updated on " + moment(portfolio.targetPricesUpdated).format('DD MMMM YYYY') + "." : ""}</p>
                    <div className="row justify-content-center">
                        <button type="button" className="btn btn-sm" data-toggle="modal" data-target="#addInvestmentModal">
                            Add Investment
                        </button>
                    </div>
                    <ul className="nav nav-tabs mt-3 mb-3" id="nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="watch-list-tab" data-toggle="tab" href="#tab-watch-list" role="tab" aria-controls="tab-watch-list" aria-selected="true">Watch List</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="owned-tab" data-toggle="tab" href="#tab-owned" role="tab" aria-controls="tab-owned" aria-selected="false">Owned</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="hold-tab" data-toggle="tab" href="#tab-hold" role="tab" aria-controls="tab-hold" aria-selected="false">Hold</a>
                        </li>
                    </ul>
                    <div className="mt-2">
                        <div className="tab-content" id="tab-tabContent">
                            <div className="tab-pane fade show active" id="tab-watch-list" role="tabpanel" aria-labelledby="watch-list-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        purchased={false}
                                        longTermHold={false}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                    />
                                    :
                                    <div className="mt-5">
                                        <BeatLoader
                                            css={override}
                                            size={60}
                                            color={"#D4AF37"}
                                            loading={loading}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="tab-owned" role="tabpanel" aria-labelledby="owned-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        purchased={true}
                                        longTermHold={false}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        holdInvestment={holdInvestment}
                                        unholdInvestment={unholdInvestment}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                    />
                                    :
                                    <BeatLoader
                                        css={override}
                                        size={75}
                                        color={"#D4AF37"}
                                        loading={loading}
                                    />
                                }
                            </div>
                            <div className="tab-pane fade" id="tab-hold" role="tabpanel" aria-labelledby="hold-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        purchased={true}
                                        longTermHold={true}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        holdInvestment={holdInvestment}
                                        unholdInvestment={unholdInvestment}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                    />
                                    :
                                    <BeatLoader
                                        css={override}
                                        size={75}
                                        color={"#D4AF37"}
                                        loading={loading}
                                    />
                                }
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
                                    <span className="close-modal-icon" aria-hidden="true">&times;</span>
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
                                <button type="button" className="btn btn-sm btn-red" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-sm btn-green" onClick={saveNewInvestment}>Save</button>
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