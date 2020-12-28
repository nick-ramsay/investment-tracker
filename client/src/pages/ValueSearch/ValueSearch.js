import React, { useState, useEffect, useCallback } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import Navbar from "../../components/Navbar/Navbar";
import AuthTimeoutModal from "../../components/AuthTimeoutModal/AuthTimeoutModal";

import expandMoreIcon from "../../images/icons/baseline_expand_more_white_48dp.png";
import expandLessIcon from "../../images/icons/baseline_expand_less_white_48dp.png";


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

const fetchPriceTargetData = () => {
    console.log("Called Fetch Price Target Data Function...");
}


const compileValueSearchData = () => {
    console.log("Called compileValueSearchData Function...");
    API.compileValueSearchData().then(res => {
        console.log(res);
    })
}

const ValueSearch = () => {

    var [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
    var [loading, setLoading] = useState(true);


    useEffect(() => {

    }, []) //<-- Empty array makes useEffect run only once...

    return (
        <div>
            <Navbar />
            <div className="container page-content text-center">

                <div className="col-md-12 mt-2 pt-1 pb-1">
                    <h2>Value Search</h2>
                    <div class="accordion" id="accordionExample">
                        <div>
                            <a class="text-center" href="#" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" onClick={advancedOptionsOpen === false ? () => { setAdvancedOptionsOpen(advancedOptionsOpen => true) } : () => { setAdvancedOptionsOpen(advancedOptionsOpen => false) }}>
                                Advanced Options {advancedOptionsOpen === true ? <img className="text-icon" src={expandLessIcon} alt="expandLessIcon" /> : <img className="text-icon" src={expandMoreIcon} alt="expandMoreIcon" />}
                            </a>
                            <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div className="card mt-1">
                                    <div class="card-body">
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" href="#" onClick={() => {refreshIEXCloudSymbols()}}>Refresh IEX Cloud Symbols</button>
                                        </div>
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" onClick={() => {fetchAllQuotes()}}>Fetch Fetch All Stock Quotes</button>
                                        </div>
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" href="#" onClick={() => {fetchPriceTargetData()}}>Fetch All Price Targets</button>
                                        </div>
                                        <div className="row justify-content-center">
                                            <button className="btn btn-sm mt-1 mb-1" href="#" onClick={() => {compileValueSearchData()}}>Compile Value Search Data</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <AuthTimeoutModal />
        </div>
    )

}

export default ValueSearch;