import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Counter from './Components/Counter';
import Header from "./Components/Header";


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