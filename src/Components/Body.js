import React from 'react';
import Map from "./Map"

export default class Body extends React.Component {


    render() {
        
        const location = {
            lat:59.911491,
            lng:10.757933
        };

        return (
            <div style={{width:600, height:300}}>
                <Map center={location}/>
            </div>

        )
    };

}
