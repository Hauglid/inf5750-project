import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import {searchBy} from '../api';

export default class ToolbarExamplesSimple extends React.Component {

    constructor(props) {
        super(props);
        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.state = {
            dataSource: [],
            inputValue: '',
            inputId: ''

        }
    }

    onUpdateInput(inputValue) {
        const self = this;
        this.setState({
            inputValue: inputValue
        }, function () {
            self.performSearch();
        });
    }

    performSearch() {
        const self = this;

        if (this.state.inputValue !== '') {
            var response = searchBy("name", self.state.inputValue);
            response.then((organisationUnit) => {
                if(organisationUnit.length > 0){
                    var result = organisationUnit.map(function (a) {return a.displayName});
                    self.setState({
                        dataSource: result,
                        inputId: organisationUnit[0].id
                    });

                }

            })
        }
    }


    render() {
        return (
            <Toolbar>
                <AutoComplete
                    hintText="Search"
                    dataSource={this.state.dataSource}
                    onUpdateInput={this.onUpdateInput}
                    filter={AutoComplete.caseInsensitiveFilter}
                    fullWidth={true}
                    maxSearchResults={10}

                />
                <ToolbarGroup lastChild={true}>
                    <ToolbarSeparator />
                    <RaisedButton label="Search" primary={true}/>

                </ToolbarGroup>
            </Toolbar>
        );
    }
}