var masterGain;
var fadeFilter;
var offlineBuffer;

setTimeout(function(){bufferLoaded();}, 1000);

function bufferLoaded(){

	var gain = audioCtx.createGain();
	gain.gain.value = 2;

	fadeFilter = new FilterFade(0);

	var f = new MyBiquad("highpass", 20, 1);

	masterGain = audioCtx.createGain();
	masterGain.connect(gain);
	gain.connect(fadeFilter.input);
	fadeFilter.connect(f);
	f.connect(audioCtx.destination);

	if(onlineButton.innerHTML == "online"){
		setTimeout(function(){onlineBufferLoaded();}, 1000);
	}

	else if(onlineButton.innerHTML == "offline"){
		offlineBufferLoaded();
	}

}

//--------------------------------------------------------------

function runPatch(){

	fadeFilter.start(1, 50);
	var now = audioCtx.currentTime;

	resonantSequenceSection(now);

}

//--------------------------------------------------------------

function stopPatch(){

	var now = audioCtx.currentTime;
	fadeFilter.start(0, 20);
	setTimeout(function(){masterGain.disconnect();}, 100);
	startButton.innerHTML = "reset";

	if(onlineButton.innerHTML=="offline"){
		offlineBuffer.stop();
	}

}

//--------------------------------------------------------------

function onlineBufferLoaded(){

	startButton.disabled = false;
	startButton.innerHTML = "start";

}

//--------------------------------------------------------------

function offlineBufferLoaded(){

	runPatch();

	audioCtx.startRendering().then(function(renderedBuffer){

		offlineBuffer = onlineCtx.createBufferSource();
		offlineBuffer.buffer = renderedBuffer

		startButton.disabled = false;
		startButton.innerHTML = "start";

		offlineBuffer.connect(onlineCtx.destination);

	})

}
