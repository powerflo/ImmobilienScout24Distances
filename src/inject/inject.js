var workLocation = "Arnulfstr. 19, 80335 München";

// search for address on current page
var addressBlock = document.getElementsByClassName("address-block")

if (addressBlock.length > 0) {
	var address = addressBlock[0].innerText;

	// query distance
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = processRequest;
	xhr.open('GET', "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyAWX9chkt6F6w4aoNqgWdPsINgaiuhIX_k", true);
	xhr.send();
}

function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);

        var destination = response.destination_addresses[0];
        var distance = response.rows[0].elements[0].distance.text;

        // insert distances on page
		var newElement = document.createElement("div");
		var text = document.createTextNode(destination + ": " + distance);
		newElement.appendChild(text);
		addressBlock[0].appendChild(newElement);
    }
}