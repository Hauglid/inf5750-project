import React from 'react';
import TextField from 'material-ui/TextField';
import pink500 from "material-ui/styles/colors";

export default class Search extends React.Component {
    render() {
        return (
            <div>
                {/*gives white, must be bug*/}
                <TextField floatingLabelText="Enter search here" />
            </div>

        );
    }
}