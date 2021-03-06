import React from "react";
import "./style.css";

function EditInvestmentModal(props) {
    return (
        <div className="modal fade" id={"editInvestmentModal" + props.i} data-investment_index={props.i} tabindex="-1" role="dialog" aria-labelledby={"editInvestmentLabel" + props.i} aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addInvestmentLabel">{"Edit Details for " + props.investmentName + " (" + props.investmentSymbol + ")"}</h5>
                        <button type="button" className="close close-dark" data-dismiss="modal" aria-label="Close">
                            <span className="close-modal-icon" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label for={"editInvestmentNameInput" + props.i}>Update Investment Name</label>
                                <input type="text" key={props.investmentSymbol + props.i} className="form-control" id={"editInvestmentNameInput" + props.i} defaultValue={props.investmentName} onChange={props.setEditInvestmentNameInput} />
                            </div>
                            <div className="form-group">
                                <label for={"editInvestmentPriceInput" + props.i}>Update Price</label>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                    <input type="number" className="form-control" key={props.investmentPrice + props.i} id={"editInvestmentPriceInput" + props.i} defaultValue={props.investmentPrice} step=".01" onChange={props.setEditInvestmentPriceInput} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for={"editInvestmentTargetPriceInput" + props.i}>Update Target Price</label>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                    <input type="number" key={props.investmentTarget + props.i} className="form-control" id={"editInvestmentTargetPriceInput" + props.i} defaultValue={props.investmentTarget} step=".01" onChange={props.setEditInvestmentTargetInput} />
                                </div>
                                <input className="mr-2" type="checkbox" id={"manualTargetPriceInput" + props.i} key={props.investmentTarget + props.i} defaultChecked={(props.manualPriceTarget === undefined || props.manualPriceTarget === false) ? false : true} aria-label="Checkbox for following text input" />
                                <label for={"manualTargetPriceInput" + props.i}>Manually Update Price Target</label>
                            </div>
                            <div className="form-group">
                                {(props.investmentPurchased === false || props.investmentPurchased === undefined) ?
                                    <button type="button" className="btn btn-sm btn-red-inverted text-left" data-dismiss="modal" data-investment_index={props.i} data-investment_symbol={props.investmentSymbol} onClick={props.stopWatchingInvestmentFunction}>Stop Watching</button> : ""
                                }
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <div className="row w-100">
                            <div className="col-md-12 text-right">
                                <button type="button" className="btn btn-sm btn-red mr-1 text-right" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-sm btn-green text-right" data-dismiss="modal" data-investment_index={props.i} data-investment_symbol={props.investmentSymbol} onClick={props.editInvestmentFunction}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EditInvestmentModal;