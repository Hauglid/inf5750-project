import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps"

export default class Map extends React.Component {

        /*
        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        */

    render() {
        const mapContainer = <div style={{height: '100%', width: '100%'}}/>

        const markers = this.props.markers.map((venue, i) => {
            const marker = {
                position: {
                    lat: venue.location.lat,
                    lng: venue.location.lng
                }
            }
            return <Marker key={i} {...marker}/>
        })

        const triangleCoords = [
            {lat: 25.774, lng: -80.190},
            {lat: 18.466, lng: -66.118},
            {lat: 32.321, lng: -64.757},
            {lat: 25.774, lng: -80.190}
        ];


        return (
            <GoogleMapLoader
                containerElement={mapContainer}
                googleMapElement={
                    <GoogleMap
                        ref = {map}
                        defaultZoom={7}
                        defaultCenter={this.props.center}
                        options={{streetViewControl: false, mapTypeControl: false}}>
                        {markers}

                        /*
                        <Polygon
                            strokeColor = '#FF0000'
                            path = {triangleCoords} />
                        */
                    </GoogleMap>
                }/>
        )
    }
}

