var workLocation = "Arnulfstr. 19, 80335 München";

// search for address on current page
var addressBlock = document.getElementsByClassName("address-block")

if (addressBlock.length > 0) {
	var address = addressBlock[0].innerText;

	// query distance
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", processRequest);
	xhr.open('GET', "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyAWX9chkt6F6w4aoNqgWdPsINgaiuhIX_k", true);
	xhr.send();
}

function processRequest() {
    var response = JSON.parse(this.responseText);

    var destination = response.destination_addresses[0];
    var distance = response.rows[0].elements[0].distance.text;

    // insert distances on page
	var text = destination + ": " + distance;
	insertDistanceInAddressBlock(text);
}

function insertDistanceInAddressBlock(text) {
	var textNode = document.createTextNode(text);
	var newElement = document.createElement("div");
	newElement.appendChild(textNode);
	addressBlock[0].appendChild(newElement);
}