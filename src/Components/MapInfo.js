import React from 'react';

export default class MapInfo extends React.Component {

    constructor() {
        super();

        this.state = {
            loaded: false,

            unitInfo: [{
                name: "name",
                id: "id",
            }]
        };
        this.lvlOne = this.lvlOne.bind(this);
        this.lvlTwo = this.lvlTwo.bind(this);
    }

    componentDidMount() {
        //this.lvlOne();
        this.lvlTwo();
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
            loadLvlOne().then((lvlOne => {
                console.log(lvlOne.name);
            }))
        });
    }

    lvlTwo(){
        loadLvlTwo().then(function(response){
          console.log(response[3].name);
            loadLvlTwo().then(function(response){
                console.log(response[3].id);
            });
        })
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
