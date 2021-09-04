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

    const renderPortfolioData = () => {
        API.fetchPortfolioData(PortfolioID, userToken).then(
            (res) => {
                setPortfolio(portfolio => res.data);
                setLoading(loading => false);
            });
    };

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));
        renderPortfolioData();
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
                            <div className="row justify-content-center">
                                <h3>Portfolio Performance Forecast Coming Soon!</h3>
                            </div>
                        </div> : ""
                    }
                    <AuthTimeoutModal />
                </div>
            </div>
        </div>
    )
}

export default Performance;