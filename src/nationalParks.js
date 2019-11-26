'use strict'

const apiKey = 'cwx547Vg4m2lw88mutLC2hUmE6WrbXkOMY7uNOjp';
const urlSearch = 'https://developer.nps.gov/api/v1/parks';


function displayResults(responseJson) {
    $('#results-list').empty();

    for(const item of responseJson.data) {

        //get physical addresss
        let address = '';
        for(const prop of item.addresses){
            if(prop.type == "Physical") {
                address = 
                `<div>
                    <a href="${item.directionsUrl}" target="_blank">${prop.line1}</a>
                    <br>
                    ${prop.city}, ${prop.stateCode}, ${prop.postalCode}
                </div>`;
            }
        }

        //load info in search results
        $('#results-list').append(
            `<li>
            <h3>${item.fullName}</h3>
            <p>${item.description}</p>
            <a href="${item.url}" target="_blank">${item.fullName}</a>
            <p><address>${address}</address></p>
            </li>`);
    }

    $('#results').removeClass('hidden');
}

function generateQuerystring(params) {
    let queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

    const result = queryItems.join('&');
    //console.log(result);
    return result;
}

function getNationalParks(query, maxResults = 10) {

    const options = new Headers({'X-Api-Key': apiKey});

    const params = {
        'stateCode': query,
        'limit': maxResults, 
        'api_key': apiKey, 
        'fields': 'addresses, contacts'
    };
    const queryString = generateQuerystring(params);
    const url = urlSearch + '?' + queryString;

    //console.log(url);

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                //console.log(response);
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => {
            displayResults(responseJson);
            //console.log(JSON.stringify(responseJson));
        })
        .catch(error => {
            const errorMessage = `Error: ${error.message}`;
            console.log(errorMessage);
            $('#js-error-message').text(errorMessage);
        });
}


function formListener() {
    $('form').submit(event => {
        event.preventDefault();
        const query = $('#state-search').val();
        const maxResults = $('#js-max-results').val();

        console.log(`query: ${query}`);

        $('#js-error-message').removeClass('hidden');
        if(query === '') {
            $('#results').addClass('hidden');
            $('#js-error-message').text('A State must be selected');
        }
        else {
            $('#js-error-message').addClass('hidden');
        
            getNationalParks(query, maxResults);
        }
    });
}


$(formListener);