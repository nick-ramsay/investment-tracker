import React, { useState, useEffect, useCallback } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import moment from "moment";
import "./style.css";
import { useInput, commaFormat } from "../../sharedFunctions/sharedFunctions";
import Navbar from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";

import expandMoreIcon from "../../images/icons/baseline_expand_more_black_48dp.png";
import expandLessIcon from "../../images/icons/baseline_expand_less_black_48dp.png";


import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";

const ValueSearch = () => {

    var [valueSearchData, setValueSearchData] = useState([]);
    var [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
    var [minPE, setMinPE] = useInput(10);
    var [maxPE, setMaxPE] = useInput(15);
    var [minDebtEquity, setMinDebtEquity] = useInput(0.00);
    var [maxDebtEquity, setMaxDebtEquity] = useInput(2.00);
    var [minPriceSales, setMinPriceSales] = useInput(0.00);
    var [maxPriceSales, setMaxPriceSales] = useInput(2.00);
    var [minPriceToBook, setMinPriceToBook] = useInput(0.95);
    var [maxPriceToBook, setMaxPriceToBook] = useInput(1.1);
    var [minCap, setMinCap] = useState(0);
    var [maxCap, setMaxCap] = useState(10000000000);
    var [investmentType, setInvestmentType] = useState("cs");
    var [valueSearchResultCount, setValueSearchResultCount] = useState(-1);
    var [currentSort, setCurrentSort] = useState("");
    var [loading, setLoading] = useState(true);

    const setMarketCapSize = (event) => {
        let selectedMarketCap = event.target.value;

        if (selectedMarketCap === "small") {
            setMinCap(minCap => 0);
            setMaxCap(maxCap => 1999999999);
        } else if (selectedMarketCap === "mid") {
            setMinCap(minCap => 2000000000);
            setMaxCap(maxCap => 9999999999)
        } else if (selectedMarketCap === "large") {
            setMinCap(minCap => 10000000000);
            setMaxCap(maxCap => Infinity)
        } else {
            setMinCap(minCap => 0);
            setMaxCap(maxCap => Infinity)
        }
    }

    const selectedInvestmentType = (event) => {
        let currentInvestmentType = event.target.value;
        setInvestmentType(investmentType => setInvestmentType(currentInvestmentType))
    }

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

    const fetchValueSearchData = () => {
        console.log("Called fetchValueSearchData function...");
        API.fetchValueSearchData().then(res => {
            setValueSearchData(valueSearchData => {
                switch (currentSort) {
                    case "sortInvestmentPercentageDesc":
                        return res.data.sort(sortInvestmentPercentageDesc)
                        break;
                    default:
                        return res.data.sort(sortInvestmentPercentageAsc)
                }
            }, setLoading(loading => false));
        })
    }

    useEffect(() => {
        fetchValueSearchData();
    }, []) //<-- Empty array makes useEffect run only once...


    return (
        <div>
            <Navbar />
            <div className="container page-content text-center">
                <div className="col-md-12 mt-2 pt-1 pb-1">
                    <h2>Value Search</h2>
                    {!loading ?
                        <div>
                            <div className="accordion" id="accordionExample">
                                <div>
                                    <a className="text-center" href="#" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" onClick={advancedOptionsOpen === false ? () => { setAdvancedOptionsOpen(advancedOptionsOpen => true) } : () => { setAdvancedOptionsOpen(advancedOptionsOpen => false) }}>
                                        Search Parameters {advancedOptionsOpen === true ? <img className="text-icon" src={expandLessIcon} alt="expandLessIcon" /> : <img className="text-icon" src={expandMoreIcon} alt="expandMoreIcon" />}
                                    </a>
                                    <div id="collapseOne" className="collapse m-1" aria-labelledby="headingOne" data-parent="#accordionExample">
                                        <div className="card parameter-card mt-1">
                                            <div className="card-body">
                                                <form>
                                                    <div className="row pr-3 pl-3">
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="minPEInput">Min PE Ratio</label>
                                                                <input type="number" className="form-control" id="minPEInput" aria-describedby="minPEInput" placeholder="Minimum PE Ratio" defaultValue={10} onChange={setMinPE} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="maxPEInput">Max PE Ratio</label>
                                                                <input type="number" className="form-control" id="maxPEInput" aria-describedby="maxPEInput" placeholder="Maximum PE Ratio" defaultValue={15} onChange={setMaxPE} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row pr-3 pl-3">
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="minDebtEquityInput">Min Debt/Equity</label>
                                                                <input type="number" className="form-control" id="minDebtEquityInput" aria-describedby="minDebtEquityInput" placeholder="Minimum Debt/Equity" defaultValue={0.00} step="0.01" onChange={setMinDebtEquity} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="maxDebtEquityInput">Max Debt/Equity</label>
                                                                <input type="number" className="form-control" id="maxDebtEquityInput" aria-describedby="maxDebtEquityInput" placeholder="Maximum Debt/Equity" defaultValue={2.00} step="0.01" onChange={setMaxDebtEquity} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row pr-3 pl-3">
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="minPriceToBookInput">Min Price-to-Book</label>
                                                                <input type="number" className="form-control" id="minPriceToBookInput" aria-describedby="minPriceToBookInput" placeholder="Minimum Price-to-Book" defaultValue={0.95} step="0.01" onChange={setMinPriceToBook} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="maxPriceToBookInput">Max Price-to-Book</label>
                                                                <input type="number" className="form-control" id="maxPriceToBookInput" aria-describedby="maxPriceToBookInput" placeholder="Maximum Price-to-Book" defaultValue={1.10} step="0.01" onChange={setMaxPriceToBook} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row pr-3 pl-3">
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="minPriceSalesInput">Min Price-to-Sales</label>
                                                                <input type="number" className="form-control" id="minPriceSalesInput" aria-describedby="minPriceSalesInput" placeholder="Minimum Price-to-Sales" defaultValue={0.00} step="0.01" onChange={setMinPriceSales} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="maxPriceSalesInput">Max Price-to-Sales</label>
                                                                <input type="number" className="form-control" id="maxPriceSalesInput" aria-describedby="maxPriceSalesInput" placeholder="Maximum Price-to-Sales" defaultValue={2.00} step="0.01" onChange={setMaxPriceSales} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row pr-3 pl-3">
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="investmentTypeLookup">Cap Size</label>
                                                                <select className="form-control" onClick={(event) => { setMarketCapSize(event) }}>
                                                                    <option value="all" selected>All</option>
                                                                    <option value="small" >Small Cap</option>
                                                                    <option value="mid">Mid Cap</option>
                                                                    <option value="large">Large</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-auto mb-auto">
                                                            <div className="form-group">
                                                                <label htmlFor="investmentTypeLookup">Investment Type</label>
                                                                <select className="form-control" onClick={(event) => { selectedInvestmentType(event) }}>
                                                                    <option value="cs" selected>Common Stock</option>
                                                                    <option value="ad" >ADR</option>
                                                                    <option value="gdr">GDR</option>
                                                                    <option value="re">REIT</option>
                                                                    <option value="ce">Closed End Fund</option>
                                                                    <option value="si">Secondary Issue</option>
                                                                    <option value="lp">Limited Partnership</option>
                                                                    <option value="et">ETF</option>
                                                                    <option value="wt">Warrant</option>
                                                                    <option value="rt">Right</option>
                                                                    <option value="oef">Open Ended Fund</option>
                                                                    <option value="cef">Closed Ended Fund</option>
                                                                    <option value="ps">Preferred Stock</option>
                                                                    <option value="ut">Unit</option>
                                                                    <option value="struct">Structured Product</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {valueSearchData.map((valueSearchItem, i) =>
                                    (
                                        ((valueSearchItem.quote.peRatio > minPE && valueSearchItem.quote.peRatio <= maxPE) /*|| !valueSearchItem.quote.peRatio*/)
                                        &&
                                        ((valueSearchItem.quote.marketCap > minCap && valueSearchItem.quote.marketCap <= maxCap) /*|| !valueSearchItem.quote.marketCap*/)
                                        &&
                                        ((valueSearchItem.debtEquity > minDebtEquity && valueSearchItem.debtEquity <= maxDebtEquity) /*|| !valueSearchItem.debtEquity*/)
                                        &&
                                        ((valueSearchItem.priceToBook > minPriceToBook && valueSearchItem.priceToBook <= maxPriceToBook) /*|| !valueSearchItem.priceToBook*/)
                                        &&
                                        ((valueSearchItem.type === investmentType) || !valueSearchItem.type)
                                    ) ?
                                        <div key={"valueSearchCard" + i} className="card mt-1 mb-1">
                                            <div className="row card-header m-0 pt-1">
                                                <div className="col-md-8">
                                                    <h5 className="text-center"><a className="dark-link" href={"https://finance.yahoo.com/quote/" + valueSearchItem.symbol} target="_blank"><strong>{valueSearchItem.quote.companyName + " (" + valueSearchItem.quote.symbol + ")"}</strong></a></h5>
                                                </div>
                                                <div className="col-md-4 mb-1 mt-1">
                                                    <div>
                                                        {valueSearchItem.targetPercentage > 1 && valueSearchItem.targetPercentage !== null ?
                                                            <span className="badge badge-danger p-2">{(((valueSearchItem.targetPercentage - 1) * 100).toFixed(2)) + '% Over'}</span> : valueSearchItem.targetPercentage !== null ? <span className="badge badge-success p-2">{(((1 - valueSearchItem.targetPercentage) * 100).toFixed(2)) + '% Under'}</span> : ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-1">
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.price !== null ? "Price: $" + valueSearchItem.price.toFixed(2) : ""}</span>
                                                </div>
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.targetPrice !== null ? "Target Price: $" + valueSearchItem.targetPrice.toFixed(2) : ""}</span>
                                                </div>
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.exchangeName !== null ? "Exchange: " + valueSearchItem.exchange : ""}</span>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.quote.peRatio !== null ? "P/E Ratio: " + valueSearchItem.quote.peRatio.toFixed(2) : ""}</span>
                                                </div>
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.debtEquity && valueSearchItem.debtEquity !== null ? "Debt-to-Equity: " + valueSearchItem.debtEquity.toFixed(2) : ""}</span>
                                                </div>
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.priceToBook && valueSearchItem.priceToBook !== null ? "Price-to-Book: " + valueSearchItem.priceToBook.toFixed(2) : ""}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-1">
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.quote.marketCap ? "Market Cap: $" + commaFormat(valueSearchItem.quote.marketCap) : ""}</span>
                                                </div>
                                                <div className="col-md-4">
                                                    <span>{valueSearchItem.week52Range ? "52 Week Range: " + valueSearchItem.week52Range.toFixed(2) + "%" : ""}</span>
                                                </div>
                                                <div className="col-md-4"></div>
                                            </div>
                                        </div>
                                        : ""
                                )
                                }
                            </div>
                        </div>
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
            </div>
            <AuthTimeoutModal />
        </div >
    )

}

export default ValueSearch;