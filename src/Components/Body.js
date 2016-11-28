import React from 'react';
import Map from "./Map"
import OrgUnitInfo from "./OrgUnitInfo"
import Paper from 'material-ui/Paper';
import MapInfo from "./MapInfo"
import Search from "./Search";



export default class Body extends React.Component {
    constructor() {
        super();

        this.state = {
            id: "ImspTQPwCqd",
            makeNew: false,
            makeNewCoords: undefined,
            reload: false,
        };
    }
    updateId(id, reload){
        if(reload != undefined){
            this.setState({
                id: id,
                reload: reload,
            });
        }else{
            this.setState({
                id: id,
                reload: false,
            });
        }

    }

    setNewCoords(lat, lng){
        var string = "["+lng+","+lat+"]";
        this.setState({
            makeNewCoords: string,
        });
    }
    setMakeNew(bool){
        this.setState({
            makeNew: bool,
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
            <div>
                <Search updateId={this.updateId.bind(this)}/>

                <div style={styleDiv.root}>
                    <Paper style={{width: "20%"}} zDepth={3}>
                        <MapInfo updateId={this.updateId.bind(this)} id={this.state.id}/>
                    </Paper>
                    <Paper zDepth={3} style={{margin: "0px 5px", height: 520, width: "53%"}}>
                        <Map updateId={this.updateId.bind(this)} id={this.state.id} makeNew={this.state.makeNew} reload={this.state.reload} setNewCoords={this.setNewCoords.bind(this)}/>
                    </Paper>
                    <Paper style={{width: "25%"}} zDepth={3}>
                        <OrgUnitInfo id={this.state.id} makeNew={this.setMakeNew.bind(this)} makeNewCoords={this.state.makeNewCoords} updateId={this.updateId.bind(this)}/>
                    </Paper>
                </div>

            </div>
        );
    };

}
