/**
 * Created by Krister on 07-Nov-16.
 */
import React from 'react';

export default class ListItems extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li>{this.props.category}: {this.props.value}</li>
        );
    }
}