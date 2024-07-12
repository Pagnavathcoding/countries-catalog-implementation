import React from "react";
import "../index.css";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../api";
import Map from "./Map";
export default function CountryInformation({data, show}) {
    const [showCountryInfos, setShowCountryInfos] = show;

    const {isLoaded} = useJsApiLoader({
        id: GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    })
    return (
        <div className="country-information">
            <div className="country-information-container">
                <div className="country-information-container-title">
                    <h1>All Country Information</h1>
                </div>
                <div className="country-content">
                    <div className="country-content-left">
                        <img src={data.flags.png}/>
                        <h3>{data.name.official}</h3>
                        <div className="display-map">
                            {/* Display map */}
                            {showCountryInfos && <Map 
                                isLoaded={isLoaded} 
                                lat={data.latlng[0]} lng={data.latlng[1]} 
                            />}
                        </div>
                    </div>
                    <div className="country-content-right">
                        <div className="info">
                            <p style={{marginTop: 0}}><b>Common Name: </b>{data.name.common}</p>
                            <p><b>Native Name: </b></p>
                            <ul>
                                {(data.name.nativeName && typeof data.name.nativeName === 'object') ? 
                                    Object.entries(data.name.nativeName).map((value, index) => {
                                        return (
                                            <li key={index}>
                                                {value[0]} - <b>Official:</b> {value[1].official}, <b>Common:</b> {value[1].common}
                                            </li>
                                        );
                                    }) : <li>?</li>
                                }
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Top Level Domain: </b></p>
                            <ul>
                                {data.tld?.length > 0 ?
                                    data.tld.map((value, index) => {
                                        return <li key={index}>{value}</li>
                                    })
                                : <li>?</li>}
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>ccn3: </b>{data.ccn3}</p>
                        </div>
                        <div className="info">
                            <p><b>Currencies: </b></p>
                            <ul>
                            {(data.currencies && typeof data.currencies === 'object') ? 
                                Object.entries(data.currencies).map((value, index) => {
                                    return (
                                        <li key={index}>
                                            {value[0]} - <b>Name: </b>{value[1].name}, <b>Symbol: </b>{value[1].symbol}
                                        </li>
                                    );
                                }) : <li>?</li>
                            }
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Country Calling Codes: </b></p>
                            <ul>
                                {data.idd.suffixes?.length > 0 ?
                                    data.idd.suffixes.map(value => {
                                        return data.idd.root + value;
                                    }).map((result, index) => {
                                        return <li key={index}>{result}</li>
                                    })
                                : <li>?</li>}
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Capital: </b></p>
                            <ul>
                                {typeof data.capital === "object" ?
                                    data.capital.map((value, index) => {
                                        return <li key={index}>{value}</li>
                                    })
                                : <li>?</li>}
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Alternative Name: </b></p>
                            <ul>
                                {
                                    data.altSpellings.map((value, index) => {
                                        return <li key={index}>{value}</li>
                                    })
                                }
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Region: </b></p>
                            <ul>
                                <li>{data.region}</li>
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Sub Region: </b></p>
                            <ul>
                                <li>{data.subregion}</li>
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Translations: </b></p>
                            <ul>
                                {data.translations !== null && 
                                    Object?.entries(data.translations)?.map((value, index) => {
                                        return <li key={index}>{value[0]} - <b>Official:</b> {value[1].official}, <b>Common:</b> {value[1].common}</li>
                                    })
                                }
                            </ul>
                        </div>
                        <div className="info">
                            <p><b>Population: </b>{data.population.toLocaleString()}</p>
                        </div>
                        <div className="info">
                            <p><b>Car Side: </b>{data.car.side}</p>
                        </div>
                        <div className="info">
                            <p><b>Time Zones: </b>{data.timezones}</p>
                        </div>
                        <div className="info">
                            <p><b>Continents: </b>{data.continents}</p>
                        </div>
                        <div className="info">
                            <p><b>Postal Code: </b></p>
                            <ul>
                                <li>Format: {data.postalCode?.format || "?"}</li>
                                <li>Regex: {data.postalCode?.regex || "?"}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="country-information-container-btn">
                    <button onClick={() => setShowCountryInfos(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}