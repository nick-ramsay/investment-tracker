import React from "react";
import logo from "../../images/logo512.png";
import "./style.css";


function NavbarLoggedOut(props) {

    return (

        <nav className="navbar navbar-expand-lg navbar-light light-shadow">
            <div className="container">
                <a className="navbar-brand" href="/"><img className="mb-1" src={logo} width="25" height="25" /><strong>  Investment Tracker</strong></a>
            </div>
        </nav>

    )
}

export default NavbarLoggedOut;