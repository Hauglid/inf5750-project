import React, { Component } from 'react';
import { saveOrganisationUnit, loadOrganisationUnits, deleteOrganisationUnit } from '../api';

import Map from './Map';
import Search from './Search';

export default class App extends Component {
    render() {
        return(
            <div>
                <Search/>
                <Map />
            </div>

        );
    }
}