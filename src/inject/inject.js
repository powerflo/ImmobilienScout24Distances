var destinations;
var destinationsName;
var page;

loadDestinations();

// Select the node that will be observed for mutations
var targetNode = document.getElementById('resultListItems');
if (targetNode !== null) {

	// Options for the observer (which mutations to observe)
	var config = { attributes: true, childList: true, subtree: false, characterData: true };

	// Callback function to execute when mutations are observed
	var url;
	var callback = function(mutationsList) {
	    for(var mutation of mutationsList) {
	        if (mutation.type == 'childList') {
	        	loadDestinations();
	        }
	    }
	};

	// Create an observer instance linked to the callback function
	var observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
}

function loadDestinations() {
	chrome.storage.sync.get(['checked', 'names', 'destinations'], function(result) {
		destinations = [];
		destinationsName = [];
		for (let i=0; i < result.names.length; ++i) {
			if (result.checked[i]) { // only checked destinations
				destinations.push(result.destinations[i]);
				destinationsName.push(result.names[i]);
			}
		}
      init();
    });
}

function init() {
	if (url !== document.location.href) {
		var addressBlock = document.getElementsByClassName("address-block");
		var resultListEntryAddress = document.getElementsByClassName("result-list-entry__address");

		var origins;
		
		if (addressBlock.length > 0) {
			page = "expose";
			origins = extractAddressesFromHTMLCollection(addressBlock);
			setIdInHTMLCollection(addressBlock);
		}
		else if (resultListEntryAddress.length > 0) {
			page = "resultlist";
			origins = extractAddressesFromHTMLCollection(resultListEntryAddress);
			setIdInHTMLCollection(resultListEntryAddress);
		}

		if (origins.length > 0) {
			// save the current url to do the query only once
			url = document.location.href;

			loadDestinations();

			// query distance for bicycling
			var xhrBike = new XMLHttpRequest();
			xhrBike.addEventListener("load", processRequest("bicycling"));
			xhrBike.open('GET', requestURL(origins, destinations, "bicycling"), true);
			xhrBike.send();

			// query distance for driving
			var xhrDriving = new XMLHttpRequest();
			xhrDriving.addEventListener("load", processRequest("driving"));
			xhrDriving.open('GET', requestURL(origins, destinations, "driving"), true);
			xhrDriving.send();

			// query distance for public distance
			var xhrTransit = new XMLHttpRequest();
			xhrTransit.addEventListener("load", processRequest("transit"));
			xhrTransit.open('GET', requestURL(origins, destinations, "transit"), true);
			xhrTransit.send();
		}
	}
}

function extractAddressesFromHTMLCollection(elements) {
	var origins = [];
	for (let i = 0; i < elements.length; ++i) {
		var address = elements[i].innerText;
		if (address !== "") {
			origins.push(elements[i].innerText);
		}
	}
	return origins;
}

function setIdInHTMLCollection(elements) {
	for (let i = 0; i < elements.length; ++i) {
		var div = document.createElement("div");
		div.id = "origin" + i.toString();
		div.className = page + "-origin-block";
		elements[i].appendChild(div);
	}
}

function processRequest(mode) {
	return function() {
	    var response = JSON.parse(this.responseText);	
		insertDistanceInDocument(response, mode);
	}
}

function insertDistanceInDocument(response, mode) {
	for (let i = 0; i < response.rows.length; ++i) {
		
		var originId = "origin" + i.toString();
		// loop through every destination
		for (let l = 0; l < response.rows[i].elements.length; ++l) {
			
			var destinationAddress = response.destination_addresses[l];
			var destinationName = destinationsName[l];
		    var distanceText = response.rows[i].elements[l].distance.text;
		    var distanceValue = response.rows[i].elements[l].distance.value;
		    var durationText = response.rows[i].elements[l].duration.text;

		    // no bicycling distance if distance > 50km
		    if (mode === "bicycling" && distanceValue > 50*1000) {
		    	continue;
		    }
		    // no driving distance if distance < 50km
		    if (mode === "driving" && distanceValue < 50*1000) {
		    	continue;
		    }

			var newDivDistance = document.createElement("span");
			newDivDistance.className = page + "-distance";
			var textNodeDistance = document.createTextNode(transportModeText(distanceText, durationText, mode));
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
				newDiv.className = page + "-distance-block";
				newDiv.appendChild(newDivDistance);

				var newOuterDiv = document.createElement("div");
				newOuterDiv.className = page + "-destination-block";
				newOuterDiv.appendChild(newDivDestination);
				newOuterDiv.appendChild(newDiv);

				var addressBlock = document.getElementById(originId);
				addressBlock.appendChild(newOuterDiv);
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
	else if (mode === "driving") {
		return "🚗 " + duration;
	}
	else if (mode === "transit") {
		return "🚉 " + duration; // 🚌
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