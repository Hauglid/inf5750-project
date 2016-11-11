import {loadUnitInfoLvl} from '../api';

var lvlOne = {
    name: "name",
    id: "id",
}

var loaded = false;

export function loadLvlOne(){

    return new Promise(function (resolve, reject) {
        console.log("called loading");

        if (loaded == false) {
            loadUnitInfoLvl(1).then((metadata => {
                var arr = metadata["organisationUnits"];
                lvlOne.id = arr[0]["id"];
                lvlOne.name = arr[0]["displayName"];
                console.log("here");
                loaded = true;
                resolve(lvlOne);
            }));
        }
    //potential error message
    //reject(Error("shit..."));
    });
}

/*
 loadUnitInfoLvl(2).then((metadata => {
 var arr = metadata["organisationUnits"];

 for(var i = 0; i < arr.length; i++){
 const newUnit = [
 ...this.state.unitInfo,
 {
 name: arr[i]["displayName"],
 },
 ];

 this.setState({
 unitInfo: newUnit,
 });
 }

 this.setState({
 loaded: true,
 });
 }));


 */