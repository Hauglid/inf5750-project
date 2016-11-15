import React from 'react';
import Map from "./Map"
import OrgUnitInfo from "./OrgUnitInfo"
import Paper from 'material-ui/Paper';
import MapInfo from "./MapInfo"



export default class Body extends React.Component {
    constructor() {
        super();

        this.state = {
            id: "ImspTQPwCqd",
        };
    }

    updateId(id){
        console.log(id);
        this.setState({
            id: id,
        }, function(){
            console.log(this.state.id);
        });
    }

    updateId(level){
        console.log(level);
        this.setState({
            level: level,
        }, function(){
            console.log(this.state.level);
        });
    }

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
                    <MapInfo updateId={this.updateId.bind(this)} id={this.state.id}/>
                </Paper>
                <Paper  zDepth={3} style={{margin:"0px 5px", padding: "10px", height: 500, width: "53%"}}>
                    <Map updateId={this.updateId.bind(this)} id={this.state.id}/>
                </Paper>
                <Paper style={{width:"25%"}}  zDepth={3} >
                    <OrgUnitInfo id={this.state.id} />
                </Paper>

            </div>
        );
    };

}
