import React from 'react';
import {loadOrganisationUnits, loadUnitInfo, searchBy} from '../api';
import TextFields from './TextFields';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class OrgUnitInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            isSaving: false,
            isLoading: false,
            unitInfo: [],
            editing: false,
            items: [],
        };
        this.switchToEdit = this.switchToEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.loadUnitInfo();
        this.loadInfo();
    }


    loadInfo() {
        console.log("loading");
        loadOrganisationUnits().then((organisationUnits) => {
            this.setState({
                items:organisationUnits,
            });
        });
    }

    // loads the information about an organisation unit
    //currently loads the same every time, should tak an id as parameter
    loadUnitInfo() {
        console.log("Loading unit info...");
        loadUnitInfo("eoYV2p74eVz").then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
            });
        })
            .then(() => {
                this.setState({
                    displayName: this.state.unitInfo["displayName"],
                    openingDate: this.state.unitInfo["openingDate"],
                    coordinates: this.state.unitInfo["coordinates"],
                    id: this.state.unitInfo["id"],
                })
            });
    }

    switchToEdit() {
        this.setState({editing: !this.state.editing});
        console.log(this.state.items);
    }

    handleChange(cat, event) {
        var info = this.state.unitInfo;
        info[cat] = event.target.value;
        console.log(this.state.unitInfo[cat]);
        this.setState({
            unitInfo: info,
        });
    };

    render() {

        return (
            <div>
                <TextField fullWidth={true} style={{fontSize: '20px', fontWeight: 'bold'}} value="Organisational Unit Information"/>
                <RaisedButton label={this.state.editing ? "Cancel" : "Edit"} primary={true} onClick={this.switchToEdit}/>
                <br/>
                <div>
                    <TextField disabled={!this.state.editing} onChange={this.handleChange.bind(this, "displayName")} underlineShow={this.state.editing} floatingLabelText="Name" value={this.state.unitInfo["displayName"]} />
                    <br/>
                    <TextField disabled={!this.state.editing} onChange={this.handleChange.bind(this, "openingDate")} underlineShow={this.state.editing} floatingLabelText="Opening date" value={this.state.unitInfo["openingDate"]} />
                    <br/>
                    <TextField disabled={!this.state.editing} onChange={this.handleChange.bind(this, "coordinates")} underlineShow={this.state.editing} floatingLabelText="Coordinates" value={this.state.unitInfo["coordinates"]} />
                    <br/>
                    <TextField disabled={!this.state.editing} onChange={this.handleChange.bind(this, "id")} underlineShow={this.state.editing} floatingLabelText="ID" value={this.state.unitInfo["id"]} />
                    <br/>


                </div>
            </div>
        )
    }
}