import React from 'react';
import Map from "./MapComponent"

export default class Body extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <MapComponent/>
            </div>

        )
    };

}
