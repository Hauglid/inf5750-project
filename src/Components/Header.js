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
            <div>

                <AppBar
                    title="React Web App with material-ui"
                />
                <Search/>

            </div>

        )
    };

}

