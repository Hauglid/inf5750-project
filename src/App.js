import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Counter from './Components/Counter';
import Header from "./Components/Header";


export default class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider /*{ muiTheme={getMuiTheme(darkBaseTheme)}}*/>
                <div >
                    <Header/>
                    <Counter/>

                </div>

            </MuiThemeProvider>

        );
    }
}