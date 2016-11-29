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

    /**
     * Loads information if unit id is updated
     * Loads coordinates if map is clicked
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.id != this.state.id) {
            this.setState({
                id: nextProps.id,
            }, function () {
                this.loadUnitInfo(this.state.id);
            });
        }

        if (nextProps.makeNewCoords != this.state.unitInfo["coordinates"]) {
            this.setState({
                newCoordinates: nextProps.makeNewCoords
            })
        }
    }

    // loads the information about an organisation unit
    /**
     * Fetches the information about the unit from the api
     * @param id of unit to fetch
     */
    loadUnitInfo(id) {
        //console.log("Loading unit info...");
        loadUnitInfo(id).then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
                level: organisationUnit["level"]
            }, this.getDistrict);
        });
    }

    /**
     * Changes the value of a text field
     * @param category of value to be changed
     * @param event keystrokes
     */
    handleChange(category, event) {
        if (this.state.editing) {
            var info = this.state.unitInfo;
            info[category] = event.target.value;
            this.setState({
                unitInfo: info,
            });
        }
    };

    /**
     * Creates a blank UnitInfo, ready to receive information
     */
    newUnit() {
        //console.log("New");
        this.props.makeNew(true);

        this.setState({
                editing: true,
                new: true,
                unitInfo: {
                    displayName: "",
                    openingDate: "",
                }
            }
        );
    }

    /**
     * Makes it possible to edit the text fields
     */
    editButton() {
        console.log("Edit");
        this.props.makeNew(true);
        this.setState({
            editing: true,
        });
    }

    /**
     * Resets/loads the unit information
     */
    cancelButton() {
        //console.log("Cancel");
        this.props.makeNew(false);
        this.loadUnitInfo(this.props.id);

        this.setState({
            editing: false,
            new: false,
            newCoordinates: ""
        });

    }

    /**
     * Saves a new unit if it is new, updates the current one if it's not new.
     * Checks of there are any new coordinates.
     */
    saveButton() {
        //console.log("Save");
        this.props.makeNew(false);
        this.setState({
            editing: false,
            new: false,
        });

        if (this.state.new) {
            // creates an new object based on the current state and saves it to the DHIS server
            var newUnit = {
                parent: {
                    "id": this.state.districtId
                },
                openingDate: this.state.unitInfo["openingDate"],
                name: this.state.unitInfo["displayName"],
                shortName: this.state.unitInfo["displayName"],
                coordinates: this.state.newCoordinates
            };
            this.saveUnit(newUnit);
        } else {
            var coords = this.state.newCoordinates;

            //checks if the map has been clicked/new coordinates has been set
            if (coords == undefined) {
                coords = this.state.unitInfo["coordinates"];
            }

            // creates a new object based on the current state and sends it to the DHIS server to update its values
            var updatedUnit = {
                parent: {
                    "id": this.state.districtId
                },
                id: this.state.unitInfo["id"],
                openingDate: this.state.unitInfo["openingDate"],
                name: this.state.unitInfo["displayName"],
                shortName: this.state.unitInfo["displayName"],
                coordinates: coords
            };
            this.updateUnit(updatedUnit);
        }
    }

    /**
     * Passes the created object on to the api, and reloads the map
     * @param unit to be saved
     */
    saveUnit(unit) {
        saveOrganisationUnit(unit)
            .then(response => {
                this.props.updateId(response["response"]["uid"]);
            })
            .catch(() => alert("Could not save unit"));

    }

    /**
     * Passes the created object on to the api, and reloads the map
     * @param unit to be updated
     */
    updateUnit(unit) {
        //console.log("updating unit");
        updateOrganisationUnit(unit)
            .then(() => {
                this.props.updateId(unit.id, true);
            })
            .catch((error) => console.log(error));
    }

    /**
     * Checks of the required fields has a value
     * @returns {boolean} false if all fields have value, true if not
     */
    isInvalid() {
        return !(
            this.state.unitInfo["displayName"] &&
            this.state.unitInfo["openingDate"] &&
            this.state.districtId
        );
    }

    /**
     * Updates the district field if the level is 3 or 4.
     */
    getDistrict() {
        //console.log("getDistrict");
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

    /**
     * Keeps track of if the cancel/edit-button should be disabled
     * @returns {boolean}
     */
    cancelEditButtonDisabled() {
        if (this.state.new) {
            return false;
        }
        if (this.state.level != 4) {
            return true;
        }
    }

    /**
     * Keeps track of if the new/save-button should be disabled
     * @returns {boolean}
     */
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
                    disabled={this.newSaveButtonDisabled() ? true : this.isInvalid() }/>
                <br/>
                <div>
                    <TextField
                        floatingLabelFixed={true}
                        underlineShow={this.state.editing}
                        floatingLabelText="Name"
                        onChange={this.handleChange.bind(this, "displayName")}
                        value={this.state.unitInfo["displayName"]}/>
                    <br/>
                    <TextField
                        floatingLabelFixed={true}
                        onChange={this.handleChange.bind(this, "openingDate")}
                        underlineShow={this.state.editing}
                        floatingLabelText="Opening date"
                        value={this.state.unitInfo["openingDate"]}/>
                    <br/>
                    <TextField
                        floatingLabelFixed={true}
                        floatingLabelText="District"
                        value={this.state.level > 2 ? this.state.districtName : ""}/>
                    <br/>
                </div>
            </div>
        )
    }
}