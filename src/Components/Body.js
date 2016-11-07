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
                    lat:59.911491,
                    lng:10.757933
                }
            },
            {
                location:{
                    lat:59.90694,
                    lng:10.75361
                }
            }
        ]

        return (
            <div style={{width:600, height:300}}>
                <Map center={location} markers={markers}/>
                <OrgUnitInfo />

            </div>

        )
    };

}
