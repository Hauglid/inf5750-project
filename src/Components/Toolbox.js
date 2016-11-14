
export function getDistance(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
}

function rad (x) {
    return x * Math.PI / 180;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function findCenter(polygon){
    var x1 = 1000.0;
    var x2 = 0.0;
    var y1 = 0.0;
    var y2 = -1000.0;

    for(var i = 0; i < polygon.length; i++){
        if(polygon[i].lat < x1){
            x1 = polygon[i].lat;
        }
        if(polygon[i].lat > x2){
            x2 = polygon[i].lat;
        }
        if(polygon[i].lng < y1){
            y1 = polygon[i].lng;
        }
        if(polygon[i].lng > y2){
            y2 = polygon[i].lng;
        }
    }

    const center = {
        lat: x1+((x2-x1)/2),
        lng: y1+((y2-y1)/2),
    }
    return center;
}
export function removeEveryThingBut(array, keep){
    var ret = array;

    for(var i = ret.length-1; i>= 0; i--){

        if(ret[i].id != keep){
            ret.splice(i,1);
        }
    }
    return ret;
}