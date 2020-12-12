import React from "react";
import EditInvestmentModal from "../EditInvestmentModal/EditInvestmentModal";
import refreshIcon from "../../images/icons/baseline_refresh_black_48dp.png"
import "./style.css";

function InvestmentTable(props) {
    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Symbol</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price<img className="table-header-icon" onClick={props.generateInvestmentData} src={refreshIcon} alt="refreshIcon.png" /></th>
                        <th scope="col">Price Target<img className="table-header-icon" onClick={props.generateTargetPriceData} src={refreshIcon} alt="refreshIcon.png" /></th>
                        <th scope="col" colspan="2">Valuation</th>
                        <th scope="col">Controls</th>
                    </tr>
                </thead>
                <tbody>
                    {props.investments !== undefined && props.investments.length > 0 ? props.investments.map((investment, i) => {
                        if (investment.purchased === props.purchased) {
                            return (
                                <tr>
                                    <td className="align-middle"><a href={"https://finance.yahoo.com/quote/" + investment.symbol} target="_blank">{investment.symbol}</a></td>
                                    <td className="align-middle">{investment.name}</td>
                                    <td className="align-middle">{"$" + investment.price.toFixed(2)}</td>
                                    <td className="align-middle">{"$" + investment.price_target.toFixed(2)}</td>
                                    <td className="align-middle">
                                        <div className="row justify-content-center">
                                            {investment.target_percentage < 1 ?
                                                <span class="badge badge-pill badge-danger p-2">{((investment.target_percentage * 100).toFixed(2) - 100) + '% Loss'}</span> : <span class="badge badge-pill badge-success p-2">+{((investment.target_percentage * 100).toFixed(2) - 100) + '% Gain'}</span>

                                            }
                                        </div>
                                        <div className="row justify-content-center">
                                            {investment.numberOfAnalysts ?
                                                <span style={{ fontSize: 12, fontWeight: "bold" }}>{investment.numberOfAnalysts} {investment.numberOfAnalysts > 1 ? "analysts" : "analyst"}</span> : ""
                                            }
                                        </div>

                                    </td>
                                    <td className="align-middle">
                                        <div className="row justify-content-center">
                                            {investment.peRatio ?
                                                <span style={{ fontSize: 12, fontWeight: "bold" }}>{investment.peRatio} P/E</span> : ""
                                            }
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        <button type="button" className="btn btn-sm m-1" data-toggle="modal" data-target={"#editInvestmentModal" + i}>Edit</button>
                                        {investment.purchased === false ?
                                            <button type="button" className="btn btn-sm m-1" data-investment_symbol={investment.symbol} onClick={props.purchaseInvestment}>Buy</button> :
                                            <button type="button" className="btn btn-sm m-1" data-investment_symbol={investment.symbol} onClick={props.sellInvestment}>Sell</button>
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