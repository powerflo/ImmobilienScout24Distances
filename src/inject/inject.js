var destinations = ["Arnulfstr. 19, 80335 München", "Richard-Reitzner-Allee 1, 85540 Haar"];
var destinationsName = ["WTW", "eXXcellent"];

// search for address on current page
var addressBlock = document.getElementsByClassName("address-block")

if (addressBlock.length > 0) {
	var address = addressBlock[0].innerText;

	// query distance for bicycling
	var xhrBike = new XMLHttpRequest();
	xhrBike.addEventListener("load", processRequestBike);
	xhrBike.open('GET', requestURL(address, destinations, "bicycling"), true);
	xhrBike.send();

	// query distance for public distance
	var xhrTransit = new XMLHttpRequest();
	xhrTransit.addEventListener("load", processRequestTransit);
	xhrTransit.open('GET', requestURL(address, destinations, "transit"), true);
	xhrTransit.send();
}

function processRequestBike() {
    var response = JSON.parse(this.responseText);	

	insertDistanceInAddressBlock(response, "bicycling");
}

function processRequestTransit() {
    var response = JSON.parse(this.responseText);	

    // insert distances on page
	insertDistanceInAddressBlock(response, "transit");
}

function insertDistanceInAddressBlock(response, mode) {
	// loop through every destination
	for (var l = 0; l < response.rows[0].elements.length; ++l) {
		var destinationAddress = response.destination_addresses[l];
		var destinationName = destinationsName[l];
	    var distance = response.rows[0].elements[l].distance.text;
	    var duration = response.rows[0].elements[l].duration.text;

		var newDivDestination = document.createElement("div");
		var textNodeDestination = document.createTextNode(destinationName);
		newDivDestination.appendChild(textNodeDestination);

		var newDivDistance = document.createElement("div");
		var textNodeDistance = document.createTextNode(transportModeText(distance, duration, mode));
		newDivDistance.appendChild(textNodeDistance);

		// check if block for the destination already exists
		var destinationId = "destination" + l.toString();
		var destinationDiv = document.getElementById(destinationId);

		if (destinationDiv === null) {
			var newDiv = document.createElement("div");
			newDiv.id = destinationId;
			newDiv.appendChild(newDivDestination);
			newDiv.appendChild(newDivDistance);
			addressBlock[0].appendChild(newDiv);
		}
		else {
			destinationDiv.appendChild(newDivDistance);
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

function requestURL(origin, destinations, mode) {
	// origin, destination: addess
	// mode: bicycling or transit

	// TODO: specify departure time

	const apiKey = "AIzaSyAWX9chkt6F6w4aoNqgWdPsINgaiuhIX_k";
	var requestURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=" + mode + "&origins=" + origin + "&destinations=" + destinationsToString(destinations) + "&key=" + apiKey;
	console.log(requestURL);
	return requestURL;
}

function destinationsToString(destinations) {
	var destinationsString;
	if (destinations.length > 0) {
		destinationsString = destinations[0];

		for (var l = 1; l < destinations.length; ++l) {
			destinationsString += "|" + destinations[l];
		}
	}
	return destinationsString;
}