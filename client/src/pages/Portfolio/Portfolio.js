import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import NavbarLoggedOut from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";
import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";

const Portfolio = () => {

    var PortfolioID = useParams().id;
    var [userToken, setUserToken] = useState(getCookie("user_token"));


    var [loading, setLoading] = useState(true);

    useEffect(() => {
        setUserToken(userToken => getCookie("user_token"));

    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container">
                <div className="col-md-12 mt-2">
                    <p>{"You're on the page for the following portfolio: " + PortfolioID }</p>
                </div>
            </div>
            <AuthTimeoutModal />
        </div>
    )

}

export default Portfolio;