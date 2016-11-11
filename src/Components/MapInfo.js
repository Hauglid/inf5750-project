import React from 'react';
import {loadUnitInfoLvl} from '../api';
import {loadLvlOne, loaded} from './ApiLoader';

export default class MapInfo extends React.Component {

    constructor() {
        super();

        this.state = {
            loaded: false,

            unitInfo: [{
                name: "vag",
            }]
        };
        this.lvlOne = this.lvlOne.bind(this);
    }

    componentDidMount() {
        this.lvlOne();
    }


    lvlOne(){
        loadLvlOne().then((lvlOne) => {
        const newUnit = [
            ...this.state.unitInfo,
            {name: lvlOne.name },
        ];
            this.setState({
                unitInfo: newUnit,
            });
        });
    }

    render(){
        return(
            <div>
                <h2>hello</h2>
                <h2>{this.state.unitInfo[this.state.unitInfo.length -1].name}</h2>
            </div>
        )
    }
}
