//THIS FILE IS NOT IN USE... maybe later

var lvlOne = {
    name: "name",
    id: "id",
};

var lvlTwo = [];

var lvlOneLoaded = false;
var lvlTwoLoaded = false;

export function loadLvlOne(){
    return new Promise(function (resolve, reject) {
        if (lvlOneLoaded == false) {
            loadUnitInfoLvl(1).then((metadata => {
                var arr = metadata["organisationUnits"];
                lvlOne.id = arr[0]["id"];
                lvlOne.name = arr[0]["displayName"];
                console.log("loaded from API");
                lvlOneLoaded = true;
                resolve(lvlOne);
            }));
        }else{
            console.log("loaded from memory");
            resolve(lvlOne);
        }
    //potential error message
    //reject(Error("shit..."));
    });
}

export function loadLvlTwo(){
    return new Promise(function (resolve, reject) {
        if (lvlTwoLoaded == false) {
            loadUnitInfoLvl(2).then((metadata => {
                var arr = metadata["organisationUnits"];

                for(var i = 0; i < arr.length; i++) {
                    lvlTwo.push({
                        name: arr[i]["displayName"],
                        id: arr[i]["id"],
                    });
                }

                lvlTwoLoaded = true;
                resolve(lvlTwo);
            }));
        }else{
            console.log("loaded lvlTwo from memory");
            resolve(lvlTwo);
        }
        //potential error message
        //reject(Error("shit..."));
    });
}
