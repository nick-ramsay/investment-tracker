import React from "react";
import moment from "moment";
import EditInvestmentModal from "../EditInvestmentModal/EditInvestmentModal";
import refreshIcon from "../../images/icons/baseline_refresh_black_48dp.png";
import changeIcon from "../../images/icons/baseline_create_black_48dp.png"
import "./style.css";

function InvestmentTable(props) {
    return (
        <div>
            <table className="table table-responsive-md table-hover">
                <thead>
                    <tr>
                        <th scope="col">Symbol</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price<img className="table-header-icon" onClick={props.generateInvestmentData} src={refreshIcon} alt="refreshIcon.png" /></th>
                        <th scope="col">Price Target<img className="table-header-icon" onClick={props.generateTargetPriceData} src={refreshIcon} alt="refreshIcon.png" /></th>
                        <th scope="col" colspan="2">Valuation</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {props.investments !== undefined && props.investments.length > 0 ? props.investments.map((investment, i) => {
                        if (investment.purchased === props.purchased && investment.longTermHold === props.longTermHold) {
                            return (
                                <tr>
                                    <td className="align-middle"><a href={"https://finance.yahoo.com/quote/" + investment.symbol} target="_blank">{investment.symbol}</a></td>
                                    <td className="align-middle">{investment.name}</td>
                                    <td className="align-middle">
                                        <div className="row justify-content-center">{"$" + investment.price.toFixed(2)}</div>
                                        <div className="row justify-content-center">
                                            {investment.dailyChange ?
                                                <span style={{ fontSize: 12, fontWeight: "bold", color: (investment.dailyChange >= 0 ? "green" : "red") }}>{investment.dailyChange > 0 ? <span>&#x25B2;</span> : investment.dailyChange === 0 ? "" : <span>&#x25BC;</span>} {investment.dailyChange.toFixed(2) + "%"}</span>
                                                : ""
                                            }</div>
                                    </td>
                                    <td className="align-middle">
                                        <div className="row justify-content-center">
                                            {"$" + investment.price_target.toFixed(2)}
                                        </div>
                                        <div className="row justify-content-center">
                                            {investment.lastUpdated ?
                                                <span style={{ fontSize: 12, fontWeight: "bold" }}>{moment(investment.lastUpdated).format("DD/MM/YYYY")}</span>
                                                : ""
                                            }
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        <div className="row justify-content-center">
                                            {investment.target_percentage > 1 ?
                                                <span class="badge badge-pill badge-danger p-2">{(((investment.target_percentage - 1) * 100).toFixed(2)) + '% Over'}</span> : <span class="badge badge-pill badge-success p-2">{(((1 - investment.target_percentage) * 100).toFixed(2)) + '% Under'}</span>

                                            }
                                        </div>
                                        <div className="row justify-content-center">
                                            {investment.numberOfAnalysts ?
                                                <span style={{ fontSize: 12, fontWeight: "bold" }}>{investment.numberOfAnalysts} {investment.numberOfAnalysts > 1 ? "analysts" : "analyst"}</span> : ""
                                            }
                                        </div>

                                    </td>
                                    <td className="align-middle p-4">
                                        <div className="row justify-content-center">
                                            {investment.peRatio ?
                                                <span style={{ fontSize: 12, fontWeight: "bold" }}>{investment.peRatio} P/E</span> : ""
                                            }
                                        </div>
                                        <div className="row justify-content-center">
                                            {investment.yearlyLow && investment.yearlyHigh ?
                                                <span style={{ fontSize: 12, fontWeight: "bold" }}>{"$" + investment.yearlyLow} &#10231; {"$" + investment.yearlyHigh}</span>
                                                : ""
                                            }
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        <span type="button" data-toggle="modal" data-investment_symbol={investment.symbol} data-target={"#editInvestmentModal" + i}><img className="table-header-icon" src={changeIcon} alt="refreshIcon.png" /></span>
                                    </td>
                                    <td className="align-middle">
                                        {investment.purchased === false && investment.longTermHold === false ?
                                            <button type="button" key={investment.symbol + "buyBtn"} className="btn btn-sm m-1" data-investment_symbol={investment.symbol} onClick={props.purchaseInvestment}>Buy</button>
                                            :
                                            investment.longTermHold === false ?
                                                <button type="button" key={investment.symbol + "sellBtn"} className="btn btn-sm m-1" data-investment_symbol={investment.symbol} onClick={props.sellInvestment}>Sell</button>
                                                :
                                                ""
                                        }
                                        {investment.purchased === true && investment.longTermHold === false ?
                                            <button type="button" key={investment.symbol + "holdBtn"} className="btn btn-sm m-1" data-investment_symbol={investment.symbol} onClick={props.holdInvestment}>Hold</button>
                                            :
                                            investment.longTermHold === true ?
                                                <button type="button" key={investment.symbol + "unholdBtn"} className="btn btn-sm m-1" data-investment_symbol={investment.symbol} onClick={props.unholdInvestment}>Unhold</button>
                                                :
                                                ""
                                        }
                                    </td>
                                    <EditInvestmentModal
                                        i={i}
                                        investmentName={investment.name}
                                        investmentSymbol={investment.symbol}
                                        investmentPrice={investment.price}
                                        investmentTarget={investment.price_target}
                                        editInvestmentFunction={props.editInvestmentFunction}
                                        setEditInvestmentNameInput={props.setEditInvestmentNameInput}
                                        setEditInvestmentPriceInput={props.setEditInvestmentPriceInput}
                                        setEditInvestmentTargetInput={props.setEditInvestmentTargetInput}
                                    />
                                </tr>
                            )
                        }
                    })
                        : <tr>
                            <td colspan="7">No Investments</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default InvestmentTable;