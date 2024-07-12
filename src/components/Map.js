import {GoogleMap, Marker} from "@react-google-maps/api";

const Map = (props) => {
    const center = {
        lat: Number(props.lat),
        lng: Number(props.lng)
    }
    const containerStyle = {
        width: "100%",
        height: "500px",
    }
    return (
            <div className="map-container">
                {props.isLoaded && <GoogleMap 
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                >
                    <Marker position={center} />
                </GoogleMap>}
            </div>
    );
}
export default Map;