import React from "react";
import "./style.css";

function AddInvestmentModal(props) {
    return (
        <div className="modal fade" id={"addLabelModal" + props.i} data-investment_index={props.i} tabindex="-1" role="dialog" aria-labelledby={"addInvestmentLabel" + props.i} aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addInvestmentLabel">{"Add Label for " + props.investmentName + " (" + props.investmentSymbol + ")"}</h5>
                        <button type="button" className="close close-dark" data-dismiss="modal" aria-label="Close">
                            <span className="close-modal-icon" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label for={"addLabelInput" + props.i}>Add Label</label>
                                <div class="input-group mb-1">
                                    <select className="form-control" key={"addLabelInput" + props.i} id={"addLabelInput" + props.i} onChange={props.setAddInvestmentLabelInput}>
                                        <option>KPP</option>
                                        <option>Motley Fool</option>
                                    </select>
                                </div>
                                <div class="input-group mb-3">
                                    <button type="button" className="btn-sm mx-auto" data-investment_index={props.i} data-investment_symbol={props.investmentSymbol} onClick={props.addLabelFunction}>Add Label</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AddInvestmentModal;