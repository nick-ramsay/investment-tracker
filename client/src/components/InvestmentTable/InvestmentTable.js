import React from "react";
import EditInvestmentModal from "../EditInvestmentModal/EditInvestmentModal";
import "./style.css";

function InvestmentTable(props) {
    return (
        <div>
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
                    {props.investments !== undefined && props.investments.length > 0 ? props.investments.map((investment, i) => {
                        if (investment.purchased === props.purchased) {
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
                            <td colspan="6">No Investments</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default InvestmentTable;