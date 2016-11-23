import React from 'react';
import {saveOrganisationUnit, loadUnitInfo} from '../api';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class OrgUnitInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSaving: false,
            unitInfo: [],
            editing: false,
        };

        this.editButton = this.editButton.bind(this);
        this.saveButton = this.saveButton.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.newUnit = this.newUnit.bind(this);
        this.saveUnit = this.saveUnit.bind(this);
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
        console.log("Loading unit info...");
        loadUnitInfo(id).then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
                originalUnitInfo: organisationUnit,
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
        this.setState({
            editing: true,
            unitInfo: {
                displayName: "",
                openingDate: "",
                coordinates: "",
                id: ""
            }}
            //, function() {console.log(this.state.unitInfo);}
        );

    }

    editButton() {
        console.log("Edit");
        this.setState({
            editing: true,
            oldUnitInfo: this.state.unitInfo,
        }
        //, function() {console.log(this.state.oldUnitInfo);}
        );

    }

    cancelButton() {
        console.log("Cancel");
        this.loadUnitInfo(this.props.id);

        this.setState({
            editing: false,
        }
        //, function() {console.log(this.state.unitInfo)}
        );

    }

    saveButton() {
        console.log("Save");
        this.setState({editing: false});
        console.log(this.isValid());
        this.saveUnit(this.state.unitInfo);

    }

    saveUnit(unit) {
        console.log(unit);
        saveOrganisationUnit(unit)
            .catch(() => alert("Could not save unit"));
    }

    //returns false if valid, true if not
    isValid() {
        return !(
          this.state.unitInfo["displayName"] &&
          this.state.unitInfo["openingDate"] &&
          this.state.unitInfo["coordinates"]
        );
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.id != this.state.id){
            this.setState({
                id: nextProps.id,
            }, function (){
                this.loadUnitInfo(this.state.id);
            });
        }
    }

    saveTester() {
        console.log("saveTester");

        var a = {
                    parent:{
                        "id":"QywkxFudXrC"
                    },
                    openingDate: this.state.unitInfo["openingDate"],
                    name: this.state.unitInfo["displayName"],
                    shortName: this.state.unitInfo["displayName"],
                    coordinates: this.state.unitInfo["coordinates"]
                };

        this.saveUnit(a);
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
                    onClick={this.state.editing ? this.saveButton : this.newUnit}
                    disabled={this.state.editing ? this.isValid() : false }/>
                <br/>
                <div>
                    <TextField
                        disabled={!this.state.editing}
                        floatingLabelFixed={true}
                        underlineShow={this.state.editing}
                        floatingLabelText="Name"
                        onChange={this.handleChange.bind(this, "displayName")}
                        value={this.state.unitInfo["displayName"]} />
                    <br/>
                    <TextField
                        disabled={!this.state.editing}
                        floatingLabelFixed={true}
                        onChange={this.handleChange.bind(this, "openingDate")}
                        underlineShow={this.state.editing}
                        floatingLabelText="Opening date"
                        value={this.state.unitInfo["openingDate"]} />
                    <br/>
                    <TextField
                        disabled={!this.state.editing}
                        floatingLabelFixed={true}
                        onChange={this.handleChange.bind(this, "coordinates")}
                        underlineShow={this.state.editing}
                        floatingLabelText="Coordinates"
                        value={this.state.unitInfo["coordinates"]} />
                    <br/>
                    <TextField
                        disabled={!this.state.editing}
                        floatingLabelFixed={true}
                        onChange={this.handleChange.bind(this, "id")}
                        underlineShow={this.state.editing}
                        floatingLabelText="ID"
                        value={this.state.unitInfo["id"]} />
                    <br/>
                    <RaisedButton
                        label={"tester"}
                        onClick={this.saveTester.bind(this)}
                        primary={this.state.editing ? false : true}/>

                </div>
            </div>
        )
    }
}