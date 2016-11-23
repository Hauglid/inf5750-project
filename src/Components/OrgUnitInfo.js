import React from 'react';
import {loadOrganisationUnits, saveOrganisationUnit, loadUnitInfo} from '../api';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class OrgUnitInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSaving: false,
            unitInfo: [],
            allUnits: [],
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
        this.loadAllUnits();
    }

    loadAllUnits() {
        // Loads the organisation units from the api and sets the loading state to false and puts the items onto the component state.
        loadOrganisationUnits(2)
            .then((organisationUnits) => {
                console.log(organisationUnits);
                this.setState({
                    isLoading: false,
                    allUnits: organisationUnits,
                });
            });
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
        if (this.state.editing) {
            var info = this.state.unitInfo;
            info[category] = event.target.value;
            this.setState({
                unitInfo: info,
            });
        }
    };

    newUnit() {
        console.log("New");
        this.setState({
            editing: true,
            new: true,
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

        if (this.state.new) {
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
          this.state.unitInfo["openingDate"]
          // this.state.unitInfo["coordinates"]
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

        const a = this.state.allUnits
            .map(item => {
                return (
                    <MenuItem key={item.id} value={item.id} primaryText={item.displayName}/>
                );
            });

        this.setState({
            allUnits: a
        });
        console.log(this.state.allUnits);
        console.log(a);
    }


    render() {

        return (
            <div>
                <TextField fullWidth={true} style={{fontSize: '20px', fontWeight: 'bold'}} value="Unit Information"/>
                <RaisedButton
                    label={this.state.editing ? "Cancel" : "Edit"}
                    onClick={this.state.editing ? this.cancelButton : this.editButton}
                    primary={!this.state.editing}/>
                <RaisedButton
                    label={this.state.editing ? "Save" : "New"}
                    primary={true}
                    onClick={this.state.editing ? this.saveButton : this.newUnit}
                    disabled={this.state.editing ? this.isValid() : false }/>
                <br/>
                <div>
                    <TextField
                        floatingLabelFixed={true}
                        underlineShow={this.state.editing}
                        floatingLabelText="Name"
                        onChange={this.handleChange.bind(this, "displayName")}
                        value={this.state.unitInfo["displayName"]} />
                    <br/>
                    <TextField
                        floatingLabelFixed={true}
                        onChange={this.handleChange.bind(this, "openingDate")}
                        underlineShow={this.state.editing}
                        floatingLabelText="Opening date"
                        value={this.state.unitInfo["openingDate"]} />
                    <br/>
                    <TextField
                        floatingLabelFixed={true}
                        onChange={this.handleChange.bind(this, "coordinates")}
                        underlineShow={this.state.editing}
                        floatingLabelText="Coordinates"
                        value={this.state.unitInfo["coordinates"]} />
                    <br/>
                    <TextField
                        floatingLabelFixed={true}
                        onChange={this.handleChange.bind(this, "id")}
                        underlineShow={this.state.editing}
                        floatingLabelText="ID"
                        value={this.state.unitInfo["id"]} />
                    <br/>
                    <SelectField
                        floatingLabelText="District"
                    >
                        {this.state.allUnits}
                    </SelectField>
                    <RaisedButton
                        label={"tester"}
                        onClick={this.saveTester.bind(this)}
                        primary={!this.state.editing}/>

                </div>
            </div>
        )
    }
}