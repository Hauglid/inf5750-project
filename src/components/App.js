import React, { Component } from 'react';
import { saveOrganisationUnit, loadOrganisationUnits, deleteOrganisationUnit } from '../api';
import List from './List';
import Form from './Form';
import Map from './Map';

export default class App extends Component {
    render() {
        return(
            <Map />
        );
    }
}