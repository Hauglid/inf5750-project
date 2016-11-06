import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Counter from './Counter';
import Header from "./Header";


export default class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <Header/>
                    <Counter/>

                </div>

            </MuiThemeProvider>

        );
    }
}