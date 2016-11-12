import React from 'react';
import Map from "./Map"
import OrgUnitInfo from "./OrgUnitInfo"
import MapInfo from "./MapInfo"


export default class Body extends React.Component {
    render() {
        
        const location = {
            lat:8.460555,
            lng:-11.779889
        };


        const markers =[

            {
                location:{
                    lat:8.460555,
                    lng:-11.779884
                }
            },
            {
                location:{
                    lat:8.361555,
                    lng:-11.779882
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
            <div style={{width:600, height:300}}>
                <Map center={location} markers={markers} poly={triangleCoords}/>
                <OrgUnitInfo />
            </div>

        )
    };

}
