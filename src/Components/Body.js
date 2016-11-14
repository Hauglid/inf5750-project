import React from 'react';
import Map from "./Map"
import OrgUnitInfo from "./OrgUnitInfo"
import MapInfo from "./MapInfo"
import Paper from 'material-ui/Paper';


export default class Body extends React.Component {

    render() {
        const styleDiv = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            },
        };

        const location = {
            lat: 8.460555,
            lng: -11.779889
        };

        const markers = [

            {
                location: {
                    lat: 8.460555,
                    lng: -11.779884
                }
            },
            {
                location: {
                    lat: 8.361555,
                    lng: -11.779882
                }
            }

        ];

        const triangleCoords = [
            {lat: 25.774, lng: -80.190},
            {lat: 18.466, lng: -66.118},
            {lat: 32.321, lng: -64.757},
            {lat: 25.774, lng: -80.190}
        ];

        return (
            <div style={styleDiv.root}>
                <Paper style={{width:"20%"}} zDepth={3} >
                    <MapInfo/>

                </Paper>
                <Paper  zDepth={3} style={{margin:"0px 5px", padding: "10px", height: 500, width: "53%"}}>
                        <Map center={location} markers={markers} poly={triangleCoords}/>
                </Paper>
                <Paper style={{width:"25%"}}  zDepth={3} >
                    <OrgUnitInfo />
                </Paper>

            </div>
        );
    };

}
