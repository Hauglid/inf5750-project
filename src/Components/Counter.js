import React from 'react';
import RaisedButton from "material-ui/RaisedButton";
/**
 * A counter button: tap the button to increase the count.
 */
export default class Counter extends React.Component {
    constructor() {
        super();
        this.state = {
            count: 0,
        };
        this.increaseCounter = this.increaseCounter.bind(this);
    }

    increaseCounter() {
        this.setState({count: this.state.count + 1});
    }

    render() {
        return (
            <div>
                <RaisedButton  primary="true" labelPosition="before" label="primary"/>

                <RaisedButton secondary="true" labelPosition="before" label="secondary"/>

                <RaisedButton  labelPosition="before" label={this.state.count} onClick={this.increaseCounter} >
                </RaisedButton>
            </div>
        );
    }
}
