import React from 'react';
import {withGoogleMap, GoogleMap, Marker, Polygon} from "react-google-maps"

const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={props.zooming}
        defaultCenter={{ lat: 8.460555, lng:-11.779889 }}
        onClick={props.onMapClick}
    >
        {props.markers.map(marker => (
            <Marker
                {...marker}
                onRightClick={() => props.onMarkerRightClick(marker)}
            />
        ))}

        /*
        {props.poly.map(polygon => (
            <Polygon
                {...polygon}
            />
        ))}
        */
    </GoogleMap>
));

export default class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            markers: [{
                position: {
                    lat: 25.0112183,
                    lng: 121.52067570000001,
                },
                key: `Taiwan`,
                defaultAnimation: 2,
            }],
            //polygon: [],
            zoom: 7,
        };
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
        this.poly = this.poly.bind(this);
    }

    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            console.log(map.getZoom());
        }
    }

    handleMapClick(event) {

        const nextMarkers = [
            ...this.state.markers,
            {
                position: event.latLng,
                defaultAnimation: 2,
                key: Date.now(),
            },
        ];
        this.setState({
            markers: nextMarkers,
            zoom: 5,
        });


        if (nextMarkers.length === 3) {
            this.props.toast(
            );
        }
    }

    handleMarkerRightClick(targetMarker) {
        const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
        this.setState({
            markers: nextMarkers,
        });
    }

    poly(){

    }

    render() {
        return (
            <div style={{height: `100%`}}>
                <GettingStartedGoogleMap
                    containerElement={
                        <div style={{ height: `100%` }} />
                    }
                    mapElement={
                        <div style={{ height: `100%` }} />
                    }
                    onMapLoad={this.handleMapLoad}
                    onMapClick={this.handleMapClick}
                    markers={this.state.markers}
                    onMarkerRightClick={this.handleMarkerRightClick}
                    zooming = {this.state.zoom}
                />
            </div>
        );
    }
}