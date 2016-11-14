import React from 'react';
import {loadUnitInfoLvl} from '../api';
import {List, ListItem} from 'material-ui/List';

export default class MapInfo extends React.Component {

    constructor() {
        super();

        this.state = {
            unitInfo: []
        };
        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    load() {

        const response = loadUnitInfoLvl(this.props.level).then(({organisationUnits}) => organisationUnits);
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
