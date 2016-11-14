import React from 'react';
import {searchBy} from '../api';
import {List, ListItem} from 'material-ui/List';

export default class MapInfo extends React.Component {

    constructor(props) {
        super();

        this.state = {
            unitInfo: [],
            id: props.id,
        };
        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load();
    }
    componentWillReceiveProps(nextProps){
        console.log("calling dr. strange love "+nextProps.id);
        if(nextProps.id != this.state.id){
            this.setState({
                id: nextProps.id,
            }, function (){
                this.load();
            });
        }
    }

    load() {

        const response = searchBy("parent.id", this.state.id);
        console.log("this props id "+ this.state.id);
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
