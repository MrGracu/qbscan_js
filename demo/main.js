let loading = document.getElementById("container-loading");
let camera = document.getElementById("container-camera");
let notWorking = document.getElementById("container-not-working");
let barcodeNotWorking = document.getElementById("container-barcode-not-working");
let userNotAllowed = document.getElementById("container-user-not-allowed");
let acceptPhoto = document.getElementById("screen-preview");

let video = document.getElementById("video-player");
let canvas = document.getElementById("screenshot");
let flash = document.getElementById("btnFlash");
const videoSelect = document.querySelector("select#videoSource");

let detectedBefore = null;

function addClass(elem, className) {
	if(!elem.classList.contains(className)) elem.classList.add(className);
	if(elem.id == "screen-preview" && className == "d-none" && document.body.classList.contains('no-overflow-y')) document.body.classList.remove('no-overflow-y');
}

function removeClass(elem, className) {
	if(elem.classList.contains(className)) elem.classList.remove(className);
	if(elem.id == "screen-preview" && className == "d-none" && !document.body.classList.contains('no-overflow-y')) document.body.classList.add('no-overflow-y');
}

function switchWindow(elem, removeCurrent = true) {
	if(removeCurrent) {
		addClass(loading, "d-none");
		addClass(barcodeNotWorking, "d-none");
		addClass(camera, "d-none");
		addClass(notWorking, "d-none");
		addClass(acceptPhoto, "d-none");
		addClass(userNotAllowed, "d-none");
	}
	
	removeClass(elem, "d-none");
}

function cancelAccept() {
	video.play();
	addClass(acceptPhoto, 'd-none');
}

function recognizedBarcodes(response) {
	if(response.ok === true && response.detected.length > 0) {
		//console.log(response.detectedTime);
		//alert(JSON.stringify(response));
		let ctx = canvas.getContext("2d");
		let textContainer = document.getElementById('detectedText');
		textContainer.innerHTML = '';
		
		response.detected.forEach(barcode => {
			//alert(barcodes.length + JSON.stringify(barcode));
			ctx.beginPath();
			ctx.moveTo(barcode.cornerPoints[0].x, barcode.cornerPoints[0].y);
			ctx.lineTo(barcode.cornerPoints[1].x, barcode.cornerPoints[1].y);
			ctx.lineTo(barcode.cornerPoints[2].x, barcode.cornerPoints[2].y);
			ctx.lineTo(barcode.cornerPoints[3].x, barcode.cornerPoints[3].y);
			ctx.lineTo(barcode.cornerPoints[0].x, barcode.cornerPoints[0].y);
			ctx.lineTo(barcode.cornerPoints[1].x, barcode.cornerPoints[1].y);
			ctx.lineWidth = 14;
			ctx.strokeStyle = '#ff0000';
			ctx.stroke();
			
			let barcodeValue = (barcode.rawValue.trim().startsWith('http') ? `<a target="_blank" href="${barcode.rawValue}">${barcode.rawValue}</a>` : barcode.rawValue);
			textContainer.innerHTML = (textContainer.innerHTML.length > 0 ? '<br/>' : '') + `(${barcode.format}): ${barcodeValue}`;
		});
		
		switchWindow(acceptPhoto, false);
		detectedBefore = response.detected;
	}
}

window.onload = async function() {
	const args = {
		pauseOnDetect: true, //Pause when detect -> when true then need to manually play video: boolean
		loop: true, //Loop detecting: boolean
		imageCanvas: canvas, //Canvas which display image with found barcode
		cameraSelect: videoSelect, //Select for different device cameras
		detectFormats: ['code_93', 'code_128', 'qr_code', 'aztec', 'code_39', 'data_matrix', 'ean_13', 'itf', 'pdf417'], //Customize selection formats, list of available formats: https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats if null then only qrcode and ean13
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
		switchWindow(notWorking);
	} else if(!initialized.barcodeDetectorSupport) {
		switchWindow(barcodeNotWorking);
	} else if(!initialized.accessCameraDevice) {
		switchWindow(userNotAllowed);
	} else if(initialized.ok) {
		switchWindow(camera);
	}
};