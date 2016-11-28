import React from 'react';
import {withGoogleMap, GoogleMap, Marker, Polygon, Polyline} from "react-google-maps"
import {loadUnitInfo} from '../api'
import {getDistance, findCenter} from './Toolbox'
import Snackbar from 'material-ui/Snackbar';


const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        zoom={props.zooming}
        center={props.center}
        onClick={props.onMapClick}
        onRightClick ={props.onMapRightClick}
    >
        {props.markers.map(marker => (
            <Marker
            {...marker}
                onClick={() => props.onMarkerClick(marker)}
            />
        ))}

         {props.polygon.map(polygon => (
           <Polygon
           {...polygon}
                onClick={() => props.onPolyClick(polygon)}
                onRightClick = {() => props.onPolyRightClick(polygon)}
           />
        ))}

        {props.polyline.map(polyline => (
            <Polyline
                {...polyline}
            />
        ))}

    </GoogleMap>
));

var lvl = 0;
var key = 0;
var sierraBounds = undefined;
const icon = 'icon.png';
const greenIcon = 'icon_green.png';
const blueIcon = 'icon_blue.png';

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
            polyline: [{
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
            open: false,
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
        this.drawPolyLine = this.drawPolyLine.bind(this);
        this.handleMapRightClick = this.handleMapRightClick.bind(this);
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
        if(nextProps.makeNew == false && nextProps.makeNew != this.state.makeNew){
            this.setState({
                makeNew: false,
            });
            var arr = this.state.markers;
            if(arr[arr.length -1].id == undefined){
                arr.pop();
                this.setState({
                    markers: arr,
                });
            }
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
    setMarkers(districtId, blueId) {
        this.setState({
            open: false,
        });
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

                        if(currentId == blueId){
                            newMarkers.push({
                                position: {
                                    lat: parseFloat(coordinates[1]),
                                    lng: parseFloat(coordinates[0]),
                                },
                                icon: blueIcon,
                                key: key,
                                id: currentId,
                            });
                        }else {
                            newMarkers.push({
                                position: {
                                    lat: parseFloat(coordinates[1]),
                                    lng: parseFloat(coordinates[0]),
                                },
                                icon: icon,
                                key: key,
                                id: currentId,
                            });
                        }
                        key++;
                    }else {
                        if (blueId == currentId) {
                            this.setState({
                                open: true,
                            });
                        }
                    }
                    this.setState({
                        markers: newMarkers,
                    });
                }));
            }
        }));
    }

    drawPolyLine(districtId){
        var path = [];
        loadUnitInfo(districtId).then((organisationUnit => {
            var response = organisationUnit["coordinates"];

            this.updateBounds(response);

            response = response.split("[");
            for(var i = 0; i < response.length; i++) {

                if (response[i] != "") {
                    response[i] = response[i].replace("],", "");
                    response[i] = response[i].replace("]]]]", "");
                    response[i] = response[i].split(",");

                    var  newCord = {
                        lat: parseFloat(response[i][1]),
                        lng: parseFloat(response[i][0]),
                    };
                    path.push(newCord);
                }
            }
            this.setState({
                polyline: [{
                    strokeColor: "#000",
                    path: path,
                    key: key,
                    id: this.state.id,
                }],
            });
            key++;
        }));
    }

    handlePolyClick(polygon){
        if(polygon.id != undefined) {
            this.props.updateId(polygon.id);
        }
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
                    polyline: [],
                    markers: [],
                    id: districtId,
                    parentId: undefined,
                });
                this.drawDistrict(districtId);
            } else if(organisationUnit["level"] < 3){
                this.setState({
                    polygon: [],
                    markers: [],
                    polyline: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawDistrict(districtId);
            }else if(organisationUnit["level"] == 3){
                this.setState({
                    polygon: [],
                    markers: [],
                    polyline: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawPolyLine(districtId);
                this.setMarkers(districtId);
            }else{
                this.setState({
                    polygon: [],
                    markers: [],
                    polyline: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawPolyLine(organisationUnit["parent"]["id"]);
                this.setMarkers(organisationUnit["parent"]["id"], districtId);
            }
        }));
    }

    handleMapClick(event){
        if(this.state.makeNew == true){
            this.props.setNewCoords(event.latLng.lat(),event.latLng.lng());

            var arr = this.state.markers;
            for(var i = 0; i < arr.length; i++){
                if(arr[i].id == this.state.id){
                    arr.splice(i,1);
                }else if(arr[i].id == undefined){
                    arr.splice(i,1);
                }
            }
            arr.push({
                position: {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                },
                icon: greenIcon,
                key: key,
                id: undefined,
            });
            key++;

            this.setState({
                markers: arr,
            });
        }
    }
    handleMapRightClick(){
        if(this.state.parentId != undefined){
            this.props.updateId(this.state.parentId);
        }
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
                    onMapRightClick={this.handleMapRightClick}
                    markers={this.state.markers}
                    onMarkerClick={this.handleMarkerClick}
                    polygon = {this.state.polygon}
                    polyline = {this.state.polyline}
                    onPolyClick = {this.handlePolyClick}
                    onPolyRightClick = {this.handlePolyRightClick}
                    zooming = {this.state.zoom}
                    center = {this.state.center}

                />
                <Snackbar
                    open={this.state.open}
                    message="Coordinates not found"
                    autoHideDuration={4000}
                />
            </div>
        );
    }
}