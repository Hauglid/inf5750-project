import React from 'react';
import {withGoogleMap, GoogleMap, Marker, Polygon} from "react-google-maps"
import {loadUnitInfo, loadUnitInfoLvl} from '../api'
import {getDistance, findCenter, removeEveryThingBut} from './Toolbox'


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

var lvl = 0;


export default class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            markers: [],
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
        this.onLoad = this.onLoad.bind(this);
        this.handlePolyClick = this.handlePolyClick.bind(this);
        this.drawDistrict = this.drawDistrict.bind(this);
        this.setMarkers = this.setMarkers.bind(this);
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
                                        });
                                    lvl = metadata["level"];
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
                    });
                    lvl = metadata["level"];
                    key++;
                    this.setState({
                        polygon: newPoly,
                    });

                }));
            }
        }));
    }
    //works for lvl4
    setMarkers(districtId) {
        var key = 0;
        var newMarkers = [];
        loadUnitInfo(districtId).then((organisationUnit => {
            var firstResponse = organisationUnit["children"];

            for (var i = 0; i < firstResponse.length; i++) {
                const currentId = firstResponse[i]["id"];
                loadUnitInfo(currentId).then((metadata => {
                    var coordinates = metadata["coordinates"];
                    if(coordinates != undefined){
                        coordinates = coordinates.split(",");

                        coordinates = coordinates.map(function(a){
                            var ret = a.replace("[", "");
                            ret = ret.replace("]", "");
                            return ret;
                        });
                        newMarkers.push({
                            position: {
                                lat: parseFloat(coordinates[1]),
                                lng: parseFloat(coordinates[0]),
                            },
                            key: key,
                            id: currentId,
                        });
                        key++;
                    }
                    this.setState({
                        markers: newMarkers,
                    })
                }));
            }
        }));
    }

    handlePolyClick(polygon){
        const center = findCenter(polygon.path);

        if(lvl > 2){
            this.setState({
                polygon: removeEveryThingBut(this.state.polygon, polygon.id),
                center: center,
                zoom: this.state.zoom +1,
            });
            this.setMarkers(polygon.id);
        }else{
            this.setState({
                polygon: [],
                center: center,
                zoom: this.state.zoom +1,
            });
            this.drawDistrict(polygon.id);
        }
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