import React, { useState, useEffect, useCallback } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, commaFormat, getCookie } from "../../sharedFunctions/sharedFunctions";
import Navbar from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";

import expandMoreIcon from "../../images/icons/baseline_expand_more_white_48dp.png";
import expandLessIcon from "../../images/icons/baseline_expand_less_white_48dp.png";


import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";

const ValueSearch = () => {

    var [valueSearchData, setValueSearchData] = useState([]);
    var [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
    var [minPE, setMinPE] = useInput();
    var [maxPE, setMaxPE] = useInput();
    var [valueSearchResultCount, setValueSearchResultCount] = useState(-1);
    var [currentSort, setCurrentSort] = useState("");
    var [loading, setLoading] = useState(true);

    const sortInvestmentPercentageDesc = (a, b) => {
        if (a.targetPercentage > b.targetPercentage) {
            return -1;
        }
        if (a.targetPercentage < b.targetPercentage) {
            return 1;
        }
        return 0;
    }

    const sortInvestmentPercentageAsc = (a, b) => {
        if (a.targetPercentage < b.targetPercentage) {
            return -1;
        }
        if (a.targetPercentage > b.targetPercentage) {
            return 1;
        }
        return 0;
    }

    const refreshIEXCloudSymbols = () => {
        API.fetchAllIexCloudSymbols().then(res => {
            console.log(res);
        })
    }

    const fetchAllQuotes = () => {
        API.fetchAllQuotes().then(res => {
            console.log(res);
        })
    }

    const fetchPriceTargetData = () => {
        console.log("Called Fetch Price Target Data Function...");
        API.fetchAllPriceTargets().then(res => {
            console.log(res);
        })
    }


    const compileValueSearchData = () => {
        console.log("Called compileValueSearchData Function...");
        API.compileValueSearchData().then(res => {
            console.log(res);
        })
    }

    const fetchValueSearchData = () => {
        console.log("Called fetchValueSearchData Function...");
        API.fetchValueSearchData().then(res => {
            console.log(res.data[0]);
            setValueSearchData(valueSearchData => {
                switch (currentSort) {
                    case "sortInvestmentPercentageDesc":
                        return res.data[0].valueSearchData.sort(sortInvestmentPercentageDesc)
                        break;
                    default:
                        return res.data[0].valueSearchData.sort(sortInvestmentPercentageAsc)
                }
            });
            //setValueSearchData(valueSearchData => res.data[0].valueSearchData);
        })
    }

    const setFilter = () => {
        fetchValueSearchData();
    }

    useEffect(() => {
        fetchValueSearchData()
    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <Navbar />
            <div className="container page-content text-center">

                <div className="col-md-12 mt-2 pt-1 pb-1">
                    <h2>Value Search</h2>
                    <div class="accordion" id="accordionExample">
                        <div>
                            <a class="text-center" href="#" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" onClick={advancedOptionsOpen === false ? () => { setAdvancedOptionsOpen(advancedOptionsOpen => true) } : () => { setAdvancedOptionsOpen(advancedOptionsOpen => false) }}>
                                Advanced Options {advancedOptionsOpen === true ? <img className="text-icon" src={expandLessIcon} alt="expandLessIcon" /> : <img className="text-icon" src={expandMoreIcon} alt="expandMoreIcon" />}
                            </a>
                            <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div className="card mt-1">
                                    <div class="card-body">
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" href="#" onClick={() => { refreshIEXCloudSymbols() }}>Refresh IEX Cloud Symbols</button>
                                        </div>
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" onClick={() => { fetchAllQuotes() }}>Fetch Fetch All Stock Quotes</button>
                                        </div>
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" href="#" onClick={() => { fetchPriceTargetData() }}>Fetch All Price Targets</button>
                                        </div>
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" href="#" onClick={() => { compileValueSearchData() }}>Compile Value Search Data</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form>
                        <div className="row pr-3 pl-3">
                            <div className="col-md-6 mt-auto mb-auto">
                                <div className="form-group">
                                    <input type="number" className="form-control" id="minPEInput" aria-describedby="minPEInput" placeholder="0" defaultValue={0} onChange={setMinPE} />
                                </div>
                            </div>
                            <div className="col-md-6 mt-auto mb-auto">
                                <div className="form-group">
                                    <input type="number" className="form-control" id="maxPEInput" aria-describedby="maxPEInput" placeholder="15" defaultValue={15} onChange={setMaxPE} />
                                </div>
                            </div>
                            <div className="col-md-12 mt-auto mb-auto">
                                <div className="form-group">
                                    <button type="button" className="btn btn-sm btn-custom" onClick={setFilter}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <p className="mt-2">{valueSearchResultCount >= 0 ? valueSearchResultCount + " results returned" : "No Results Found"}</p>
                    <div>
                        {valueSearchData.map((valueSearchItem, i) =>
                            valueSearchItem.quote.peRatio > minPE && valueSearchItem.quote.peRatio <= maxPE ?
                                <div className="card mt-1 mb-1">
                                    <a href={"https://finance.yahoo.com/quote/" + valueSearchItem.symbol} target="_blank">{valueSearchItem.quote.companyName + " (" + valueSearchItem.quote.symbol + ")"}</a>
                                    <p>{valueSearchItem.price !== null ? "Price: $" + valueSearchItem.price.toFixed(2) : ""}</p>
                                    <p>{valueSearchItem.targetPrice !== null ? "Target Price: $" + valueSearchItem.targetPrice.toFixed(2) : ""}</p>
                                    <p>{valueSearchItem.exchangeName !== null ? "Exchange: " + valueSearchItem.exchangeName : ""}</p>
                                    <p>{valueSearchItem.quote.peRatio !== null ? "P/E Ratio: " + valueSearchItem.quote.peRatio.toFixed(2) : ""}</p>
                                    <p>{valueSearchItem.quote.marketCap ? "Market Cap: $" + commaFormat(valueSearchItem.quote.marketCap) : ""}</p>
                                    <p>{valueSearchItem.week52Range ? "52 Week Range: " + valueSearchItem.week52Range.toFixed(2) + "%" : ""}</p>
                                    <div className="row justify-content-center">
                                        {valueSearchItem.targetPercentage > 1 && valueSearchItem.targetPercentage !== null ?
                                            <span class="badge badge-danger p-2">{(((valueSearchItem.targetPercentage - 1) * 100).toFixed(2)) + '% Over'}</span> : valueSearchItem.targetPercentage !== null ? <span class="badge badge-success p-2">{(((1 - valueSearchItem.targetPercentage) * 100).toFixed(2)) + '% Under'}</span> : ""
                                        }
                                    </div>
                                </div>
                                : ""
                        )
                        }
                    </div>
                </div>
            </div>
            <AuthTimeoutModal />
        </div>
    )

}

export default ValueSearch;