import React, { useState, useEffect, useCallback } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import Navbar from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";


import API from "../../utils/API";

const override = "display: block; margin: 0 auto; border-color: #2F4F4F;";

const refreshIEXCloudSymbols = () => {
    API.fetchAllIexCloudSymbols().then(res => {
        console.log(res);
    })
}

const fetchAllQuotes = () => {
    API.fetchAllQuotes().then(res => {
        console.log(res);
    })
}

const ValueSearch = () => {

    var [loading, setLoading] = useState(true);


    useEffect(() => {

    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <Navbar />
            <div className="container page-content text-center">
                <div className="col-md-12 mt-2 pt-1 pb-1">
                    <h2>Value Search</h2>
                    <button className="btn btn-sm mt-1 mb-1" onClick={fetchAllQuotes}>Run Value Search</button>
                    <div className="row justify-content-center">
                        <a className="mt-1 mb-1" href="#" onClick={refreshIEXCloudSymbols}>Refresh IEX Cloud Symbols</a>
                    </div>
                </div>
            </div>
            <AuthTimeoutModal />
        </div>
    )

}

export default ValueSearch;