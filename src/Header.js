import React from 'react';
import AppBar from 'material-ui/AppBar';
import Search from "./Search";

export default class Header extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <AppBar
                title="Title"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                iconElementRight={<Search/>}

            />
        )
    };

}

