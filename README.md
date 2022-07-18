# [JS] QBScan
### [JavaScript] QR Code and Barcode scanner  
Working example can be found here: [qbscan.gmika.pl](https://qbscan.gmika.pl).

## Installation
To use this script you can include optimized JS file using [jsDelivr](https://www.jsdelivr.com/):  
### Current version
```HTML
<script src="https://cdn.jsdelivr.net/gh/MrGracu/qbscan_js@main/production/qbscan.js"></script>
```
### Other versions
#### v0.1:
```HTML
<script src="https://cdn.jsdelivr.net/gh/MrGracu/qbscan_js@main/production/qbscan_v0.1.js"></script>
```
  
## Usage
You must include this script **before use** to use properly.  
### Supported borwsers
List of supported browsers can be found [here](https://caniuse.com/mdn-api_barcodedetector).
### List of available formats
List of supported code formats can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats).

## Example
Example script usage:
```javascript
function recognizedBarcodes(response) {
	if(response.ok === true && response.detected.length > 0) {
		let textAll = '';
		
		response.detected.forEach(barcode => {
			textAll = (textAll.length > 0 ? ', ' : '') + `(${barcode.format}): ${barcode.rawValue}`;
		});
		
		alert(textAll);
	}
}

window.onload = async function() {
	const args = {
		pauseOnDetect: true, //Pause when detect -> when true then need to manually play video
		loop: true, //Loop detecting
		imageCanvas: canvas, //Canvas which display image with found barcode
		cameraSelect: videoSelect, //Select for different device cameras
		detectFormats: ['code_93', 'code_128', 'qr_code', 'aztec', 'code_39', 'data_matrix', 'ean_13', 'itf', 'pdf417'], //Customize selection formats, if null then only qrcode and ean13
		//detectFormatsAll: true, //Detect all supported formats
		video: video, //Video HTML tag
		videoFrameRate: 32, //Ideal frame rate
		videoFrameRateMax: 64, //Maximum frame rate
		videoWidth: 1024, //Video width
		videoHeight: 768, //Video height
		flashButton: flash, //Flash button HTML tag
		clearVideoOnPause: true, //Clear video container on pause, and restore on play
	};
	
	let initialized = await qbscan(args, recognizedBarcodes);
	console.log(initialized); //Write to console response attributes
	if(!initialized.userMediaSupport) {
		alert('Not working photo taking info');
	} else if(!initialized.barcodeDetectorSupport) {
		alert('Not working barcode recognition info');
	} else if(!initialized.accessCameraDevice) {
		alert('Camera access not allowed info');
	} else if(initialized.ok) {
		alert('Everything is ok info');
	}
};
```
