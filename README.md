# Note: I stopped the project because the cost of the Google Distance Matrix API was too high.

# ImmobilienScout24Distances
Chrome extension for displaying distances and travel times to user-defined locations on ImmobilienScout24.de.
Distances and travel times are calculated with Google Maps for bicycle (short distances), car (long distances) or public transport.

![Screenshot](https://github.com/fanaz/ImmobilienScout24Distances/blob/master/resources/screenshot1.png)

## Installation

Go to
["Distances for ImmobilienScout24.de" on the Webstore](https://chrome.google.com/webstore/detail/distances-for-immobiliens/lmmgpacnniljknifddilndhhcmejknfm) 
and install the extension as usual.

## Developer Installation

* `git clone https://github.com/fanaz/ImmobilienScout24Distances.git`
* Open [chrome://extension](chrome://extensions) in Chrome
* Check "Developer mode" at the top right
* Click "Load unpacked extension..." and select the extension folder you just cloned into

## Authors

* @powerflo

Feel free to open an issue or write a message!

## Version History

* 0.1: prototype
* 0.2: prototype published on chrome web store
* 0.3: Improved popup for address entry
* 0.4: Use background script for http request
* 0.5: Remove google maps api key from extension and send requests to own backend server
