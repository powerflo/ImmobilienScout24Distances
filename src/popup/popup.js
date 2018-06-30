load();

var saveButton = document.getElementById("saveButton");
saveButton.onclick = saveDestinations;

var addButton = document.getElementById("addButton");
addButton.onclick = addDestination;

function deleteRow() {
	this.parentNode.parentNode.removeChild(this.parentNode);
}

function load() {
	chrome.storage.sync.get(['checked', 'names', 'destinations'], function(result) {
      console.log('Value currently is ' + result.names + result.destinations);
      buildAddressList(result);
    });
}

function addDestinationToList(checked, name, address) {
	var destination = document.createElement("div");
	destination.className = "destination";

	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.checked = checked;
	checkbox.className = "checkbox";
	destination.appendChild(checkbox);


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
		addDestinationToList(result.checked[i], result.names[i], result.destinations[i]);
	}
}

function addDestination() {
	addDestinationToList(true, "","");
}

function saveDestinations() {
	var checkboxElements = document.getElementsByClassName("checkbox");
	var addressElements = document.getElementsByClassName("addressInput");
	var nameElements = document.getElementsByClassName("nameInput");
	var names = [];
	var addresses = [];
	var checked = [];
	var numberChecked = 0;
	for (let i=0; i < nameElements.length; ++i) {
		checked.push(checkboxElements[i].checked);
		if (checked[i]) {
			++numberChecked;
		}
		if (numberChecked > 5) {
			checked[i] = false;
			checkboxElements[i].checked = false;
		}
		names.push(nameElements[i].value);
		addresses.push(addressElements[i].value);
	}

	if (numberChecked > 5) {
		alert("More than 5 destinations selected");
	}

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'checked': checked, 'names': names, 'destinations': addresses}, function() {
      console.log("saved");
    });
}