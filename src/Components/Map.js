import React from 'react';
import {withGoogleMap, GoogleMap, Marker, Polygon} from "react-google-maps"
import {loadUnitInfo} from '../api'
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
                onClick={() => props.onMarkerClick(marker)}
            />
        ))}

         {props.poly.map(polygon => (
           <Polygon
           {...polygon}
                onClick={() => props.onPolyClick(event, polygon)}
                onRightClick = {() => props.onPolyRightClick(polygon)}
           />
        ))}

    </GoogleMap>
));

var lvl = 0;
var key = 0;
var sierraBounds = undefined;

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            polygon: [{
                strokeColor: "#000",
                path: [],
                key: 'key',
                id: 'id',
            }],
            zoom: undefined,
            center: {
                lat: 8.460555,
                lng:-11.779889,
            },
            id: 'id',
            parentId: undefined,
            makeNew: false,
        };
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.handlePolyClick = this.handlePolyClick.bind(this);
        this.drawDistrict = this.drawDistrict.bind(this);
        this.setMarkers = this.setMarkers.bind(this);
        this.updateMap = this.updateMap.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.returnSingleDistrict = this.returnSingleDistrict.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.updateBounds = this.updateBounds.bind(this);
        this.handlePolyRightClick = this.handlePolyRightClick.bind(this);
    }

    componentDidMount() {
        this.onLoad();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.id != this.state.id){
            this.updateMap(nextProps.id);
        }
        if(nextProps.makeNew == true && nextProps.makeNew != this.state.makeNew){
            this.setState({
                makeNew: true,
            });
        }

    }

    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            //console.log("helloooooo" +map.getZoom());
        }
    }

    onLoad(){
        //default is sierra Leone id
        this.drawDistrict("ImspTQPwCqd");
    }

    returnSingleDistrict(response,currentId, parent){
        var latLng = [];
        var last = null;
        var newPoly = [];
        response = response.split("[");
        //console.log(response);
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
                            parent: this.state.parentId,
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
        });
        key++;
        return newPoly;
    }

    //works for level 1,2,3
    drawDistrict(districtId){
        var poly = [];
        loadUnitInfo(districtId).then((organisationUnit => {
            var firstResponse = organisationUnit["children"];

            var bounds = organisationUnit["coordinates"];

            this.updateBounds(bounds);

            if(organisationUnit["level"] == 3){
                poly = this.returnSingleDistrict(organisationUnit["coordinates"]);
                this.setState({
                    polygon: poly,
                });
            }else {
                for (var j = 0; j < firstResponse.length; j++) {
                    const currentId = firstResponse[j]["id"];
                    loadUnitInfo(currentId).then((metadata => {
                        var response = metadata["coordinates"];

                        var newPoly = this.returnSingleDistrict(response, currentId);
                        //this should not be this hard......
                        for (var i = 0; i < newPoly.length; i++) {
                            poly.push(newPoly[i]);
                        }

                        lvl = metadata["level"];
                        this.setState({
                            polygon: poly,
                        });

                    }));
                }
            }
        }));
    }

    //works for lvl4
    setMarkers(districtId) {
        var key = 0;
        var newMarkers = [];
        loadUnitInfo(districtId).then((organisationUnit => {
            var firstResponse = organisationUnit["children"];

            if(organisationUnit["level"] == 4){
                if(organisationUnit["coordinates"] != undefined){
                    var coordinates = organisationUnit["coordinates"];
                    coordinates = coordinates.split(",");
                    coordinates = coordinates.map(function(a){
                        var ret = a.replace("[","");
                        ret = ret.replace("]","");
                        return ret;
                    });

                    this.setState({
                        markers: [{
                            position: {
                                lat: parseFloat(coordinates[1]),
                                lng: parseFloat(coordinates[0]),
                            },
                            key: key,
                            id: organisationUnit["id"],
                        }],
                    });
                }
            }
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
                    });
                }));
            }
        }));
    }

    handlePolyClick(event, polygon){
        if(polygon.id != undefined) {
            this.props.updateId(polygon.id);
        }
        if(this.state.makeNew == true){
            this.props.setMakeNew({
                lat: 10,
                lng: 10,
            });
        }
        console.log(event.latLng);
    }
    handlePolyRightClick(polygon){
        if(this.state.parentId != undefined){
            this.props.updateId(this.state.parentId);
        }
    }
    handleMarkerClick(marker){
        this.props.updateId(marker.id);
    }
    updateMap(districtId){
        loadUnitInfo(districtId).then((organisationUnit => {
            if(organisationUnit["level"] < 2){
                this.setState({
                    polygon: [],
                    markers: [],
                    id: districtId,
                    parentId: undefined,
                });
                this.drawDistrict(districtId);
            } else if(organisationUnit["level"] < 3){
                this.setState({
                    polygon: [],
                    markers: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawDistrict(districtId);
            }else if(organisationUnit["level"] == 3){
                this.setState({
                    polygon: [],
                    markers: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawDistrict(districtId);
                this.setMarkers(districtId);
            }else{
                this.setState({
                    polygon: [],
                    markers: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawDistrict(organisationUnit["parent"]["id"]);
                this.setMarkers(districtId);
            }
        }));
    }

    handleMapClick(event){
        console.log("map is clicked");
        //this.updateMap("ObV5AR1NECl");
    }

    updateBounds(response) {
        if (response != undefined) {
            var bounds = new google.maps.LatLngBounds();

            response = response.split("[");
            for (var i = 0; i < response.length; i++) {

                if (response[i] != "") {
                    response[i] = response[i].replace("],", "");
                    response[i] = response[i].replace("]]]]", "");
                    response[i] = response[i].split(",");

                    bounds.extend({
                        lat: parseFloat(response[i][1]),
                        lng: parseFloat(response[i][0]),
                    });
                }
            }
            const center = findCenter(bounds);
            this.setState({
                center: center,
            });
            this._mapComponent.fitBounds(bounds);
        }else{
            this.setState({
                zoom: 8,
                center: {
                    lat: 8.460555,
                    lng:-11.779889,
                },
            });

            if(sierraBounds == undefined){
                sierraBounds = this._mapComponent.getBounds();
            }

            this._mapComponent.fitBounds(sierraBounds);
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
                    onMarkerClick={this.handleMarkerClick}
                    poly = {this.state.polygon}
                    onPolyClick = {this.handlePolyClick}
                    onPolyRightClick = {this.handlePolyRightClick}
                    zooming = {this.state.zoom}
                    center = {this.state.center}

                />
            </div>
        );
    }
}