/**
 * `serverUrl` contains the api location of the server. You would generally get the baseUrl from the manifest.webapp
 * as described here http://dhis2.github.io/dhis2-docs/master/en/developer/html/apps_creating_apps.html
 *
 * `basicAuth` contains the username and password to send with the request as the basic authentication token. This is only needed when you develop locally and need CORS support (https://developer.mozilla.org/en-US/docs/Web/HTTP).
 * You obviously should not do this for your production apps.
 */
// const serverUrl = 'http://localhost:8080/dhis/api';
const serverUrl = 'https://play.dhis2.org/dev/api';
const basicAuth = `Basic ${btoa('admin:district')}`;

/**
 * Default options object to send along with each request
 */
const fetchOptions = {
    method: 'GET',
    headers: {
        Authorization: basicAuth,
        'Content-Type': 'application/json',
    },
};

/**
 * `fetch` will not reject the promise on the a http request that is not 2xx, as those requests could also return valid responses.
 * We will only treat status codes in the 200 range as successful and reject the other responses.
 */
function onlySuccessResponses(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    return Promise.reject(response);
}

export function loadOrganisationUnits(level) {
    // Load the organisation units but only the first level and the do not use paging
    return fetch(`${serverUrl}/organisationUnits?paging=false&level=${level}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json())
        // pick the organisationUnits property from the payload
        .then(({ organisationUnits }) => organisationUnits);
}

export function loadAllUnits(){
    console.log("api.loadAllUnits");
    return fetch(`${serverUrl}/organisationUnits`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json())
        .then(({organisationUnits}) => organisationUnits);

}

export function loadUnitInfo(unitId) {
    return fetch(`${serverUrl}/organisationUnits/${unitId}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}

export function searchBy(filter, value) {
    console.log("api.searchBy");
    return fetch(`${serverUrl}/organisationUnits/?paging=false&filter=${filter}:^ilike:${value}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json())
        .then(({organisationUnits}) => organisationUnits);
}

export function loadUnitInfoLvl(level) {
    return fetch(`${serverUrl}/organisationUnits?level=${level}&paging=false`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}
//example of fields: fields=id,name,level
export function loadUnitInfoLvlAndfields(level, fields){
    return fetch(`${serverUrl}/organisationUnits?level=${level}&paging=false&fields=${fields}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}

export function saveOrganisationUnit(organisationUnit) {
    // POST the payload to the server to save the organisationUnit
    return fetch(`${serverUrl}/organisationUnits`, Object.assign({}, fetchOptions, { method: 'POST', body: JSON.stringify(organisationUnit) }))
        .then(onlySuccessResponses)
        // Parse the json response
        .then(response => response.json())
        // Log any errors to the console. (Should probably do some better error handling);
        .catch(error => console.error(error));
}