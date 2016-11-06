import React from 'react';
import MapComponent from "./MapComponent"
import OrgUnitInfo from "./OrgUnitInfo"

export default class Body extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <MapComponent />
                <OrgUnitInfo />
            </div>

        )
    };

}
