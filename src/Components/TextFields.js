import React from 'react';
import TextField from 'material-ui/TextField';

export default class TextFields extends React.Component {
    constructor(props) {
        super(props);


    }

    render() {
        return (
            <TextField
                floatingLabelText={this.props.category}
                underlineShow={this.props.underLineShow}
                value={this.props.value}
                style={this.props.style}
                fullWidth={this.props.fullWidth}
                disabled={this.props.disabled}
                defaultValue={this.props.defaultValue}
            />
        )
    }

}