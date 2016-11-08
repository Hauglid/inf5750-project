import React from 'react';
import {loadOrganisationUnits, loadUnitInfo} from '../api';
import ListItems from './ListItems';

export default class OrgUnitInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            isSaving: false,
            isLoading: false,
            unitInfo: [],
        };
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
        loadUnitInfo().then((organisationUnit) => {
            this.setState({
                unitInfo: organisationUnit,
            });
        });
    }

    render() {

        return (
            <div>
                <h1>OrgUnitInfo</h1>
                <h3>{this.state.unitInfo["displayName"]}</h3>
                <ul>
                    <ListItems category="Name" value={this.state.unitInfo["displayName"]} />
                    <ListItems category="Opening date" value={this.state.unitInfo["openingDate"]} />
                    <ListItems category="Coordinates" value={this.state.unitInfo["coordinates"]}/>
                    <ListItems category="ID" value={this.state.unitInfo["id"]}/>
                </ul>
            </div>
        )
    }
}