import React from "react";
import { logout } from "../../SharedFunctions/SharedFunctions";
import "./style.css";


function Navbar(props) {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="/">Investment Tracker</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <button className=" nav-item btn btn-red btn-sm mb-2 mt-2" name="logout-btn" onClick={logout}>Logout</button>
                    </ul>
                </div>
            </div>
        </nav>

    )
}

export default Navbar;