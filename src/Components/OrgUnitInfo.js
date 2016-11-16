import React from 'react';
import {loadOrganisationUnits, loadUnitInfo, searchBy} from '../api';
import TextFields from './TextFields';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class OrgUnitInfo extends React.Component {
    constructor(props) {
        super(props);

        console.log("troll");

        this.state = {
            isSaving: false,
            isLoading: false,
            unitInfo: [],
            editing: false,
            items: [],
            id: "",
        };
        this.editButton = this.editButton.bind(this);
        this.saveButton = this.saveButton.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.newUnit = this.newUnit.bind(this);
    }

    componentDidMount() {
        this.loadUnitInfo(this.props.id);
    }

    //
    // loadInfo() {
    //     console.log("loading");
    //     loadOrganisationUnits().then((organisationUnits) => {
    //         this.setState({
    //             items:organisationUnits,
    //         });
    //     });
    // }

    // loads the information about an organisation unit
    loadUnitInfo(id) {
        console.log("Loading unit info..." + id);
        loadUnitInfo(id).then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
            });
        });
    }


    handleChange(category, event) {
        var info = this.state.unitInfo;
        info[category] = event.target.value;
        this.setState({
            unitInfo: info,
        });
    };

    newUnit() {
        console.log("New");
        // console.log(this.state.oldUnitInfo);
        this.setState({
            editing: true,
            oldUnitInfo: this.state.unitInfo}/*, function() {console.log(this.state.oldUnitInfo)}*/);
        this.setState({
            unitInfo: {
                displayName: "",
                openingDate: "",
                coordinates: "",
                id: "",
            }}, function() {console.log(this.state.unitInfo)
        });
    }

    editButton() {
        this.setState({
            editing: true,
            oldUnitInfo: this.state.unitInfo
        }, function() {
            console.log(this.state.oldUnitInfo);
        });
        console.log("Edit");
        // this.setState({
        //     unitInfo: {
        //         displayName: "",
        //         openingDate: "",
        //         coordinates: "",
        //         id: "",
        //     }}, function() {console.log(this.state.unitInfo)
        // });
    }

    cancelButton() {
        console.log("Cancel");
        console.log(this.state.oldUnitInfo);
        this.setState({
            editing: false,
            unitInfo: this.state.oldUnitInfo
        }, function() {console.log(this.state.unitInfo)});

    }

    saveButton() {
        console.log("Save");
        this.setState({editing: false});
    }


    render() {

        return (
            <div>
                <TextField fullWidth={true} style={{fontSize: '20px', fontWeight: 'bold'}} value="Unit Information"/>
                <RaisedButton
                    label={this.state.editing ? "Cancel" : "Edit"}
                    onClick={this.state.editing ? this.cancelButton : this.editButton}
                    primary={this.state.editing ? false : true}/>
                <RaisedButton
                    label={this.state.editing ? "Save" : "New"}
                    primary={true}
                    onClick={this.state.editing ? this.saveButton : this.newUnit}/>
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