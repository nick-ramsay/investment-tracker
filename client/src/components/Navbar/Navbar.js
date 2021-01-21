import React from "react";
import { logout } from "../../sharedFunctions/sharedFunctions";
import logo from "../../images/logo512.png";
import "./style.css";


function Navbar(props) {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="/"><img className="mb-2" src={logo} width="25" height="25" /><strong>  Investment Tracker</strong></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav ml-auto">
                        <ul className="navbar-nav nav-link">
                            <a className="nav-item" href="/value-search">Value Search</a>
                        </ul>
                        <ul className="navbar-nav nav-link ">
                            <a href="#" className="nav-item logout-link" onClick={logout}>Logout</a>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navbar;