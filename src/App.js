import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {darkBlack} from 'material-ui/styles/colors';

import Header from "./Components/Header";
import Body from "./Components/Body"
import injectTapEventPlugin from 'react-tap-event-plugin';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        disabledColor: darkBlack,
    },
});

export default class App extends React.Component {




    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div >
                    <HeaderBar />
                    <Header/>
                    <Body/>
                </div>

            </MuiThemeProvider>

        );
    }
}

