import React from 'react';
import {searchBy, updateOrganisationUnit, saveOrganisationUnit, loadUnitInfo} from '../api';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class OrgUnitInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            unitInfo: [],
            editing: false,
        };

        this.editButton = this.editButton.bind(this);
        this.saveButton = this.saveButton.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.newUnit = this.newUnit.bind(this);
        this.saveUnit = this.saveUnit.bind(this);
        this.updateUnit = this.updateUnit.bind(this);
    }

    componentDidMount() {
        this.loadUnitInfo(this.props.id);
    }

    // loads the information about an organisation unit
    loadUnitInfo(id) {
        console.log("Loading unit info...");
        loadUnitInfo(id).then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
                level: organisationUnit["level"]
            }, this.getDistrict);
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
        this.props.makeNew(true);

        this.setState({
            editing: true,
            new: true,
                unitInfo: {
                    displayName: "",
                    openingDate: "",
                }
            }
            // , function() {console.log(this.state.unitInfo);}
        );
    }
    editButton() {
        console.log("Edit");
        this.setState({
            editing: true,
        }
        //, function() {console.log(this.state.oldUnitInfo);}
        );

    }

    cancelButton() {
        console.log("Cancel");
        this.props.makeNew(false);
        this.loadUnitInfo(this.props.id);

        this.setState({
            editing: false,
            new: false,
            newCoordinates: ""
        }
        //, function() {console.log(this.state.unitInfo)}
        );

    }

    saveButton() {
        console.log("Save");
        this.props.makeNew(false);
        this.setState({
            editing: false,
            new: false,
        });

        if (this.state.new) {
            var a = {
                parent:{
                    "id":this.state.districtId
                },
                openingDate: this.state.unitInfo["openingDate"],
                name: this.state.unitInfo["displayName"],
                shortName: this.state.unitInfo["displayName"],
                coordinates: this.state.newCoordinates
            };
            this.saveUnit(a);
        } else {
            var a = {
                id: this.state.unitInfo["id"],
                openingDate: this.state.unitInfo["openingDate"],
                name: this.state.unitInfo["displayName"],
                shortName: this.state.unitInfo["displayName"],
                //coordinates: this.state.unitInfo["coordinates"]
            };
            console.log(a);
            this.updateUnit(a);
        }
    }

    saveUnit(unit) {
        saveOrganisationUnit(unit)
            .catch(() => alert("Could not save unit"));
    }

    updateUnit(unit) {
        updateOrganisationUnit(unit)
            .catch(() => alert("Could not save unit"));
    }

    //returns false if valid, true if not
    isValid() {
        return !(
          this.state.unitInfo["displayName"] &&
          this.state.unitInfo["openingDate"] &&
          this.state.districtId
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

        if(nextProps.makeNewCoords != this.state.unitInfo["coordinates"]) {
            this.setState({
                newCoordinates: nextProps.makeNewCoords
            })
        }
    }

    saveTester() {
        console.log("saveTester");

        console.log(this.state.unitInfo);
        console.log(this.state.districtId);
        console.log(this.isValid());
        console.log(this.state);


    }

    getDistrict() {
        console.log("getDistrict");
        if (this.state.level == 3) {
            this.setState({
                    districtId: this.state.id,
                    districtName: this.state.unitInfo["displayName"]
            });
        } else if (this.state.level == 4) {
            searchBy("id", this.state.unitInfo["parent"]["id"])
                .then((unit) => {
                    this.setState({
                            districtName: unit[0]["displayName"],
                            districtId: unit[0]["id"]
                    });
                });
        }
    }

    cancelEditButtonDisabled() {
        if (this.state.new) {
            return false;
        }
        if (this.state.level != 4) {
            return true;
        }
    }

    newSaveButtonDisabled() {
        if (this.state.editing == true) {
            return false;
        }
        if (this.state.level != 3) {
            return true;
        }
    }

    render() {

        return (
            <div>
                <TextField fullWidth={true} style={{fontSize: '20px', fontWeight: 'bold'}} value="Unit Information"/>
                <RaisedButton
                    label={this.state.editing ? "Cancel" : "Edit"}
                    onClick={this.state.editing ? this.cancelButton : this.editButton}
                    primary={!this.state.editing}
                    disabled={this.cancelEditButtonDisabled()}/>
                <RaisedButton
                    label={this.state.editing ? "Save" : "New"}
                    primary={true}
                    onClick={this.state.editing ? this.saveButton : this.newUnit}
                    disabled={this.newSaveButtonDisabled() ? true : this.isValid() }/>
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
                        floatingLabelText="District"
                        value={this.state.level > 2 ? this.state.districtName : ""}/>
                    <br/>
                    <RaisedButton
                        label={"tester"}
                        onClick={this.saveTester.bind(this)}
                        primary={!this.state.editing}/>

                </div>
            </div>
        )
    }
}