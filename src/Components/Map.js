import React from 'react';
import {withGoogleMap, GoogleMap, Marker, Polygon} from "react-google-maps"
import {loadUnitInfo, loadUnitInfoLvl} from '../api'
import {getDistance, findCenter} from './Toolbox'


const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        zoom={props.zooming}
        center={props.center}
        onClick={props.onMapClick}
    >
        {props.markers.map(marker => (
            <Marker
                {...marker}
                onRightClick={() => props.onMarkerRightClick(marker)}
            />
        ))}

         {props.poly.map(polygon => (
           <Polygon
           {...polygon}
               onClick={() => props.onPolyClick(polygon)}
           />
        ))}

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
            polygon: [{
                strokeColor: "#000",
                path: [],
                key: 'key',
                id: 'id',
            }],
            zoom: 7,
            center: {
                lat: 8.460555,
                lng:-11.779889,
            },
        };
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.handlePolyClick = this.handlePolyClick.bind(this);
    }

    componentDidMount() {
        this.onLoad();
    }

    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            //console.log(map.getZoom());
        }
    }

    onLoad(){
        //default is sierra Leone id
        this.drawDistrict("ImspTQPwCqd")
    }
    //works for level 1,2,3
    drawDistrict(districtId){
        var key = 0;
        loadUnitInfo(districtId).then((organisationUnit => {
            var firstResponse = organisationUnit["children"];
            var newPoly = [];
            for(var j = 0; j < firstResponse.length; j++){
                const currentId = firstResponse[j]["id"];
                loadUnitInfo(currentId).then((metadata => {
                    var response = metadata["coordinates"];
                    response = response.split("[");

                    var latLng = [];

                    var last = null;

                    for(var i = 0; i < response.length; i++){

                        if(response[i] != ""){
                            response[i] = response[i].replace("],", "");
                            response[i] = response[i].replace("]]]]", "");
                            response[i] = response[i].split(",");

                            var  newCord = {
                                lat: parseFloat(response[i][1]),
                                lng: parseFloat(response[i][0]),
                            };

                            if(last != null){
                                //this is used to draw better shapes.. Not perfect, but better
                                if(getDistance(last, newCord) > 10000){
                                    newPoly.push({
                                            strokeColor: "#000",
                                            path: latLng,
                                            key: key,
                                            id: currentId,
                                            level: metadata["level"],
                                        });

                                    latLng = [];
                                    key++;
                                }else{
                                    latLng.push(newCord);
                                }
                            }else{
                                latLng.push(newCord);
                            }

                            last = newCord;
                        }
                    }
                    newPoly.push({
                        strokeColor: "#000",
                        path: latLng,
                        key: key,
                        id: currentId,
                        level: metadata["level"],
                    });
                    key++;
                    this.setState({
                        polygon: newPoly,
                    });

                }));
            }
        }));
    }

    handlePolyClick(polygon){

        const center = findCenter(polygon.path);
        this.setState({
            polygon: [],
            center: center,
            zoom: this.state.zoom +1,
        });

        if(polygon.level > 2){
            //do something here
        }else{
            this.drawDistrict(polygon.id);
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
            zoom: this.state.zoom +1,
        });
    }

    handleMarkerRightClick(targetMarker) {

        const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
        this.setState({
            markers: nextMarkers,
        });
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
                    poly = {this.state.polygon}
                    onPolyClick = {this.handlePolyClick}
                    zooming = {this.state.zoom}
                    center = {this.state.center}

                />
            </div>
        );
    }
}