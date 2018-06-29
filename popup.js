load();

var saveButton = document.getElementById("saveButton");
saveButton.onclick = saveDestinations;

var addButton = document.getElementById("addButton");
addButton.onclick = addDestination;

function deleteRow() {
	this.parentNode.parentNode.removeChild(this.parentNode);
}

function load() {
	chrome.storage.sync.get(['names', 'destinations'], function(result) {
      console.log('Value currently is ' + result.names + result.destinations);
      buildAddressList(result);
    });
}

function addDestinationToList(name, address) {
	var destination = document.createElement("div");
	destination.className = "destination";

	var nameInput = document.createElement("INPUT");
	nameInput.setAttribute("type", "text");
	nameInput.value = name;
	nameInput.placeholder = "name";
	nameInput.className = "nameInput";
	destination.appendChild(nameInput);

	var addressInput = document.createElement("INPUT");
	addressInput.setAttribute("type", "text");
	addressInput.value = address;
	addressInput.placeholder = "address";
	addressInput.className = "addressInput";
	destination.appendChild(addressInput);


	var button = document.createElement("button");
	button.innerText = "remove";
	button.className = "deleteButton";
	button.onclick = deleteRow;
	destination.appendChild(button);
	document.getElementById("address-list").appendChild(destination);
}

function buildAddressList(result) {
	for (let i=0; i < result.names.length; ++i) {
		addDestinationToList(result.names[i], result.destinations[i]);
	}
}

function addDestination() {
	addDestinationToList("","");
}

function saveDestinations() {
	var nameElements = document.getElementsByClassName("nameInput");
	var names = [];
	for (let i=0; i < nameElements.length; ++i) {
		names.push(nameElements[i].value);
	}

	var addressElements = document.getElementsByClassName("addressInput");
	var addresses = [];
	for (let i=0; i < addressElements.length; ++i) {
		addresses.push(addressElements[i].value);
	}

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'names': names, 'destinations': addresses}, function() {
      console.log("saved");
    });
}