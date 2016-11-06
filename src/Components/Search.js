import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

export default class ToolbarExamplesSimple extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 3,
        };
    }


    render() {
        return (
            <Toolbar>
                <TextField fullWidth="true" hintText="Enter search query here"/>

                <ToolbarGroup lastChild={true}>
                    <ToolbarSeparator />
                    <RaisedButton label="Search" primary={true}/>

                </ToolbarGroup>
            </Toolbar>
        );
    }
}