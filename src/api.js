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

export function loadOrganisationUnits() {
    // Load the organisation units but only the first level and the do not use paging
    return fetch(`${serverUrl}/organisationUnits?paging=false&level=1`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json())
        // pick the organisationUnits property from the payload
        .then(({ organisationUnits }) => organisationUnits);
}

export function loadUnitInfo() {
    console.log("api.loadUnitInfo");
    return fetch(`${serverUrl}/organisationUnits/kbGqmM6ZWWV`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}
export function loadUnitInfoLvl2(level) {
    return fetch(`${serverUrl}/organisationUnits?level=2`, fetchOptions)
        .then(onlySuccessResponses)
        .then(response => response.json());
}