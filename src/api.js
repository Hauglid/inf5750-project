/**
 * This file is heavily inspired (read: copied and edited) by the api.js file in the
 * DHIS2 organisation-unit-app-inf5750 project (https://github.com/dhis2/organisation-unit-app-inf5750)
 */
/**
 * `serverUrl` contains the api location of the server. You would generally get the baseUrl from the manifest.webapp
 * as described here http://dhis2.github.io/dhis2-docs/master/en/developer/html/apps_creating_apps.html
 *
 * `basicAuth` contains the username and password to send with the request as the basic authentication token. This is only needed when you develop locally and need CORS support (https://developer.mozilla.org/en-US/docs/Web/HTTP).
 * You obviously should not do this for your production apps.
 */
//const serverUrl = 'http://localhost:8080/dhis/api';
//const serverUrl = 'https://play.dhis2.org/test/api'; // we are getting some weird behaviour when using this, so we're sticking to dev
const serverUrl = 'https://play.dhis2.org/demo/api';
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

//not used, but left here in case of future need
export function loadOrganisationUnits(level) {
    // Load the organisation units but only the first level and the do not use paging
    return fetch(`${serverUrl}/organisationUnits?paging=false&level=${level}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json())
        // pick the organisationUnits property from the payload
        .then(({organisationUnits}) => organisationUnits);
}

//not used, but left here in case of future need
export function loadAllUnits() {
    return fetch(`${serverUrl}/organisationUnits`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json())
        .then(({organisationUnits}) => organisationUnits);

}

/**
 * Fetches information about unit with given id
 * @param unitId
 * @returns {Promise.<TResult>} response from server
 */
export function loadUnitInfo(unitId) {
    return fetch(`${serverUrl}/organisationUnits/${unitId}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}

/**
 * Fetches information from the server, based on given filter and value.
 * @param filter what to filter base on
 * @param value "search term"
 * @returns {Promise.<TResult>} response from server
 */
export function searchBy(filter, value) {
    return fetch(`${serverUrl}/organisationUnits/?paging=false&filter=${filter}:%5Eilike:${value}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json())
        .then(({organisationUnits}) => organisationUnits);
}

//not used, but left here in case of future need
export function loadUnitInfoLvl(level) {
    return fetch(`${serverUrl}/organisationUnits?level=${level}&paging=false`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}

//not used, but left here in case of future need
export function loadUnitInfoLvlAndfields(level, fields) {
    //example of fields: fields=id,name,level
    return fetch(`${serverUrl}/organisationUnits?level=${level}&paging=false&fields=${fields}`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}

/**
 * Saves the given unit to the DHIS2 server
 * @param organisationUnit unit to be saved
 * @returns {Promise.<TResult>} response from server
 */
export function saveOrganisationUnit(organisationUnit) {
    // POST the payload to the server to save the organisationUnit
    return fetch(`${serverUrl}/organisationUnits`, Object.assign({}, fetchOptions, {
        method: 'POST',
        body: JSON.stringify(organisationUnit)
    }))
        .then(onlySuccessResponses)
        // Parse the json response
        .then(response => response.json())
        .catch(error => console.error(error));
}

/**
 * Updates the unit with new values
 * @param organisationUnit unit to be changed, with new values
 * @returns {Promise.<TResult>} response from server
 */
export function updateOrganisationUnit(organisationUnit) {
    // POST the payload to the server to save the organisationUnit
    return fetch(`${serverUrl}/organisationUnits/${organisationUnit.id}`, Object.assign({}, fetchOptions, {
        method: 'PUT',
        body: JSON.stringify(organisationUnit)
    }))
        .then(onlySuccessResponses)
        // Parse the json response
        .then(response => response.json())
        // Log any errors to the console. (Should probably do some better error handling);
        .catch(error => console.error(error));
}