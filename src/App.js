import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {darkBlack} from 'material-ui/styles/colors';

import Header from "./Components/Header";
import Body from "./Components/Body"
import injectTapEventPlugin from 'react-tap-event-plugin';

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
                    <Header/>
                    <Body/>
                </div>

            </MuiThemeProvider>

        );
    }
}
