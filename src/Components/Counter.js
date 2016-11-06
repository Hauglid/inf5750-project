import React from 'react';
import RaisedButton from "material-ui/RaisedButton";
/**
 * A counter button: tap the button to increase the count.
 */
class Counter extends React.Component {
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
                <RaisedButton onClick={this.increaseCounter} >
                    Count: {this.state.count}
                </RaisedButton>
            </div>
        );
    }
}
export default Counter;