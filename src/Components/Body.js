import React from 'react';
import Map from "./Map"
import OrgUnitInfo from "./OrgUnitInfo"
import Paper from 'material-ui/Paper';
import MapInfo from "./MapInfo"
import {loadUnitInfo} from '../api';



export default class Body extends React.Component {
    constructor() {
        super();

        this.state = {
            unitInfo: [],
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

    loadUnitInfo(id) {
        console.log("Loading unit info...");
        loadUnitInfo(id).then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
            });
        });
    }

    componentDidMount() {
        this.loadUnitInfo("eoYV2p74eVz");
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
                    <OrgUnitInfo unitInfo={this.state.unitInfo} />
                </Paper>

            </div>
        );
    };

}
