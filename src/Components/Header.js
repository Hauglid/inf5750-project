import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';


export default class Header extends React.Component {

    render() {
        return (
            <div>
                <AppBar
                    title=""
                    iconElementLeft={
                        <IconButton href="/">
                            <img style={{width: 65, height: 17}} src="logo_banner.png"/>
                        </IconButton>}
                />

            </div>

        )
    };

}

