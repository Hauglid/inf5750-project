import React from 'react';
import {updateOrganisationUnit, loadOrganisationUnits, saveOrganisationUnit, loadUnitInfo} from '../api';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class OrgUnitInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            unitInfo: [],
            allUnits: [],
            editing: false,
        };

        this.editButton = this.editButton.bind(this);
        this.saveButton = this.saveButton.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.newUnit = this.newUnit.bind(this);
        this.saveUnit = this.saveUnit.bind(this);
        this.updateUnit = this.updateUnit.bind(this);
    }

    componentDidMount() {
        this.getDistricts();
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
                district: organisationUnit["parent"]["id"]
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
        this.props.makeNew(true);
        this.setState({
            editing: true,
            new: true,
            unitInfo: {
                displayName: "1",
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
        }
        //, function() {console.log(this.state.unitInfo)}
        );

    }

    saveButton() {
        console.log("Save");
        this.props.makeNew(false);
        this.setState({editing: false});

        if (this.state.new) {
            var a = {
                parent:{
                    "id":this.state.district
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
          this.state.district
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
                unitInfo: {
                    coordinates: nextProps.makeNewCoords
                }
            })
        }
    }

    saveTester() {
        console.log("saveTester");
        //console.log(this.state.district);
        //console.log(this.state.unitInfo["parent"]["id"]);
        //console.log(this.state.unitInfo["level"]);

        var a = {
            id: "nq7F0t1Pz6t",
            openingDate: "1970-01-01T00:00:00.000",
            name: "Arab Clinic",
            shortName: "Arab Clinic",
            coordinates: "[-13.221,8.4832]"
        };
        this.updateUnit(a);



    }

    handleSelectChange(event, index, district) {
        this.setState({district: district});
    }

    getDistricts() {
        console.log("getDistricts");
        var districts = [];
        loadOrganisationUnits(3)
            .then((organisationUnits) => {
                districts = organisationUnits
                    .map(item => {
                        return (
                            <MenuItem key={item.id} value={item.id} primaryText={item.displayName}/>
                        );
                    });
            })
            .then(() => {
                this.setState({
                    allUnits: districts,
                });

            });
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
                        onChange={this.handleSelectChange.bind(this)}
                        value={this.state.district}
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