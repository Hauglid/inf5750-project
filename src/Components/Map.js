import React from 'react';
import {withGoogleMap, GoogleMap, Marker, Polygon, Polyline} from "react-google-maps"
import {loadUnitInfo} from '../api'
import {getDistance, findCenter} from './Toolbox'
import Snackbar from 'material-ui/Snackbar';

/**
 * Defines map and components.
 * Based on tomchentw/react-google-maps @ github
 * Recives props from class Map - render()
 */
const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        zoom={props.zooming}
        center={props.center}
        onClick={props.onMapClick}
        onRightClick={props.onMapRightClick}
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
                onRightClick={() => props.onPolyRightClick(polygon)}
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

/**
 * the map class. Uses react components
 */
export default class Map extends React.Component {
    /**
     * Constructor initializes state and has bind-statements
     * @param props: receives props id, updateId, makeNew and makeNewCoords
     */
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
                lng: -11.779889,
            },
            id: 'id',
            parentId: undefined,
            makeNew: false,
            open: false,
            reload: false,
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

    /**
     * called when the component mount. Calling onLoad() to start loading of the first district
     */
    componentDidMount() {
        this.onLoad();
    }

    /**
     * Called when the component receives props or props is updated
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        //if ID is updated
        if (nextProps.id != this.state.id) {
            this.updateMap(nextProps.id);
        }

        //if reload is updated and true the map reloads current id
        if (this.state.reload != nextProps.reload) {
            this.setState({
                reload: nextProps.reload,
            });

            if (nextProps.reload == true) {
                this.updateMap(this.state.id);
                this.props.updateId(this.state.id, false);
            } else if (!nextProps.reload) {
                this.setState({
                    reload: nextProps.reload,
                });
            }
        }
        //if makeNew is updated and true the map creates a new marker on click and updates state in body accordingly
        if (nextProps.makeNew == true && nextProps.makeNew != this.state.makeNew) {
            this.setState({
                makeNew: true,
            });
        }
        //if make new is updated and false the map removes markes set in that process and sets state.
        if (nextProps.makeNew == false && nextProps.makeNew != this.state.makeNew) {
            this.setState({
                makeNew: false,
            });
            var arr = this.state.markers;
            if (arr[arr.length - 1].id == undefined) {
                arr.pop();
                this.setState({
                    markers: arr,
                });
            }
        }

    }

    /**
     * sets the value of this._mapComponent to map. The value is used later
     * @param map: loaded map
     */
    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
        }
    }

    /**
     * when the map is loaded we draw the district of sierraLeone
     */
    onLoad() {
        //default is sierra Leone id
        this.drawDistrict("ImspTQPwCqd");
    }

    /**
     * Returns a single district in the form of an array of polygons. The method does some string modification and creates a path object which is added to a polygon
     * @param response: the response from the API with the coordinates to a district
     * @param currentId: the current ID
     * @returns {Array}
     */
    returnSingleDistrict(response, currentId) {
        var latLng = [];
        var last = null;
        var newPoly = [];
        response = response.split("[");
        //console.log(response);
        for (var i = 0; i < response.length; i++) {

            if (response[i] != "") {
                response[i] = response[i].replace("],", "");
                response[i] = response[i].replace("]]]]", "");
                response[i] = response[i].split(",");

                var newCord = {
                    lat: parseFloat(response[i][1]),
                    lng: parseFloat(response[i][0]),
                };

                if (last != null) {
                    //this is used to draw better shapes.. Not perfect, but better
                    if (getDistance(last, newCord) > 10000) {
                        newPoly.push({
                            strokeColor: "#000",
                            path: latLng,
                            key: key,
                            id: currentId,
                            parent: this.state.parentId,
                        });
                        latLng = [];
                        key++;
                    } else {
                        latLng.push(newCord);
                    }
                } else {
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

    /**
     * Responsible for drawing the districts. Creates a polygon for all children to the given districtId id by the use of returnSingleDistrict()
     * @param districtId: The district of which to draw the children's polygon
     */
    drawDistrict(districtId) {
        var poly = [];
        loadUnitInfo(districtId).then((organisationUnit => {
            var firstResponse = organisationUnit["children"];

            var bounds = organisationUnit["coordinates"];

            this.updateBounds(bounds);

            if (organisationUnit["level"] == 3) {
                poly = this.returnSingleDistrict(organisationUnit["coordinates"]);
                this.setState({
                    polygon: poly,
                });
            } else {
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
    /**
     * Places markers on map works for lvl 3 only (only district of which children have coordinates for markers).
     * @param districtId: District of which children should be marked on map
     * @param blueId: ID to mark as blue
     */
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
                    if (coordinates != undefined) {

                        coordinates = coordinates.split(",");

                        coordinates = coordinates.map(function (a) {
                            var ret = a.replace("[", "");
                            ret = ret.replace("]", "");
                            return ret;
                        });

                        if (currentId == blueId) {
                            newMarkers.push({
                                position: {
                                    lat: parseFloat(coordinates[1]),
                                    lng: parseFloat(coordinates[0]),
                                },
                                icon: blueIcon,
                                key: key,
                                id: currentId,
                            });
                        } else {
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
                    } else {
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

    /**
     * draws district with polylines. Creates the coordinates of the district passed to it as a line.
     * @param districtId: The district to draw.
     */
    drawPolyLine(districtId) {
        var path = [];
        loadUnitInfo(districtId).then((organisationUnit => {
            var response = organisationUnit["coordinates"];

            this.updateBounds(response);

            response = response.split("[");
            for (var i = 0; i < response.length; i++) {

                if (response[i] != "") {
                    response[i] = response[i].replace("],", "");
                    response[i] = response[i].replace("]]]]", "");
                    response[i] = response[i].split(",");

                    var newCord = {
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

    /**
     * Handles click on polygon. Updates id in body via method
     * @param polygon: Polygon that is clicked
     */
    handlePolyClick(polygon) {
        if (polygon.id != undefined) {
            this.props.updateId(polygon.id);
        }
    }

    /**
     * Handle right click. Right click takes us to the parent district
     * @param polygon
     */
    handlePolyRightClick(polygon) {
        if (this.state.parentId != undefined) {
            this.props.updateId(this.state.parentId);
        }
    }

    /**
     * handles click on marker. Updates ID in body via method
     * @param marker
     */
    handleMarkerClick(marker) {
        this.props.updateId(marker.id);
    }

    /**
     * Runs every time the id in body is updated. Handles different scenarios
     * @param districtId: ID of the district updated to
     */
    updateMap(districtId) {
        loadUnitInfo(districtId).then((organisationUnit => {
            if (organisationUnit["level"] < 2) {
                this.setState({
                    polygon: [],
                    polyline: [],
                    markers: [],
                    id: districtId,
                    parentId: undefined,
                });
                this.drawDistrict(districtId);
            } else if (organisationUnit["level"] < 3) {
                this.setState({
                    polygon: [],
                    markers: [],
                    polyline: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawDistrict(districtId);
            } else if (organisationUnit["level"] == 3) {
                this.setState({
                    polygon: [],
                    markers: [],
                    polyline: [],
                    id: districtId,
                    parentId: organisationUnit["parent"]["id"],
                });
                this.drawPolyLine(districtId);
                this.setMarkers(districtId);
            } else {
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

    /**
     * Handles click on map. If the state makeNew equals true, a marker is placed on the map.
     * @param event: the click event
     */
    handleMapClick(event) {
        if (this.state.makeNew == true) {
            this.props.setNewCoords(event.latLng.lat(), event.latLng.lng());

            var arr = this.state.markers;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == this.state.id) {
                    arr.splice(i, 1);
                } else if (arr[i].id == undefined) {
                    arr.splice(i, 1);
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

    /**
     * Handles right click on map. Updates id in body to parent id via method.
     */
    handleMapRightClick() {
        if (this.state.parentId != undefined) {
            this.props.updateId(this.state.parentId);
        }
    }

    /**
     * Updates the bounds of the map. Uses the coordinates of the polygon.
     * Because Sierra leone does not have bounds, we store the bounds when the component mounts, and use these as SierraBounds
     * uses map.fitBounds zooming.
     * @param response
     */
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
        } else {
            this.setState({
                zoom: 8,
                center: {
                    lat: 8.460555,
                    lng: -11.779889,
                },
            });

            if (sierraBounds == undefined) {
                sierraBounds = this._mapComponent.getBounds();
            }

            this._mapComponent.fitBounds(sierraBounds);
        }
    }

    /**
     * render the component
     * @returns {XML}
     */
    render() {
        return (
            <div style={{height: `100%`}}>
                <GettingStartedGoogleMap
                    containerElement={
                        <div style={{height: `100%`}}/>
                    }
                    mapElement={
                        <div style={{height: `100%`}}/>
                    }
                    onMapLoad={this.handleMapLoad}
                    onMapClick={this.handleMapClick}
                    onMapRightClick={this.handleMapRightClick}
                    markers={this.state.markers}
                    onMarkerClick={this.handleMarkerClick}
                    polygon={this.state.polygon}
                    polyline={this.state.polyline}
                    onPolyClick={this.handlePolyClick}
                    onPolyRightClick={this.handlePolyRightClick}
                    zooming={this.state.zoom}
                    center={this.state.center}

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