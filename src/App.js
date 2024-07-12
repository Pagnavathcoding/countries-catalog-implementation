import React, {useState, useEffect} from "react";
import axios from "axios";
import "./index.css";
import { API } from "./api";
import Nav from "./components/Nav";
import Loading from "./components/Loading";
import Fuse from "fuse.js";
import CountryInformation from "./components/CountryInformation";
import Footer from "./components/Footer";
const totalCountriesPerPage = 25;
const STYLE = "#258bd2";
const App = () => {
    const [countries, setCounties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Information required
    const countryCategories = ["No.", "Flags", "Country Name", "CCA2", "CCA3", "Native Name", "Alternative Name", "Country Calling Codes"];

    const [search, setSearch] = useState("");
    const [sortType, setSortType] = useState("asc");

    // Pagination variables
    const [startPage, setStartPage] = useState(1);
    const totalPages = Math.ceil(countries?.length / totalCountriesPerPage);
    const startData = (startPage - 1) * totalCountriesPerPage;
    const endData = startData + totalCountriesPerPage;

    const [countriesFromApi, setCountriesFromApi] = useState([]);

    const [showLine, setShowLine] = useState(false);

    // Fetch country API using axios
    useEffect(() => {
        fetchCountriesApi(API);
    }, []);
    const fetchCountriesApi = async (api) => {
        setIsLoading(true);
        return await axios.get(api).then(data => {
            console.log(data);
            const result = data.data;
            if (result) {
                let neededData = [];
                for (const value of result) {
                    const countryObject = {
                        titles: countryCategories,
                        flags: value.flags.png,
                        countryName: value.name.official,
                        cca2: value.cca2,
                        cca3: value.cca3,
                        nativeCountryName: value.name.nativeName,
                        alternativeCountryName: value.altSpellings,
                        countryCallingCodes: value.idd,
                    }
                    neededData.push(countryObject);
                }
                setCounties(neededData);
                setCountriesFromApi(result);
                setIsLoading(false);
            }
        }).catch(err => err);
    }

    // Additional functions
    const getCountryCallingCodes = (root, suffixes) => {
        const addRoot = suffixes?.map(value => root + value);
        return addRoot;
    }

    const getNativeCountryName = (nativeCountryName) => {
        const nativeCountryNameList =  typeof nativeCountryName === "object" && Object.keys(nativeCountryName);
        return nativeCountryNameList;
    }

    // Ascending order and descending order
    const [afterSortCountries, setAfterSortCountries] = useState([]);

    const sortingTypes = [
        {
            title: "Ascending Order (ASC)",
            key: "asc"
        },
        {
            title: "Descending Order (DESC)",
            key: "desc"
        }
    ];


    useEffect(() => {
        const sortedData = [...countries].sort((a, b) => {
            switch(sortType) {
                case "asc":
                    if (a.countryName < b.countryName) return -1;
                    if (a.countryName > b.countryName) return 1;
                    return 0;
                default:
                    if (a.countryName > b.countryName) return -1;
                    if (a.countryName < b.countryName) return 1;
                    return 0;
            }
        });
        setAfterSortCountries(sortedData);
    }, [sortType, countries]);

    const [resultDataPerPage, setResultDataPerPage] = useState([]);
    useEffect(() => {
        setResultDataPerPage(afterSortCountries.slice(startData, endData));
    }, [afterSortCountries, startPage])

    // Fuzzy Search
    const fuse = new Fuse(resultDataPerPage, {
        keys: ['countryName'],
        includeScore: true,
        threshold: 0.4
    });

    const handleSearchCountryName = ({currentTarget = {}}) => {
        const {value} = currentTarget;
        setSearch(value);
    }

    const searchResults = search.length > 0 ? fuse.search(search).map(result => result.item) : resultDataPerPage;

    // Deliver country information
    const [countryInfos, setCountryInfos] = useState([]);
    const [showCountryInfos, setShowCountryInfos] = useState(false);

    return (
        <>
            {isLoading ? <Loading/> : <main>
                {showCountryInfos && <CountryInformation data={countriesFromApi.filter(country => country?.name?.official === countryInfos.countryName)[0]} show={[showCountryInfos, setShowCountryInfos]} />}
                <Nav totalCountries={countries.length} />
                <div className="functional">
                    <div className="sorting">
                        <p>Sorting by Country Name: </p>
                        {
                            sortingTypes.map(sort => {
                                return (
                                    <div className="sort-method" key={sort.title} onClick={() => setSortType(sort.key)}>
                                        <div className="sort-choice">
                                            {sortType === sort.key && <div className="sort-choice-dot"></div>}
                                        </div>
                                        <p>{sort.title}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="searching">
                        <p>Fuzzy Search: </p>
                        <div className="searching-container" style={{alignItems: showLine ? "flex-start" : "flex-end"}}>
                            <input type="text" placeholder="Search by Country Name" value={search} onChange={handleSearchCountryName} onFocus={() => setShowLine(true)} onBlur={() => setShowLine(false)} />
                            <div className="input-line" style={{width: showLine ? "100%" : ""}}></div>
                        </div>
                    </div>
                </div>
                {(searchResults.length <= 0) && <div className="no-search-result">
                    <p>We couldn't find a country name for <span>"{search.length > 30 ? search.slice(0, 30) + "..." : search}"</span><br/>Make sure the country name is spelled and formatted correctly</p>
                </div>}
                <div className="container">
                    {
                        searchResults.map((country, index) => {
                            return (
                                <div className="country-container" key={country.countryName}>
                                    {index === 0 && <div className="country-container-titles">
                                        {
                                            country.titles.map(title => {
                                                return (
                                                    <div className="country-container-title" key={title}>
                                                        <h1>{title}</h1>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>}
                                    <div className="country-container-infos" style={{background: index % 2 === 0 ? "#eeeeee" : ""}}>
                                        <div className="country-container-content">
                                            <p>{index + 1}.</p>
                                        </div>
                                        <div className="country-container-content">
                                            <img src={country.flags} alt={country.countryName} />
                                        </div>
                                        <div className="country-container-content">
                                            <p id="hover-country-name" onClick={() => {
                                                setCountryInfos(country);
                                                setShowCountryInfos(true);
                                            }}>{country.countryName || "?"}</p>
                                        </div>
                                        <div className="country-container-content">
                                            <p>{country.cca2 || "?"}</p>
                                        </div>
                                        <div className="country-container-content">
                                            <p>{country.cca3 || "?"}</p>
                                        </div>
                                        <div className="country-container-content">
                                            <p>{getNativeCountryName(country.nativeCountryName)[0] || "?"} <span>{getNativeCountryName(country.nativeCountryName)?.length > 1 ? `+${getNativeCountryName(country.nativeCountryName)?.length - 1}` : ""}</span></p>
                                        </div>
                                        <div className="country-container-content">
                                            <p>{country.alternativeCountryName[0] || "?"} <span>{country.alternativeCountryName.length > 1 ? `+${country.alternativeCountryName.length - 1}` : ""}</span></p>
                                        </div>
                                        <div className="country-container-content">
                                            <p>{getCountryCallingCodes(country.countryCallingCodes.root, country.countryCallingCodes.suffixes)?.length > 0 && getCountryCallingCodes(country.countryCallingCodes.root, country.countryCallingCodes.suffixes)[0] || "?"} <span>{getCountryCallingCodes(country.countryCallingCodes.root, country.countryCallingCodes.suffixes)?.length > 1 ? `+${getCountryCallingCodes(country.countryCallingCodes.root, country.countryCallingCodes.suffixes)?.length - 1}` : ""}</span></p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {searchResults.length > 0 && <div className="pagination">
                    <button id="prev-and-next" onClick={() => setStartPage(startPage - 1)} style={{background: startPage <= 1 ? "gray" : "", cursor: startPage <= 1 ? "no-drop" : ""}} disabled={startPage <= 1}>Prev</button>
                    {
                        new Array(totalPages).fill(null)?.map((data, index) => {
                            return <button style={{background: index + 1 === startPage ? STYLE : "", color: index + 1 === startPage ? "#ffffff" : ""}} key={index} onClick={() => setStartPage(index + 1)}>{index + 1}</button>
                        })
                    }
                    <button id="prev-and-next" onClick={() => setStartPage(startPage + 1)} style={{background: startPage >= totalPages ? "gray" : "", cursor: startPage >= totalPages ? "no-drop" : ""}} disabled={startPage >= totalPages}>Next</button>
                </div>}
            </main>}
            <Footer title={"Made by Mr. Sok Pagnavath."} />
        </>
    )
}
export default App;