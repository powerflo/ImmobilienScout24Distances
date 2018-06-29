var destinations = ["Arnulfstr. 19, 80335 München", "Richard-Reitzner-Allee 1, 85540 Haar"];
var destinationsName = ["WTW", "eXXcellent"];
var page;

init();

function init() {
	// search for address on current page
	var addressBlock = document.getElementsByClassName("address-block")
	var resultListEntryAddress = document.getElementsByClassName("result-list-entry__address");

	var origins;
	
	if (addressBlock.length > 0) {
		origins = extractAddressesFromHTMLCollection(addressBlock);
		setIdInHTMLCollection(addressBlock);
		page = "expose";
	}
	else if (resultListEntryAddress.length > 0) {
		origins = extractAddressesFromHTMLCollection(resultListEntryAddress);
		setIdInHTMLCollection(resultListEntryAddress);
		page = "resultlist";
	}

	if (origins.length > 0) {
		// query distance for bicycling
		var xhrBike = new XMLHttpRequest();
		xhrBike.addEventListener("load", processRequestBike);
		xhrBike.open('GET', requestURL(origins, destinations, "bicycling"), true);
		xhrBike.send();

		// query distance for public distance
		var xhrTransit = new XMLHttpRequest();
		xhrTransit.addEventListener("load", processRequestTransit);
		xhrTransit.open('GET', requestURL(origins, destinations, "transit"), true);
		xhrTransit.send();
	}
}

function extractAddressesFromHTMLCollection(elements) {
	var origins = [];
	for (let i = 0; i < elements.length; ++i) {
		origins.push(elements[i].innerText);
	}
	return origins;
}

function setIdInHTMLCollection(elements) {
	for (let i = 0; i < elements.length; ++i) {
		elements[i].id = "origin" + i.toString();
	}
}

function processRequestBike() {
    var response = JSON.parse(this.responseText);	

	insertDistanceInDocument(response, "bicycling");
}

function processRequestTransit() {
    var response = JSON.parse(this.responseText);	

    // insert distances on page
	insertDistanceInDocument(response, "transit");
}

function insertDistanceInDocument(response, mode) {
	for (let i = 0; i < response.rows.length; ++i) {
		
		var originId = "origin" + i.toString();
		// loop through every destination
		for (let l = 0; l < response.rows[i].elements.length; ++l) {
			
			var destinationAddress = response.destination_addresses[l];
			var destinationName = destinationsName[l];
		    var distance = response.rows[i].elements[l].distance.text;
		    var duration = response.rows[i].elements[l].duration.text;

			var newDivDistance = document.createElement("span");
			newDivDistance.className = page + "-distance";
			var textNodeDistance = document.createTextNode(transportModeText(distance, duration, mode));
			newDivDistance.appendChild(textNodeDistance);

			// check if block for the destination already exists
			var destinationId = originId + "destination" + l.toString();
			var destinationDiv = document.getElementById(destinationId);

			if (destinationDiv === null) {
				var newDivDestination = document.createElement("span");
				newDivDestination.className = page + "-destination";
				var textNodeDestination = document.createTextNode(destinationName);
				newDivDestination.appendChild(textNodeDestination);

				var newDiv = document.createElement("div");
				newDiv.id = destinationId;
				newDiv.appendChild(newDivDestination);
				newDiv.appendChild(newDivDistance);

				var addressBlock = document.getElementById(originId);
				addressBlock.appendChild(newDiv);
			}
			else {
				destinationDiv.appendChild(newDivDistance);
			}
		}
	}
}

function transportModeText(distance, duration, mode) {
	if (mode === "bicycling") {
		return "🚲 " + distance + " " + duration;
	}
	else if (mode === "transit") {
		return "🚌 " + duration;
	}
}

function requestURL(origins, destinations, mode) {
	// origins, destinations: addresses as string array
	// mode: bicycling or transit

	const apiKey = "AIzaSyAWX9chkt6F6w4aoNqgWdPsINgaiuhIX_k";
	var requestURL;
	requestURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=" + mode;
	if (mode === "transit") {
		requestURL += "&departure_time=" + today8amInSeconds().toString();
	}
	requestURL += "&origins=" + addressesToString(origins) + "&destinations=" + addressesToString(destinations) + "&key=" + apiKey;

	console.log(requestURL);
	return requestURL;
}

function addressesToString(addresses) {
	var addressString;
	if (addresses.length > 0) {
		addressString = addresses[0];

		for (var l = 1; l < addresses.length; ++l) {
			addressString += "|" + addresses[l];
		}
	}
	return addressString;
}

function today8amInSeconds() {
	var d = new Date();
	return Math.round(d.setHours(8,0,0)/1000);
}