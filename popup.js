load();

var btn = document.getElementById("saveButton");
btn.onclick = save;

function load() {
	chrome.storage.sync.get(['names', 'destinations'], function(result) {
      console.log('Value currently is ' + result.names + result.destinations);
      updateFields(result);
    });

	


}

function updateFields(result) {
	for (let i=0; i < result.names.length; ++i) {
		document.getElementById("name"+i.toString()).innerText = result.names[i];
		document.getElementById("address"+i.toString()).innerText = result.destinations[i];
	}
}

function save() {
	var names = [document.getElementById("name0").innerText, document.getElementById("name1").innerText];
	var addresses = [document.getElementById("address0").innerText, document.getElementById("address1").innerText];

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'names': names, 'destinations': addresses}, function() {
      console.log("saved");
    });
}