import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';

import Counter from './Components/Counter';
import Header from "./Components/Header";
import Body from "./Components/Body"
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        disabledColor: cyan500,
    },
});

export default class App extends React.Component {


    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div >
                    <Header/>
                    <Counter/>
                    <Body/>
                </div>

            </MuiThemeProvider>

        );
    }
}
