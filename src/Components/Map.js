import React from 'react';
/**
 * A counter button: tap the button to increase the count.
 */
export class Map extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        if(!this.props.loaded){
            return <div>Loading...</div>
        }

        return (
            <div>Map will go here</div>
        )
    }
}

export default GoogleApiComponent({
    apiKey: __GAPI_KEY__
})(Map)
