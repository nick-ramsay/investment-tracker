import React, { } from 'react';
import "./style.css";

const NoAccess = () => {

    return (
        <div>
            <div className="container pt-4">
                <div className="col-md-12 my-5 px-5 bg-white rounded content-container">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h1 className="mt-5" style={{ fontSize: 50 }}>
                                <strong>
                                    <span style={{ color: "#2F4F4F" }}>¯</span>
                                    <span style={{ color: "green" }}>\</span>
                                    <span style={{ color: "red" }}>_</span>
                                    <span style={{ color: "purple" }}>(</span>
                                    <span style={{ color: "black" }}>ツ</span>
                                    <span style={{ color: "teal" }}>)</span>
                                    <span style={{ color: "gold" }}>_</span>
                                    <span style={{ color: "orange" }}>/</span>
                                    <span style={{ color: "blue" }}>¯</span>
                                </strong>
                            </h1>
                            <h1 style={{ fontSize: 100, color: "#2F4F4F" }}><strong>401</strong></h1>
                            <h1 style={{ fontSize: 50, color: "red" }}><strong>None Shall Pass</strong></h1>
                            <h3 className="mb-5">Looks like you're not logged in. Log in and try again.</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoAccess;