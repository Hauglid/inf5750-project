import React from 'react';
/**
 * A counter button: tap the button to increase the count.
 */
export class Container extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        const style = {
            width: "100vw",
            height: "100vh"
        }

        return (
            <div style={style}>
                <Map google={this.props.google}/>
            </div>
        )
    }
}

export default GoogleApiComponent({
    apiKey: __GAPI_KEY__
})(Container)
