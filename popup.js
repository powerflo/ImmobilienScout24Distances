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
	var destination = document.createElement("li");
	var nameField = document.createElement("span");
	nameField.className = "name";
	nameField.contentEditable = "true";
	var nameText = document.createTextNode(name);
	nameField.appendChild(nameText);
	destination.appendChild(nameField);
	var addressField = document.createElement("span");
	addressField.className = "address";
	addressField.contentEditable = "true";
	var addressText = document.createTextNode(address);
	addressField.appendChild(addressText);
	destination.appendChild(addressField);
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
	addDestinationToList("name","address");
}

function saveDestinations() {
	var nameElements = document.getElementsByClassName("name");
	var names = [];
	for (let i=0; i < nameElements.length; ++i) {
		names.push(nameElements[i].innerText);
	}

	var addressElements = document.getElementsByClassName("address");
	var addresses = [];
	for (let i=0; i < addressElements.length; ++i) {
		addresses.push(addressElements[i].innerText);
	}

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'names': names, 'destinations': addresses}, function() {
      console.log("saved");
    });
}