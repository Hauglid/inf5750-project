import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker, Polygon} from "react-google-maps"

export default class Map extends React.Component {


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

        return (
            <GoogleMapLoader
                containerElement={mapContainer}
                googleMapElement={
                    <GoogleMap

                        defaultZoom={15}
                        defaultCenter={this.props.center}
                        options={{streetViewControl: false, mapTypeControl: false}}>
                        {markers}
                        <Polygon
                            strokeColor='#FF0000'
                            path = {this.props.poly}
                            fillColor = '#FF0000'
                            fillOpacity = '0.35'/>
                    </GoogleMap>
                }/>


        )
    }
}

