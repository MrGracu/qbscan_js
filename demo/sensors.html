<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Sensors example">
	<meta name="keywords" content="sensors, orientation, gyroscope, example, online">
	<meta name="author" content="Gracjan Mika">
	<title>Sensors example</title>
	
	<style>
	body {
		margin: 0;
		font-family: Arial;
	}

	.link-effect {
		text-decoration: none;
		color: inherit;
	}

	.link-effect:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	#container-loading {
		padding-top: 10px;
		width: 150px;
		margin: 0 auto;
	}
	@keyframes loading {
		0%   {left: 0;}
		50%  {left: 140px;}
		100% {left: 0;}
	}
	.loading {
		border-radius: 50%;
		width: 10px;
		height: 10px;
		background: #939393;
		position: relative;
		animation: loading 1s infinite;
		animation-timing-function: linear;
	}

	.d-inline-block {
		display: inline-block;
	}

	.mb-1 {
		margin-bottom: 2px;
	}

	.mb-2 {
		margin-bottom: 4px;
	}

	.mt-2 {
		margin-bottom: 4px;
	}

	.px-2 {
		padding-left: 4px;
		padding-right: 4px;
	}

	.text-left {
		text-align: left;
	}

	.w-100 {
		width: 100%;
	}
	.color-gray {
		color: gray;
	}

	.d-none {
		display: none;
	}

	.text-center {
		text-align: center;
	}

	#page-title {
		text-align: center;
		margin: 10px 0;
		color: #5c5c5c;
		line-height: 0.9em;
	}

	#page-title span {
		font-size: 12px;
		color: #666666;
	}
	</style>
</head>
<body>
	<h3 id="page-title">Sensors example<br/><span>by <a class="link-effect" href="https://gmika.pl">Gracjan Mika</a></span></h3>
	
	<div id="container-not-working" class="text-center d-none">
		<h3>The sensors function is not supported by this browser</h3>
	</div>
	
	<div id="container-loading">
		<div class="loading"></div>
	</div>
	
	<div id="container-page" class="d-none">
		<h3>Gyroscope</h3>
		<p id="gyroscope-text">No info</p>
		<h3>Linear acceleration</h3>
		<p id="linear-acceleration-text">No info</p>
		<h3>Orientation</h3>
		<p id="orientation-text">No info</p>
		<h3>Screen orientation</h3>
		<p id="screen-orientation-text">No info</p>
	</div>

	<script>
	const laText = document.getElementById("linear-acceleration-text");
	const gyroscopeText = document.getElementById("gyroscope-text");
	const orientationText = document.getElementById("orientation-text");
	const screenOrientationText = document.getElementById("screen-orientation-text");
	
	const notWorking = document.getElementById("container-not-working");
	const loading = document.getElementById("container-loading");
	const page = document.getElementById("container-page");
	
	function addClass(elem, className) {
		if(!elem.classList.contains(className)) elem.classList.add(className);
	}

	function removeClass(elem, className) {
		if(elem.classList.contains(className)) elem.classList.remove(className);
	}

	function switchWindow(elem, removeCurrent = true) {
		if(removeCurrent) {
			addClass(page, "d-none");
			addClass(loading, "d-none");
			addClass(notWorking, "d-none");
		}
		
		removeClass(elem, "d-none");
	}
	
	function createGyroscope() {
		try {
			return new Gyroscope({frequency: 60});
		} catch(err) {
			//alert(err);
			gyroscopeText.innerHTML = "Gyroscope sensor is not supported by this browser";
			return null;
		}
	}
	
	function createLaSensor() {
		try {
			return new LinearAccelerationSensor({frequency: 60});
		} catch(err) {
			//alert(err);
			laText.innerHTML = "Linear acceleration sensor is not supported by this browser";
			return null;
		}
	}
	
	/*GYROSCOPE*/
	let gyroscopeData = {
		x: 0,
		y: 0,
		z: 0
	};
	let gyroscope = createGyroscope();
	if(gyroscope != null) {
		gyroscope.addEventListener('reading', (e) => {
			let update = false;
			if(Math.round(gyroscope.x) != gyroscopeData.x) {
				gyroscopeData.x = Math.round(gyroscope.x);
				update = true;
			}
			if(Math.round(gyroscope.y) != gyroscopeData.y) {
				gyroscopeData.y = Math.round(gyroscope.y);
				update = true;
			}
			if(Math.round(gyroscope.z) != gyroscopeData.z) {
				gyroscopeData.z = Math.round(gyroscope.z);
				update = true;
			}
			
			if(update) {
				gyroscopeText.innerHTML = `X: ${gyroscopeData.x}<br/>Y: ${gyroscopeData.y}<br/>Z: ${gyroscopeData.z}`;
			}
		});
		gyroscope.addEventListener('activate', (e) => console.log('Ready to measure gyroscope.', e));
		gyroscope.start();
	}
	
	/*LINEAR ACCELERATION*/
	let laData = {
		x: 0,
		y: 0,
		z: 0
	};
	let laSensor = createLaSensor();
	if(laSensor != null) {
		laSensor.addEventListener('reading', (e) => {
			let update = false;
			if(Math.round(laSensor.x) != laData.x) {
				laData.x = Math.round(laSensor.x);
				update = true;
			}
			if(Math.round(laSensor.y) != laData.y) {
				laData.y = Math.round(laSensor.y);
				update = true;
			}
			if(Math.round(laSensor.z) != laData.z) {
				laData.z = Math.round(laSensor.z);
				update = true;
			}
			
			if(update) {
				laText.innerHTML = `X: ${laData.x}<br/>Y: ${laData.y}<br/>Z: ${laData.z}`;
			}
		});
		laSensor.addEventListener('activate', (e) => console.log('Ready to measure linear acceleration.', e));
		laSensor.start();
	}
	
	/*ORIENTATION*/
	let orientationData = {
		x: 0,
		y: 0,
		z: 0
	};
	function handleOrientation(event) {
		orientationData.x = (Math.round(event.beta * 10) / 10); // [-180,180)
		orientationData.y = (Math.round(event.gamma * 10) / 10); // [-90,90)
		orientationData.z = (Math.round(event.alpha * 10) / 10); // [0,360)
		
		if (orientationData.x > 90) {
			orientationData.x -= 90;
		}
		
		if (orientationData.x < -90) {
			orientationData.x += 90;
		}
		
		orientationText.innerHTML = `X: ${orientationData.x}<br/>Y: ${orientationData.y}<br/>Z: ${orientationData.z}`;
	}
	
	let currentOrientation = null;
	
	function showOrientation() {
		screenOrientationText.innerHTML = (currentOrientation % 2 > 0 ? "Landscape" : "Portrait");
	}
	
	function setOrientation(type, callback) {
		switch (type) {
			case "landscape-primary":
				detectedOrientation = 1;
				break;
			case "landscape-secondary":
				detectedOrientation = 3;
				break;
			case "portrait-primary":
				detectedOrientation = 0;
				break;
			case "portrait-secondary":
				detectedOrientation = 2;
				break;
			default:
				console.log("The orientation API isn't supported in this browser", screen.orientation.type);
				detectedOrientation = null;
		}
		
		if(currentOrientation != detectedOrientation) {
			currentOrientation = detectedOrientation;
			callback();
		}
	}
	
	window.onload = function() {
		if(gyroscope != null || laSensor != null || screen.orientation != null) {
			switchWindow(page);
			
			window.addEventListener("deviceorientation", handleOrientation);
			screen.orientation.addEventListener("change", function(ev) {
				console.log("Orientation", ev);
				setOrientation(ev.target.type, showOrientation);
			});
			
			setOrientation(screen.orientation.type, showOrientation);
		} else {
			switchWindow(notWorking);
		}
	};
	</script>
</body>
</html>