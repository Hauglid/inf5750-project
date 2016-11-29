import React from 'react';
import {searchBy, loadUnitInfo} from '../api';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class MapInfo extends React.Component {

    constructor(props) {
        super();

        this.state = {
            unitInfo: [],
            id: props.id,
            nameParent: "",

        };
        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    /**
     * Check the current id with the new id, updates only if changes has been made.
     * @param nextProps contains the next id
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.id != this.state.id) {
            this.setState({
                id: nextProps.id,
            }, function () {
                this.load();
            });
        }
    }

    /**
     * Loads and set the name of current facility
     * and the "children"
     */
    load() {
        // set name
        loadUnitInfo(this.state.id)
            .then(({name}) => name)
            .then((name) => {
                this.setState({
                    name: name,
                });
            });

        // get list
        const response = searchBy("parent.id", this.state.id);
        response.then((unit) => {
            var result = unit.map(function (a) {
                return {
                    name: a.displayName,
                    id: a.id
                }
            });
            if (result.length > 0) {
                this.setState({
                    unitInfo: result,
                });

            }

        })
    }

    render() {

        return (
            <div style={{height: 500}}>
                <h2 style={{height: "8%"}}>{this.state.name}</h2>
                <Divider/>
                <List style={{height: "85%", overflowY: "scroll"}}>
                    {this.state.unitInfo.map(function (item) {
                        return (
                            <ListItem
                                key={item.id}
                                value={item.id}
                                primaryText={item.name}
                                onTouchTap={() => this.props.updateId(item.id)}
                            />
                        )

                    }, this)}

                </List>
            </div>
        );
    }
}
