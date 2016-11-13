import React, {PropTypes}  from 'react';
import {loadAllUnits} from '../api';
import {loadLvlOne, loaded} from './ApiLoader';
import {List, ListItem} from 'material-ui/List';

export default class MapInfo extends React.Component {

    constructor() {
        super();

        this.state = {
            loaded: false,

            unitInfo: [{
                name: "vag",
                id: 0,
            }]
        };
        this.lvlOne = this.lvlOne.bind(this);
        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    load() {

        const response = loadAllUnits();
        response.then((unit) => {
            var result = unit.map(function (a) {
                return {
                    name: a.displayName,
                    id: a.id
                }
            });
            this.setState({
                unitInfo: result,
            });

        })
    }


    lvlOne() {
        loadLvlOne().then((lvlOne) => {
                const newUnit = lvlOne.map(function (id, name) {
                    return {name: name, id: id}
                });
                this.setState({
                    unitInfo: newUnit,
                }, function () {
                    console.log(newUnit)
                });
            }
        )
        ;
    }


    render() {
        return (
            <List style={{height: 500, overflowY: "scroll"}}>
                <h2>Henter bare 50 forste</h2>
                {this.state.unitInfo.map(function (item) {
                    return (
                        <ListItem
                            key={item.id}
                            value={item.id}
                            primaryText={item.name}
                        />
                    )

                })}

            </List>
        );
    }
}
