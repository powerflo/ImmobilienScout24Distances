var destinations = ["Arnulfstr. 19, 80335 München", "Richard-Reitzner-Allee 1, 85540 Haar"];

// search for address on current page
var addressBlock = document.getElementsByClassName("address-block")

if (addressBlock.length > 0) {
	var address = addressBlock[0].innerText;

	// query distance
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", processRequestBike);
	xhr.open('GET', requestURL(address, destinations, "bicycling"), true);
	xhr.send();
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

	for (var l = 0; l < response.rows[0].elements.length; ++l) {
		var destination = response.destination_addresses[l];
	    var distance = response.rows[0].elements[l].distance.text;
	    var duration = response.rows[0].elements[l].duration.text;

	    var text = destination + " " + distance + " " + duration;

		var newDivDestination = document.createElement("div");
		var textNodeDestination = document.createTextNode(destination);
		newDivDestination.appendChild(textNodeDestination);

		var symbol;
		if (mode === "bicycling") {
			symbol = "🚲";
		}
		else if (mode === "transit") {
			symbol = "";
		}
		var newDivDistance = document.createElement("div");
		var textNodeDistance = document.createTextNode(symbol + " " + distance + " " + duration);
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

function requestURL(origin, destinations, mode) {
	// origin, destination: addess
	// mode: bicycling or transit
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