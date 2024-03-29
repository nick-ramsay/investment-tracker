import React from "react";
import moment from "moment";
import EditInvestmentModal from "../EditInvestmentModal/EditInvestmentModal";
import refreshIcon from "../../images/icons/baseline_refresh_white_48dp.png";
import changeIcon from "../../images/icons/baseline_create_black_48dp.png";
import newLabelIcon from "../../images/icons/outline_new_label_black_24dp.png";
import kppIcon from "../../images/icons/kpp_logo.png";
import motleyFoolIcon from "../../images/icons/motley_fool_logo.png";
import motleyFoolBlastOffIcon from "../../images/icons/icons8-rocket-96.png";
import cnbcIcon from "../../images/icons/cnbc_logo.png";
import iceboxIcon from "../../images/icons/icebox_icon.png";
import thawIcon from "../../images/icons/thaw_icon.png";
import valueSearchIcon from "../../images/icons/value_search_icon.png";
import foreverHoldIcon from "../../images/icons/outline_lock_black_48dp.png";
import queuedForPurchaseIcon from "../../images/icons/baseline_shopping_cart_black_48dp.png";
import "./style.css";
import AddInvestmentModal from "../AddLabelModal/AddLabelModal";

function InvestmentTable(props) {
    return (
        <div>
            <table className="table table-responsive-lg">
                <thead className="header" style={{borderBottom: "none"}}>
                    <tr>
                        <th colSpan={7} className="p-0" style={{borderBottom: "none"}}>
                            <ul className="nav nav-pills justify-content-center p-0" id="nav-tabs" role="tablist">
                                <li className="nav-pill">
                                    <a className={"nav-link shadow " + (localStorage.getItem('tabCategory') === 'icebox' ? 'active' : '')} id="icebox-tab" data-toggle="tab" href="#tab-icebox" role="tab" aria-controls="tab-icebox" aria-selected="true" onClick={() => props.setPortfolioTab("icebox")}>Iceb<img className="table-header-icon" src={iceboxIcon} alt="icebox-icon.png" style={{ margin: "0 0 1px 0", height: 15, width: 15 }} />x</a>
                                </li>
                                <li className="nav-pill">
                                    <a className={"nav-link shadow " + (localStorage.getItem('tabCategory') === 'watch' ? 'active' : '')} id="watch-list-tab" data-toggle="tab" href="#tab-watch-list" role="tab" aria-controls="tab-watch-list" aria-selected="true" onClick={() => props.setPortfolioTab("watch")}>Watch List</a>
                                </li>
                                <li className="nav-pill">
                                    <a className={"nav-link shadow " + (localStorage.getItem('tabCategory') === 'own' ? 'active' : '')} id="owned-tab" data-toggle="tab" href="#tab-owned" role="tab" aria-controls="tab-owned" aria-selected="false" onClick={() => props.setPortfolioTab("own")}>Own ({props.ownCount})</a>
                                </li>
                                <li className="nav-pill">
                                    <a className={"nav-link shadow " + (localStorage.getItem('tabCategory') === 'hold' ? 'active' : '')} id="hold-tab" data-toggle="tab" href="#tab-hold" role="tab" aria-controls="tab-hold" aria-selected="false" onClick={() => props.setPortfolioTab("hold")}>Hold ({props.holdCount})</a>
                                </li>
                                <li className="nav-pill">
                                    <a className={"nav-link shadow " + (localStorage.getItem('tabCategory') === 'speculative' ? 'active' : '')} id="spec-tab" data-toggle="tab" href="#tab-spec" role="tab" aria-controls="tab-spec" aria-selected="false" onClick={() => props.setPortfolioTab("speculative")}>Speculative ({props.specCount})</a>
                                </li>
                            </ul>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">Symbol</th>
                        <th scope="col" style={{ marginRight: 20 }}>Name</th>
                        <th scope="col" style={{ paddingLeft: 0, paddingRight: 0 }}></th>
                        <th scope="col">Price<img className="table-header-icon" onClick={props.generateInvestmentData} src={refreshIcon} alt="refreshIcon.png" /></th>
                        <th scope="col">Price Target{moment(props.targetPricesUpdated).format('DD/MM/YYYY') !== moment().format('DD/MM/YYYY') || props.targetPricesUpdated === undefined ? <img className="table-header-icon" onClick={props.generateTargetPriceData} src={refreshIcon} alt="refreshIcon.png" /> : ""}</th>
                        <th scope="col">Valuation</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {props.investments !== undefined && props.investments.length > 0 ? props.investments.map((investment, i) => {
                        if ((investment.status === props.status || investment.status === undefined)
                            && (investment.stopWatching === false || investment.stopWatching === undefined)
                            && ((props.queuedForPurchaseFilter === true && investment.status === "watch") ? (props.queuedForPurchaseFilter === investment.queuedForPurchase) : (investment.queuedForPurchase === true || investment.queuedForPurchase === false || investment.queuedForPurchase === undefined))) {
                            return (
                                <>
                                    <tr id={investment.symbol + "-investment-row"}>
                                        <td className="align-middle">
                                            <div className="row justify-content-center">
                                                <a className="dark-link" href={"https://finance.yahoo.com/quote/" + investment.symbol} target="_blank">{investment.symbol}</a>
                                            </div>
                                            <div className="row mt-1 justify-content-center">
                                                {(investment.queuedForPurchase === true && investment.status === "watch") ? <img className="queued-for-purchase-icon mt-1 ml-1" src={queuedForPurchaseIcon} title={investment.symbol + " is queued for purchase."}></img> : ""}
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <div className="row justify-content-center investment-name-text" data-toggle="collapse" data-target={"#" + investment.symbol + "ReasonDetails"} aria-expanded="true" aria-controls={investment.symbol + "ReasonDetails"} title={"Click to view reasons for investing in " + investment.name}>
                                                {investment.name}
                                            </div>
                                            <div className="row justify-content-center">
                                                {investment.labels !== undefined ? investment.labels.map((label, index) => {
                                                    if (label === "Motley Fool") {
                                                        return (<img className="label-icon" title="Motley Fool Recommendation" src={motleyFoolIcon} alt="motleyFoolIcon.png" />)
                                                    }
                                                    else if (label === "KPP") {
                                                        return (<img className="label-icon" title="Investalk Recommendation" src={kppIcon} alt="kppIcon.png" />)
                                                    }
                                                    else if (label === "CNBC") {
                                                        return (<img className="label-icon" title="CNBC Recommendation" src={cnbcIcon} alt="cnbcIcon.png" />)
                                                    }
                                                    else if (label === "Value Search") {
                                                        return (<img className="label-icon" title="Value Search Recommendation" src={valueSearchIcon} alt="valueSearchIcon.png" />)
                                                    }
                                                    else if (label === "Motley Fool Blast Off") {
                                                        return (<img className="label-icon" title="Motley Fool Blast Off Recommendation" src={motleyFoolBlastOffIcon} alt="motleyFoolBlastOffIcon.png" />)
                                                    }
                                                }) : ""}
                                            </div>
                                        </td>
                                        <td className="align-middle" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <a data-toggle="modal" data-investment_symbol={investment.symbol} data-target={"#addLabelModal" + i}>
                                                <img className="table-header-icon" style={{ marginBottom: 3 }} src={newLabelIcon} alt="refreshIcon.png" />
                                            </a>
                                        </td>
                                        <td className="align-middle">
                                            <div className="row justify-content-center">{"$" + investment.price.toFixed(2)}</div>
                                            <div className="row justify-content-center">
                                                {investment.dailyChange ?
                                                    <span style={{ fontSize: 12, fontWeight: "bold", color: (investment.dailyChange >= 0 ? "green" : "red") }}>{investment.dailyChange > 0 ? <span>&#x25B2; </span> : investment.dailyChange === 0 ? "" : <span>&#x25BC; </span>} {(investment.dailyChange * 100).toFixed(2) + "%"}</span>
                                                    : ""
                                                }</div>
                                        </td>
                                        <td className="align-middle">
                                            <div className="row justify-content-center">
                                                {"$" + investment.price_target.toFixed(2)}
                                            </div>
                                            <div className="row justify-content-center">
                                                {investment.lastUpdated ?
                                                    <span style={{ fontSize: 12, fontWeight: "bold" }}>{(investment.manual_price_target === true) ? "Manual" : moment(investment.lastUpdated).format("DD/MM/YYYY")}</span>
                                                    : ""
                                                }
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <div className="row">
                                                <div className="col-md-6 mt-auto mb-auto">
                                                    <div className="row justify-content-center">
                                                        {investment.target_percentage > 1 ?
                                                            <span className="badge badge-danger p-2">{(((investment.target_percentage - 1) * 100).toFixed(2)) + '% Over'}</span> : <span className="badge badge-success p-2">{(((1 - investment.target_percentage) * 100).toFixed(2)) + '% Under'}</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mt-auto mb-auto">
                                                    <div className="row justify-content-center m-1">
                                                        {investment.numberOfAnalysts ?
                                                            <span style={{ fontSize: 11, fontWeight: "bold" }} title="A count of analysts who have contributed to the estimated 12 month price target">{investment.numberOfAnalysts} {investment.numberOfAnalysts > 1 ? "analysts" : "analyst"}</span> : ""
                                                        }
                                                    </div>
                                                    <div className="row justify-content-center">
                                                        {investment.peRatio ?
                                                            <span style={{ fontSize: 11, fontWeight: "bold" }} title="Price-To-Earnings Ratio is calculatied as Share Price/Earnings Per Share. A healthy P/E is between 1 and 15. Negative P/E indicates company is losing money while a high, positive P/E indicates that the company is profitable but the stock is expensive, likely due to sales growth.">
                                                                {investment.peRatio} P/E
                                                            </span>
                                                            : ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-1">
                                                <div className="col-md-12">
                                                    <div className="row justify-content-center yearlyPriceRangeProgressBar" style={{ display: "block" }}>
                                                        <div className="progress">
                                                            <div className="progress-bar" style={{ width: (((investment.price - investment.yearlyLow) / (investment.yearlyHigh - investment.yearlyLow) > 1) ? 100 : Math.round((((investment.price - investment.yearlyLow) / (investment.yearlyHigh - investment.yearlyLow)) * 100))) + "%" }} role="progressbar" aria-valuemin="0" aria-valuemax="100">{"$" + investment.price.toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-center yearPriceRangeData">
                                                {investment.yearlyLow ?
                                                    <div className="col-md-6 mt-1" title="52 Week Low">
                                                        <div className="row mr-1 ml-1 justify-content-center">
                                                            <span className="badge badge-danger">{"52 WL: $" + investment.yearlyLow}</span>
                                                        </div>
                                                    </div>
                                                    : ""
                                                }
                                                {investment.yearlyHigh ?
                                                    <div className="col-md-6 mt-1" title="52 Week High">
                                                        <div className="row mr-1 ml-1 justify-content-center">
                                                            <span className="badge badge-success">{"52 WH: $" + investment.yearlyHigh}</span>
                                                        </div>
                                                    </div>
                                                    : ""
                                                }
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <a data-toggle="modal" data-investment_symbol={investment.symbol} data-target={"#editInvestmentModal" + i}><img className="table-header-icon" src={changeIcon} alt="editInvestmentIcon" /></a>
                                        </td>
                                    </tr>
                                    <tr id={investment.symbol + "ReasonDetails"} className={(investment.queuedForPurchase === true && investment.status === "watch") ? "collapse queued-for-purchase-row" : "collapse"}>
                                        <td colSpan="7" style={{ borderTop: "none" }}>
                                            <div className="col-md-12">
                                                <div className="row justify-content-center">
                                                    <form className="col-md-12">
                                                        <div className="form-group mb-0">
                                                            <label for="investment-reason-input">Reasons for Owning {investment.symbol}</label>
                                                            <textarea className="form-control" id={"investment-reason-input-" + investment.symbol} rows="3" defaultValue={investment.currentReason}></textarea>
                                                        </div>
                                                        <div className="form-group mt-2 mb-0">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <label>Status</label>
                                                                    <select id={"investment-status-input-" + investment.symbol} className="custom-select align-middle" defaultValue={investment.status}>
                                                                        <option value="icebox">Icebox</option>
                                                                        <option value="watch">Watch</option>
                                                                        <option value="own">Own</option>
                                                                        <option value="hold">Hold</option>
                                                                        <option value="speculative">Speculative</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-4 mt-auto">
                                                                    <div class="form-group">
                                                                        <div class="form-check">
                                                                            <input id={"investment-qfp-input-" + investment.symbol} className="mr-2" type="checkbox" defaultChecked={investment.queuedForPurchase} />
                                                                            <label for={"investment-qfp-input-" + investment.symbol}>Queued for Purchase</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4 mt-auto">
                                                                    <div class="form-group">
                                                                        <div class="form-check">
                                                                            <input id={"investment-forever-hold-input-" + investment.symbol} className="mr-2" type="checkbox" defaultChecked={investment.currentForeverHold} />
                                                                            <label for={"investment-forever-hold-input-" + investment.symbol}>Forever Hold</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="row mt-2 justify-content-end">
                                                    <button type="button" className="btn btn-sm btn-red m-1" data-toggle="collapse" data-target={"#" + investment.symbol + "ReasonDetails"} aria-expanded="true" aria-controls={investment.symbol + "ReasonDetails"}>Close</button>
                                                    <button type="button" className="btn btn-sm btn-green m-1"
                                                        onClick={props.updateInvestmentReasons}
                                                        data-toggle="collapse"
                                                        data-target={"#" + investment.symbol + "ReasonDetails"}
                                                        aria-expanded="true" aria-controls={investment.symbol + "ReasonDetails"}
                                                        data-investment_reason_div={"investment-reason-input-" + investment.symbol}
                                                        data-investment_forever_hold_div={"investment-forever-hold-input-" + investment.symbol}
                                                        data-investment_qfp_div={"investment-qfp-input-" + investment.symbol}
                                                        data-investment_symbol={investment.symbol}
                                                    >Save</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            )
                        }
                    })
                        : <tr>
                            <td colspan="7">No Investments</td>
                        </tr>
                    }
                </tbody>
            </table>
            {
                props.investments !== undefined && props.investments.length > 0 ? props.investments.map((investment, i) => {
                    if (investment.status === props.status || investment.status === undefined) {
                        return (
                            <AddInvestmentModal
                                i={i}
                                investmentName={investment.name}
                                investmentSymbol={investment.symbol}
                                investmentLabels={investment.labels}
                                addLabelFunction={props.addLabelFunction}
                                removeLabelFunction={props.removeLabelFunction}
                                stopWatchingInvestmentFunction={props.stopWatchingInvestmentFunction}
                                setAddInvestmentLabelInput={props.setAddInvestmentLabelInput}
                            />)
                    }
                }) : ""
            }
            {
                props.investments !== undefined && props.investments.length > 0 ? props.investments.map((investment, i) => {
                    if (investment.status === props.status || investment.status === undefined) {
                        return (
                            <EditInvestmentModal
                                i={i}
                                investmentName={investment.name}
                                investmentSymbol={investment.symbol}
                                investmentPrice={investment.price}
                                investmentTarget={investment.price_target}
                                investmentPurchased={investment.purchased}
                                manualPriceTarget={investment.manual_price_target}
                                editInvestmentFunction={props.editInvestmentFunction}
                                addLabelFunction={props.addLabelFunction}
                                stopWatchingInvestmentFunction={props.stopWatchingInvestmentFunction}
                                setEditInvestmentNameInput={props.setEditInvestmentNameInput}
                                setEditInvestmentPriceInput={props.setEditInvestmentPriceInput}
                                setAddInvestmentLabelInput={props.setAddInvestmentLabelInput}
                            />
                        )
                    }
                }) : ""
            }
        </div >
    )
}

export default InvestmentTable;