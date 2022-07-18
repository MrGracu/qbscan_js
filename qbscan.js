/*!
  * qbscan v0.1 (https://github.com/MrGracu/qbscan_js)
  * Description: QR Code and Barcode scanner in JavaScript
  * Copyright 2022 by Gracjan Mika (https://gmika.pl/)
  * Licensed under MIT (https://github.com/MrGracu/qbscan_js/blob/main/LICENSE)
  */

async function qbscan(args, _detectedCallback = null) {
	let _videoSrc = null;
	let _detecting = false;
	let _flashOn = false;
	let _startResponse = {
		ok: true,
		supportedFormats: '',
		barcodeDetectorSupport: true,
		accessCameraDevice: true,
		userMediaSupport: true,
		erorMessage: ''
	};
	let _emptyCanvas = document.createElement('canvas');
    _emptyCanvas.width = 10;
    _emptyCanvas.height = 10;
	
	//START: SETTINGS
	let _loop = (args === null || args.loop === null || typeof args.loop !== 'boolean' ? true : args.loop);
	let _pauseOnDetect = (args === null || args.pauseOnDetect === null || typeof args.pauseOnDetect !== 'boolean' ? true : args.pauseOnDetect);
	let _clearVideoOnPause = (args === null || args.clearVideoOnPause === null || typeof args.clearVideoOnPause !== 'boolean' ? false : args.clearVideoOnPause);
	let _localCanvas = (args === null || args.imageCanvas === null || typeof args.imageCanvas !== 'object' ? document.createElement('CANVAS') : args.imageCanvas);
	let _cameraSelect = (args === null || args.cameraSelect === null || typeof args.cameraSelect !== 'object' ? document.createElement('SELECT') : args.cameraSelect);
	let _videoObject = (args === null || args.video === null || typeof args.video !== 'object' ? document.createElement('VIDEO') : args.video);
	let _detectFormats = (args === null || args.detectFormats === null || !Array.isArray(args.detectFormats) ? ['qr_code', 'ean_13'] : args.detectFormats);
	let _detectFormatsAll = (args === null || args.detectFormatsAll === null || typeof args.detectFormatsAll !== 'boolean' ? false : args.detectFormatsAll);
	
	let _videoFrameRateIdeal = (args === null || args.videoFrameRate === null || typeof args.videoFrameRate !== 'number' ? 32 : args.videoFrameRate);
	let _videoFrameRateMax = (args === null || args.videoFrameRateMax === null || typeof args.videoFrameRateMax !== 'number' ? 56 : args.videoFrameRateMax);
	let _videoWidth = (args === null || args.videoWidth === null || typeof args.videoWidth !== 'number' ? 1024 : args.videoWidth);
	let _videoHeight = (args === null || args.videoHeight === null || typeof args.videoHeight !== 'number' ? 768 : args.videoHeight);
	
	let _flashBtn = (args === null || args.flashButton === null || typeof args.flashButton !== 'object' ? null : args.flashButton);
	//END: SETTINGS
	
	if(_clearVideoOnPause) {
		_videoObject.addEventListener("pause", function() {
			_videoSrc = _videoObject.srcObject;
			_videoObject.srcObject = null;
		});
		
		_videoObject.addEventListener("play", function() {
			if(_videoSrc !== null) {
				_videoObject.srcObject = _videoSrc;
			}
		});
	}
	
	function _hasGetUserMedia() {
		return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && navigator.mediaDevices.enumerateDevices);
	}
	
	function _gotStream(_stream) {
		_flashOn = false;

		const _track = _stream.getVideoTracks()[0];
		_videoObject.srcObject = _stream;
		
		if(_flashBtn !== null) {
			if ('ImageCapture' in window) {
				_flashBtnText = _flashBtn.innerHTML;
				_flashBtn.style.display = "block";

				const _imageCapture = new ImageCapture(_track);
				_imageCapture.getPhotoCapabilities().then(_capabilities => {
					const torchSupported = !!_capabilities.torch || ('fillLightMode' in _capabilities && _capabilities.fillLightMode.length != 0 && _capabilities.fillLightMode != 'none');
					
					if (torchSupported) {
						_flashBtn.onclick = function() {
							_flashBtn.disabled = true;
							_flashBtn.innerHTML = (_flashOn ? "Turning off..." : "Turning on...");
							try {
								_track.applyConstraints({
									advanced: [{
										torch: (_flashOn = !_flashOn)
									}]
								}).then(() => {
									_flashBtn.disabled = false;
									_flashBtn.innerHTML = _flashBtnText;
								}).catch(e => {
									_flashBtn.disabled = false;
									_flashBtn.innerHTML = _flashBtnText;
								});
							} catch (err) {
								console.log('QBSCAN: Error inside flash method');
							}
							_flashBtn.blur();
						};
					} else {
						_flashBtn.style.display = "none";
					}
				}).catch(function(error) {
					_flashBtn.style.display = "none";
					console.log('QBSCAN: Flash support error: ', error.message);
				});
			} else {
				_flashBtn.style.display = "none";
				console.log('QBSCAN: Flash not supported');
			}
		}
		
		window.stream = _stream;
	}
	
	async function _emergencyCamera() {
		const _videoConstraints = {
			video: {
				frameRate: {
					ideal: _videoFrameRateIdeal,
					max: (_videoFrameRateIdeal > _videoFrameRateMax ? _videoFrameRateIdeal : _videoFrameRateMax)
				},
				width: {
					ideal: _videoWidth
				},
				height: {
					ideal: _videoHeight
				},
				audio: false
			}
		};

		await navigator.mediaDevices
			.getUserMedia(_videoConstraints)
			.then(_gotStream)
			.catch(function(err) {
				console.log('QBSCAN: Error authorizing access to emergency camera device');
				throw err;
			});
	}
	
	async function _getStream() {
		if (window.stream) {
			window.stream.getTracks().forEach(function (_track) {
				_track.stop();
			});
		}

		const _videoConstraints = {
			video: {
				deviceId: {
					exact: _cameraSelect.value
				},
				frameRate: {
					ideal: _videoFrameRateIdeal,
					max: (_videoFrameRateIdeal > _videoFrameRateMax ? _videoFrameRateIdeal : _videoFrameRateMax)
				},
				width: {
					ideal: _videoWidth
				},
				height: {
					ideal: _videoHeight
				},
				audio: false
			}
		};

		await navigator.mediaDevices
			.getUserMedia(_videoConstraints)
			.then(_gotStream)
			.catch(async function(err) {
				try {
					await _emergencyCamera();
				} catch(err2) {
					console.log('QBSCAN: Error in get stream function');
					throw err;
				}
			});

		_cameraSelect.blur();
	}
	
	function _gotDevices(_deviceInfos) {
		for (let i = 0; i !== _deviceInfos.length; ++i) {
			const _deviceInfo = _deviceInfos[i];
			if (_deviceInfo.kind === "videoinput") {
				const option = document.createElement("option");
				option.value = _deviceInfo.deviceId;
				option.text = _deviceInfo.label || "Camera " + (_cameraSelect.length + 1);
				_cameraSelect.appendChild(option);
			}
		}
		
		if(_cameraSelect.options.length > 0) _cameraSelect.value = _cameraSelect[(_cameraSelect.options.length - 1)].value;
	}
	
	async function _useCamera() {
		await navigator.mediaDevices
			.enumerateDevices()
			.then(_gotDevices)
			.then(_getStream)
			.catch(function(err) {
				console.log('QBSCAN: Error authorizing access to camera device');
				throw err;
			});
		_cameraSelect.onchange = _getStream;
	}
	
	if (!('BarcodeDetector' in window)) {
		_startResponse.ok = false;
		_startResponse.barcodeDetectorSupport = false;
		_startResponse.erorMessage = "BarcodeDetector is not supported";
	} else {
		if (_hasGetUserMedia()) {
			let _continueBarcodeDetect = true;
			try {
				await _useCamera();
			} catch(err) {
				_startResponse.ok = false;
				_startResponse.accessCameraDevice = false;
				_startResponse.erorMessage = err;
				_continueBarcodeDetect = false;
			}
			
			if(_continueBarcodeDetect) {
				await BarcodeDetector.getSupportedFormats()
					.then(supportedFormats => {
						_startResponse.supportedFormats = supportedFormats;
					});
				
				const _barcodeDetector = new BarcodeDetector({formats: (_detectFormatsAll ? _startResponse.supportedFormats : _detectFormats)});
				
				function _recognize() {
					let _found = false;
					let _barcodeCamera = null;
					let _ctx = null;
					let _response = {
						ok: null,
						erorMessage: '',
						detectedTime: null,
						detected: []
					};
					
					if (_videoObject.paused || _videoObject.ended || _videoObject.srcObject === null || _detecting) {
						_barcodeCamera = _emptyCanvas;
					} else {
						_detecting = true;
						_localCanvas.width = _videoObject.videoWidth;
						_localCanvas.height = _videoObject.videoHeight;
						_ctx = _localCanvas.getContext('2d');
						_ctx.drawImage(_videoObject, 0, 0);
						_barcodeCamera = _localCanvas;
					}
					
					_barcodeDetector.detect(_barcodeCamera).then((_barcodes) => {
						let _currentTime = new Date();
						if(_barcodes.length > 0 && !_videoObject.paused) {
							if(_pauseOnDetect) {
								_found = true;
								_videoObject.pause();
							}

							_barcodes.forEach(_barcode => {
								let _responseRow = {
									boundingBox: _barcode.boundingBox,
									cornerPoints: _barcode.cornerPoints,
									format: _barcode.format,
									rawValue: (_barcode.rawData == null ? _barcode.rawValue : _barcode.rawData)
								};
								
								_response.detected.push(_responseRow);
							});
						}
						
						_response.ok = true;
						_response.detectedTime = {
							day: _currentTime.getDate(),
							month: (_currentTime.getMonth() + 1),
							year: _currentTime.getFullYear(),
							hour: _currentTime.getHours(),
							minute: _currentTime.getMinutes(),
							second: _currentTime.getSeconds(),
							milisecond: _currentTime.getMilliseconds()
						}
					}).catch(function(error) {
						_response.ok = false;
						_response.erorMessage = error.message;
					}).finally(() => {
						if(_detectedCallback !== null && typeof _detectedCallback === 'function') _detectedCallback(_response);
						if(!_found && !_videoObject.paused) _detecting = false;
						if(_loop) requestAnimationFrame(_recognize);
					});
				}
				
				if(_loop) requestAnimationFrame(_recognize);
			}
		} else {
			_startResponse.ok = false;
			_startResponse.userMediaSupport = false;
			_startResponse.erorMessage = "The photo-taking function is not supported by your browser or there is no camera device";
		}
	}
	
	return _startResponse;
}