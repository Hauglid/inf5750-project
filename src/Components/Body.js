import React from 'react';
import Map from "./Map"
import OrgUnitInfo from "./OrgUnitInfo"
export default class Body extends React.Component {


    render() {
        
        const location = {
            lat:25.774,
            lng:-80.190
        };


        const markers =[

            {
                location:{
                    lat:25.774,
                    lng:-80.190
                }
            },
            {
                location:{
                    lat:59.90694,
                    lng:10.75361
                }
            }

        ]

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
