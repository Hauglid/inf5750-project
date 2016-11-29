import React from 'react';
import AppBar from 'material-ui/AppBar';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';


export default class Header extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div>
                <AppBar
                    iconElementLeft={
                        <IconButton href="/" >
                            <img  style={{width:65, height:17}} src="logo_banner.png"/>
                        </IconButton>}

                    title=""
                />

            </div>

        )
    };

}

