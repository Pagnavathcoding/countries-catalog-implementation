import React from "react";
import "../index.css";
export default function Nav({totalCountries}) {
    return (
        <header>
            <h1>Countries Catalog Implementation</h1>
            <p>Total Countries: <span>{totalCountries}</span></p>
        </header>
    )
}