import React from "react";
import "./style.css";
import moment from "moment";

function AuthTimeoutModal(props) {

    const getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    } //Function to get a specific cookie. Source: W3Schools

    const resetLoginTokens = () => {

        let cookieExpiryDate = moment().add("60", "minutes").format();

        var client = {
            user_id: getCookie("user_token"),
            session_token: getCookie("session_access_token")
        }

        document.cookie = "user_token=" + client.user_id + ";expires=" + moment(cookieExpiryDate).format("ddd, DD MMM YYYY HH:mm:ss UTC");
        document.cookie = "auth_expiry=" + cookieExpiryDate + "; expires=" + moment(cookieExpiryDate).format("ddd, DD MMM YYYY HH:mm:ss UTC");
    }

    return (
        <div>
            <button type="button" id="open-auth-timeout-modal-btn" className="btn btn-sm mb-2 invisible" data-toggle="modal" data-target="#auth-timeout-modal">
                Test Auth Timeout Modal
            </button>
            <div className="modal fade" id="auth-timeout-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Still Working?</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Your login credentials will expire in five minutes. Would you like to continue working?
            </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm" data-dismiss="modal" onClick={resetLoginTokens}>Extend Session</button>
                            <button type="button" className="btn btn-red btn-sm" data-dismiss="modal">Dismiss</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthTimeoutModal;