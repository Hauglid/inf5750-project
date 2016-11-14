import React from 'react';
import Map from "./Map"
import OrgUnitInfo from "./OrgUnitInfo"
import Paper from 'material-ui/Paper';
import MapInfo from "./MapInfo"


export default class Body extends React.Component {

    render() {
        const styleDiv = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            },
        };

        return (
            <div style={styleDiv.root}>
                <Paper style={{width:"20%"}} zDepth={3} >
                    <MapInfo />
                </Paper>
                <Paper  zDepth={3} style={{margin:"0px 5px", padding: "10px", height: 500, width: "53%"}}>
                        <Map/>
                </Paper>
                <Paper style={{width:"25%"}}  zDepth={3} >
                    <OrgUnitInfo />
                </Paper>

            </div>
        );
    };

}
