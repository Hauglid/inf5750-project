import React from 'react';
import {loadOrganisationUnits, loadUnitInfo, searchByName} from '../api';
import TextFields from './TextFields';
import RaisedButton from 'material-ui/RaisedButton';

export default class OrgUnitInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            isSaving: false,
            isLoading: false,
            unitInfo: [],
            editing: false,
        };
        this.switchToEdit = this.switchToEdit.bind(this);
    }

    componentDidMount() {
        this.loadUnitInfo();
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
        });
    }

    switchToEdit() {
        this.setState({editing: true});
        console.log(searchByName("Kay"));
    }

    render() {

        return (
            <div>
                <TextFields fullWidth={true} style={{fontSize: '20px', fontWeight: 'bold'}} value="Organisational Unit Information"/>
                <RaisedButton label="Edit" primary={true} onClick={this.switchToEdit}/>
                <br/>
                <div>
                    <TextFields underLineShow={this.state.editing} category="Name" value={this.state.unitInfo["displayName"]} />
                    <br/>
                    <TextFields underLineShow={this.state.editing} category="Opening date" value={this.state.unitInfo["openingDate"]} />
                    <br/>
                    <TextFields underLineShow={this.state.editing} category="Coordinates" value={this.state.unitInfo["coordinates"]} />
                    <br/>
                    <TextFields underLineShow={this.state.editing} category="ID" value={this.state.unitInfo["id"]} />
                    <br/>
                    <TextFields hintText="Hint" value=""/>



                </div>
            </div>
        )
    }
}
