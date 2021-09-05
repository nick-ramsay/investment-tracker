import React, { useState, useEffect, useCallback } from 'react';
import HashLoader from "react-spinners/HashLoader";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie, commaFormat } from "../../sharedFunctions/sharedFunctions";
import NavbarLoggedOut from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";
import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";


const Performance = () => {

    var PortfolioID = useParams().id;
    var [userToken, setUserToken] = useState(getCookie("user_token"));
    var [portfolio, setPortfolio] = useState();

    var [loading, setLoading] = useState(true);

    const renderPerformanceData = () => {
        API.fetchPerformanceData(PortfolioID, userToken).then(
            (res) => {
                console.log(res);
                setPortfolio(portfolio => res.data);
                setLoading(loading => false);
            });
    };

    const addTransfer = () => {
        let transferAmount = document.getElementById("transfer-amount-input").value;
        let transferDate = document.getElementById("transfer-date-input").value;

        let transferData = {
            "transferAmount": transferAmount != '' ? Number(transferAmount) : 0.00,
            "transferDate": moment(transferDate).format(),
            "transferCreatedAt": moment()
        };

        API.addTransfer(PortfolioID, userToken, transferData).then(
            (res) => {
                console.log(res.data);
                renderPerformanceData();
            }
        );
    };

    const deleteTransfer = (event) => {
        let transferAmount = Number(event.currentTarget.getAttribute("data_transfer-amount"));
        let transferDate = event.currentTarget.getAttribute("data_transfer-date");
        let transferCreatedAt = event.currentTarget.getAttribute("data_transfer-created-at");


        console.log(transferAmount);
        console.log(transferDate);
        console.log(transferCreatedAt);

        API.deleteTransfer(PortfolioID, userToken, transferAmount, transferDate, transferCreatedAt).then(
            (res) => {
                console.log(res.data);
                renderPerformanceData();
            }
        );
    };

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));
        renderPerformanceData();
    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container page-content text-center">
                <div className="col-md-12 mt-2 pt-1 pb-1">
                    {!loading ?
                        <div>
                            <h5><strong>{portfolio !== undefined ? portfolio.name + " - Performance" : ""}</strong></h5>
                            <div className="row justify-content-center mt-1 mb-2">
                                <a href={"../portfolio/" + portfolio._id}>View Portfolio</a>
                            </div>
                            <div class="accordion" id="accordionExample">
                                <div class="card">
                                    <div class="card-header" id="headingOne">
                                        <h2 class="mb-0">
                                            <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#transfersAccordion" aria-expanded="true" aria-controls="transfersAccordion">
                                                Transfer History
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="transfersAccordion" className="accordion-collapse collapse" aria-labelledby="transfersAccordionHeading" data-parent="#transfersAccordion">
                                        <div className="accordion-body m-3">

                                            <button type="button" className="btn btn-sm" data-toggle="modal" data-target="#addTransferModal">
                                                Add Transfer/Withdrawal
                                            </button>

                                            <div className="modal fade" id="addTransferModal" tabindex="-1" role="dialog" aria-labelledby="addTransferModalLabel" aria-hidden="true">
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="addTransferModalLabel">Record transfer/Withdrawal</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <form>
                                                                <div className="form-row">
                                                                    <div className="col">
                                                                        <input id="transfer-amount-input" type="number" className="form-control" placeholder="0.00" step="0.01" />
                                                                    </div>
                                                                    <div className="col">
                                                                        <input id="transfer-date-input" type="date" className="form-control" defaultValue={moment().format("YYYY-MM-DD")} />
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-sm btn-red" data-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-sm btn-green" onClick={addTransfer}>Save</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <table className="table mt-2">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Transfer Date</th>
                                                            <th scope="col">Transfer Amount</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {portfolio.transfers.map((transfer, i) => {
                                                            return (
                                                                <tr>
                                                                    <td>{moment(transfer.transferDate).format("D MMMM YYYY")}</td>
                                                                    <td>${transfer.transferAmount}</td>
                                                                    <td><button className="btn btn-sm btn-red" data_transfer-amount={transfer.transferAmount} data_transfer-date={transfer.transferDate} data_transfer-created-at={transfer.transferCreatedAt} onClick={deleteTransfer}>Delete</button></td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        <div className="mt-3">
                            <HashLoader
                                css={override}
                                size={250}
                                margin={6}
                                color={"#880085"}
                                loading={loading}
                            />
                        </div>
                    }
                    <AuthTimeoutModal />
                </div>
            </div>
        </div>
    )
}

export default Performance;