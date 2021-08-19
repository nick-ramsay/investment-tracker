import React, { useState, useEffect, useCallback } from 'react';
import HashLoader from "react-spinners/HashLoader";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie, commaFormat } from "../../sharedFunctions/sharedFunctions";
import settingsIcon from "../../images/icons/baseline_settings_black_48dp.png";
import iceboxIcon from "../../images/icons/icebox_icon.png"
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
    var [ownCount, setOwnCount] = useState(0);
    var [holdCount, setHoldCount] = useState(0);
    var [specCount, setSpecCount] = useState(0);
    var [currentSort, setCurrentSort] = useState("");
    var [investments, setInvestments] = useState();
    var [sumOfStockPrices, setSumOfStockPrices] = useState(0);
    var [sumOfStockTargets, setSumOfStockTargets] = useState(0);
    var [editInvestmentNameInput, setEditInvestmentNameInput] = useInput();
    var [editInvestmentPriceInput, setEditInvestmentPriceInput] = useInput();
    var [editInvestmentTargetInput, setEditInvestmentTargetInput] = useInput();
    var [addInvestmentLabelInput, setAddInvestmentLabelInput] = useInput();

    var [loading, setLoading] = useState(true);

    const renderPortfolioData = () => {
        let specCount = 0;
        let holdCount = 0;
        let ownCount = 0;
        API.fetchPortfolioData(PortfolioID, userToken).then(
            (res) => {
                console.log(res.data.investments.length);
                for (let i = 0; res.data.investments.length > i; i++) {
                    if (res.data.investments[i].status === "speculative") {
                        specCount += 1;
                    } else if (res.data.investments[i].status === "hold") {
                        holdCount += 1;
                    } else if (res.data.investments[i].status === "own") {
                        ownCount += 1;
                    }
                };

                let currentSumOfStockPrices = sumOfStockPrices;
                let currentSumOfTargets = sumOfStockTargets;

                for (let i = 0; res.data.investments.length > i; i++) {
                    if ((res.data.investments[i].status === "own" || res.data.investments[i].status === "hold" || res.data.investments[i].status === "speculative") && (res.data.investments[i].price_target !== undefined && res.data.investments[i].price_target > 0)) {
                        console.log(res.data.investments[i].price);
                        currentSumOfStockPrices += res.data.investments[i].price;
                        currentSumOfTargets += res.data.investments[i].price_target;
                    }
                }

                setSumOfStockPrices(sumOfStockPrice => currentSumOfStockPrices);
                setSumOfStockTargets(sumOfStockTargets => currentSumOfTargets);

                setOwnCount(ownCount);
                setHoldCount(holdCount);
                setSpecCount(specCount);
                setInvestments(investments => {
                    switch (currentSort) {
                        case "sortInvestmentPercentageDesc":
                            return res.data.investments.sort(sortInvestmentPercentageDesc)
                            break;
                        default:
                            return res.data.investments.sort(sortInvestmentPercentageAsc)
                    }
                });
                console.log(res.data);
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
        let manualPriceTarget = document.getElementById("manualTargetPriceInput" + investmentIndex).checked;

        console.log(manualPriceTarget);

        let updatedInvestmentData = {
            "symbol": investmentSymbol,
            "name": investmentName,
            "price": investmentPrice,
            "price_target": investmentPriceTarget,
            "manual_price_target": manualPriceTarget
        }

        API.updateInvestment(PortfolioID, userToken, updatedInvestmentData).then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    const addLabel = (event) => {
        let investmentIndex = event.currentTarget.getAttribute("data-investment_index");
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        let labelName = document.getElementById("addLabelInput" + investmentIndex).value;

        let existingLabels;

        let newLabelData = {
            symbol: investmentSymbol,
            label: labelName
        }

        for (let l = 0; l < investments.length; l++) {
            if (investments[l].symbol === investmentSymbol) {
                existingLabels = investments[l].labels;
                console.log(existingLabels);
            }
        }

        if (existingLabels === undefined || existingLabels.indexOf(labelName) === -1) {
            console.log(investmentSymbol);
            console.log(labelName);

            API.addLabel(PortfolioID, userToken, newLabelData).then(res => {
                console.log(res);
                renderPortfolioData();
            });

        }
    }

    const removeLabel = (event) => {
        let investmentIndex = event.currentTarget.getAttribute("data-investment_index");
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        let investmentLabel = event.currentTarget.getAttribute("data-investment_label");

        let currentLabels = investments[investmentIndex].labels;
        let removedLabelIndex = currentLabels.indexOf(investmentLabel);
        let newLabels = currentLabels;

        let newLabelData = {
            symbol: investmentSymbol,
            labels: currentLabels
        }

        if (removedLabelIndex !== -1) {
            newLabels.splice(removedLabelIndex, 1);
            newLabelData.labels = newLabels;
            API.editLabels(PortfolioID, userToken, newLabelData).then(res => {
                console.log(res);
                renderPortfolioData();
            });
        }
    }

    const purchaseInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true, false, false).then(res => {
            console.log(res);
            renderPortfolioData();
        });

        API.investmentStatus(PortfolioID, userToken, investmentSymbol, "own").then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    const sellInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, false, false, false).then(res => {
            console.log(res);
            renderPortfolioData();
        });

        API.investmentStatus(PortfolioID, userToken, investmentSymbol, "watch").then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    const holdInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true, true, false).then(res => {
            console.log(res);
            renderPortfolioData();
        });
        API.investmentStatus(PortfolioID, userToken, investmentSymbol, "hold").then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    const unholdInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true, false, false).then(res => {
            console.log(res);
            renderPortfolioData();
        });

        API.investmentStatus(PortfolioID, userToken, investmentSymbol, "own").then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    const speculativeHoldInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        API.investmentTransaction(PortfolioID, userToken, investmentSymbol, true, false, true).then(res => {
            console.log(res);
            renderPortfolioData();
        });

        API.investmentStatus(PortfolioID, userToken, investmentSymbol, "speculative").then(res => {
            console.log(res);
            renderPortfolioData();
        });
    }

    const iceboxInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");

        API.investmentStatus(PortfolioID, userToken, investmentSymbol, "icebox").then(res => {
            console.log(res);
            renderPortfolioData();
        });
    };

    const thawInvestment = (event) => {
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");

        API.investmentStatus(PortfolioID, userToken, investmentSymbol, "watch").then(res => {
            console.log(res);
            renderPortfolioData();
        });
    };

    const saveNewInvestment = () => {
        let investmentAlreadyExists = false;
        for (let i = 0; i < investments.length; i++) {
            if (investments[i].symbol.toUpperCase() === addTickerSymbol.toUpperCase()) {
                investmentAlreadyExists = true;
                API.stopWatchingInvestment(PortfolioID, userToken, investments[i].symbol.toUpperCase(), false).then(res => {
                    renderPortfolioData();
                });
            }
        }

        if (addTickerSymbol && addInvestmentName) {
            var newInvestmentData = {
                symbol: addTickerSymbol.toUpperCase(),
                name: addInvestmentName,
                price: 0,
                price_target: 0,
                target_percentage: 0,
                manualPriceTarget: false,
                purchase_date: null,
                purchase_amount: 0,
                purchase_price: 0,
                labels: [],
                reason_comments: "",
                status: "watch"
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

        let arrayIndex = 0;

        for (let i = 0; i < investments.length; i++) {
            if (i % 90 === 0 && i !== 0) {
                portfolioInvestmentData.push([]);
                arrayIndex += 1;
            }

            if ((investments[i].manual_price_target === undefined || investments[i].manual_price_target === false) && (investments[i].stopWatching === undefined || investments[i].stopWatching === false)) {
                portfolioInvestmentData[arrayIndex].push({
                    symbol: investments[i].symbol,
                    price: investments[i].price
                });
            }
        }//Breaks data in investment hook into multiple arrays with max length of 90

        API.generateTargetPriceData(PortfolioID, userToken, portfolioInvestmentData).then(res => {
            console.log(res);
            renderPortfolioData();
        })
    }

    const stopWatchingInvestment = (event) => {
        console.log("Clicked unwatch stock...");
        let investmentSymbol = event.currentTarget.getAttribute("data-investment_symbol");
        console.log(investmentSymbol);

        API.stopWatchingInvestment(PortfolioID, userToken, investmentSymbol, true).then(res => {
            renderPortfolioData();
        });
    }

    const updatePortfolioSettings = (event) => {
        let portfolioName = document.getElementById("portfolio-name-input").value;
        let portfolioBalance = document.getElementById("portfolio-balance-input").value;
        let targetInvestmentCount = document.getElementById("target-investment-count-input").value;

        API.updatePortfolioSettings(PortfolioID, userToken, portfolioName, portfolioBalance, targetInvestmentCount).then(res => {
            renderPortfolioData();
        })
    };

    const saveInvestmentReason = (event) => {
        let currentSymbol = event.currentTarget.getAttribute("data-investment_symbol");

        let currentReasonDiv = event.currentTarget.getAttribute("data-investment_reason_div");
        let currentReason = document.getElementById(currentReasonDiv).value;

        let currentForeverHoldDiv = event.currentTarget.getAttribute("data-investment_forever_hold_div");
        let currentForeverHold = document.getElementById(currentForeverHoldDiv).checked;

        console.log(currentSymbol);

        API.updateInvestmentReason(PortfolioID, userToken, currentSymbol, currentReason, currentForeverHold).then(res => {
            renderPortfolioData();
        });
    };

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));
        renderPortfolioData();
    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container page-content text-center">
                <div className="col-md-12 mt-2 pt-1 pb-1">
                    {!loading ?
                        <div>
                            <h5><strong>{portfolio !== undefined ? portfolio.name : ""}</strong><img id="portfolio-settings-button" className="table-header-icon" src={settingsIcon} alt="portfolioSettingsIcon.png" data-toggle="collapse" data-target="#portfolio-settings" aria-expanded="true" aria-controls="portfolio-settings" /></h5>
                            <div className="accordion" id="portfolio-settings-accordion">
                                <div id="portfolio-settings" className="accordion-collapse collapse" aria-labelledby="portfolio-settings-button" data-parent="#portfolio-settings-accordion">
                                    <div className="accordion-body card mb-4">
                                        <form className="m-2">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label for="portfolio-name-input">Portfolio Name</label>
                                                    <input id="portfolio-name-input" type="text" className="form-control" placeholder="Enter portfolio name here..." defaultValue={portfolio.name} />
                                                </div>
                                            </div>
                                            <div className="row pt-2">
                                                <div className="col-md-6">
                                                    <label for="portfolio-balance-input">Portfolio Balance</label>
                                                    <input id="portfolio-balance-input" type="number" className="form-control" placeholder="0.00" step="0.01" defaultValue={portfolio.balance} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label for="target-investment-count-input">Target Investment Count</label>
                                                    <input id="target-investment-count-input" type="number" className="form-control" placeholder="0" step="0" defaultValue={portfolio.investmentCount} />
                                                </div>
                                            </div>

                                            <div className="row pt-2">
                                                <div className="col-md-12 text-right">
                                                    <button className="btn btn-sm btn-green" type="button" onClick={updatePortfolioSettings}>Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <h5 className={(isNaN(sumOfStockTargets / sumOfStockPrices) ? 0 : (sumOfStockTargets / sumOfStockPrices)) >= 0 ? "badge badge-success p-2" : "badge badge-danger p-2"}><strong>{(((isNaN(sumOfStockTargets / sumOfStockPrices) ? 0 : ((sumOfStockTargets / sumOfStockPrices * 100) - 100)))).toFixed(2)}% Return</strong></h5>
                            </div>
                            <p style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Portfolio value is ${portfolio.balance !== undefined ? commaFormat(portfolio.balance.toFixed(2)) : "[Undefined]"}, target investment count is {portfolio.investmentCount !== undefined ? portfolio.investmentCount : "[Undefined]"}. Each investment value should be ${portfolio.balance !== undefined || portfolio.investmentCount !== undefined ? commaFormat((portfolio.balance / portfolio.investmentCount).toFixed(2)) : "[Undefined]"}.</p>
                            <p style={{ fontSize: 12, fontWeight: "bold" }}>{portfolio !== undefined && portfolio.targetPricesUpdated !== undefined ? "Target prices last updated on " + moment(portfolio.targetPricesUpdated).format('DD MMMM YYYY') + "." : ""}</p>
                            <div className="row justify-content-center">
                                <button type="button" className="btn btn-sm" data-toggle="modal" data-target="#addInvestmentModal">
                                    Add Investment
                                </button>
                            </div>
                            <ul className="nav nav-pills justify-content-center mt-3 mb-3" id="nav-tabs" role="tablist">
                                <li className="nav-pill">
                                    <a className="nav-link shadow" id="icebox-tab" data-toggle="tab" href="#tab-icebox" role="tab" aria-controls="tab-icebox" aria-selected="true">Iceb<img className="table-header-icon" src={iceboxIcon} alt="icebox-icon.png" style={{ margin: "0 0 1px 0", height: 15, width: 15 }} />x</a>
                                </li>
                                <li className="nav-pill">
                                    <a className="nav-link shadow active" id="watch-list-tab" data-toggle="tab" href="#tab-watch-list" role="tab" aria-controls="tab-watch-list" aria-selected="true">Watch List</a>
                                </li>
                                <li className="nav-pill">
                                    <a className="nav-link shadow" id="owned-tab" data-toggle="tab" href="#tab-owned" role="tab" aria-controls="tab-owned" aria-selected="false">Own ({ownCount})</a>
                                </li>
                                <li className="nav-pill">
                                    <a className="nav-link shadow" id="hold-tab" data-toggle="tab" href="#tab-hold" role="tab" aria-controls="tab-hold" aria-selected="false">Hold ({holdCount})</a>
                                </li>
                                <li className="nav-pill">
                                    <a className="nav-link shadow" id="spec-tab" data-toggle="tab" href="#tab-spec" role="tab" aria-controls="tab-spec" aria-selected="false">Speculative ({specCount})</a>
                                </li>
                            </ul>
                        </div> : ""}
                    <div className="mt-2">
                        <div className="tab-content" id="tab-tabContent">
                            <div className="tab-pane fade" id="tab-icebox" role="tabpanel" aria-labelledby="icebox-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        status={"icebox"}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        addLabelFunction={addLabel}
                                        removeLabelFunction={removeLabel}
                                        stopWatchingInvestmentFunction={stopWatchingInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        thawInvestment={thawInvestment}
                                        updateInvestmentReasons={saveInvestmentReason}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                        setAddInvestmentLabelInput={setAddInvestmentLabelInput}
                                    />
                                    :
                                    <div className="mt-5">
                                        <HashLoader
                                            css={override}
                                            size={250}
                                            margin={6}
                                            color={"#880085"}
                                            loading={loading}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="tab-pane fade show active" id="tab-watch-list" role="tabpanel" aria-labelledby="watch-list-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        status={"watch"}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        addLabelFunction={addLabel}
                                        removeLabelFunction={removeLabel}
                                        stopWatchingInvestmentFunction={stopWatchingInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        iceboxInvestment={iceboxInvestment}
                                        updateInvestmentReasons={saveInvestmentReason}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                        setAddInvestmentLabelInput={setAddInvestmentLabelInput}
                                    />
                                    :
                                    <div className="mt-5">
                                        <HashLoader
                                            css={override}
                                            size={250}
                                            margin={6}
                                            color={"#880085"}
                                            loading={loading}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="tab-owned" role="tabpanel" aria-labelledby="owned-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        status={"own"}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        addLabelFunction={addLabel}
                                        removeLabelFunction={removeLabel}
                                        stopWatchingInvestmentFunction={stopWatchingInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        holdInvestment={holdInvestment}
                                        unholdInvestment={unholdInvestment}
                                        updateInvestmentReasons={saveInvestmentReason}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                        setAddInvestmentLabelInput={setAddInvestmentLabelInput}
                                    />
                                    :
                                    <HashLoader
                                        css={override}
                                        size={250}
                                        margin={6}
                                        color={"#880085"}
                                        loading={loading}
                                    />
                                }
                            </div>
                            <div className="tab-pane fade" id="tab-hold" role="tabpanel" aria-labelledby="hold-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        status={"hold"}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        addLabelFunction={addLabel}
                                        removeLabelFunction={removeLabel}
                                        stopWatchingInvestmentFunction={stopWatchingInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        holdInvestment={holdInvestment}
                                        unholdInvestment={unholdInvestment}
                                        updateInvestmentReasons={saveInvestmentReason}
                                        speculativeHoldInvestment={speculativeHoldInvestment}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                        setAddInvestmentLabelInput={setAddInvestmentLabelInput}
                                    />
                                    :
                                    <HashLoader
                                        css={override}
                                        size={250}
                                        margin={6}
                                        color={"#880085"}
                                        loading={loading}
                                    />
                                }
                            </div>
                            <div className="tab-pane fade" id="tab-spec" role="tabpanel" aria-labelledby="spec-tab">
                                {!loading ?
                                    <InvestmentTable
                                        investments={investments}
                                        status={"speculative"}
                                        generateInvestmentData={generateInvestmentData}
                                        generateTargetPriceData={generateTargetPriceData}
                                        targetPricesUpdated={portfolio.targetPricesUpdated}
                                        editInvestmentFunction={editInvestment}
                                        addLabelFunction={addLabel}
                                        removeLabelFunction={removeLabel}
                                        stopWatchingInvestmentFunction={stopWatchingInvestment}
                                        purchaseInvestment={purchaseInvestment}
                                        sellInvestment={sellInvestment}
                                        holdInvestment={holdInvestment}
                                        unholdInvestment={unholdInvestment}
                                        updateInvestmentReasons={saveInvestmentReason}
                                        setEditInvestmentNameInput={setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={setEditInvestmentTargetInput}
                                        setAddInvestmentLabelInput={setAddInvestmentLabelInput}
                                    />
                                    :
                                    <HashLoader
                                        css={override}
                                        size={250}
                                        margin={6}
                                        color={"#880085"}
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