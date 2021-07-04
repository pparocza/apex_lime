function InstrumentConstructorTemplate(){

	this.output = audioCtx.createGain();

}

InstrumentConstructorTemplate.prototype = {

	output: this.output,

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

function Instrument(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

Instrument.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	instrumentMethod: function(){
		this.startArray = [];
	},

	filterTick: function(rate, type, freq, Q){

		this.rate = rate;
		this.type = type;
		this.freq = freq;
		this.Q = Q;

		this.o = new LFO(0, 1, this.rate);
		this.o.buffer.makeSawtooth(1);
		this.f = new MyBiquad(this.type, this.freq, this.Q);

		this.o.connect(this.f);
		this.f.connect(this.output);

		this.startArray = [this.o];

	},

	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	startAtTime: function(startTime){

		var startArray = this.startArray;
		var startTime = startTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].start();
			}
		}, startTime*1000);

	},

	stopAtTime: function(stopTime){

		var startArray = this.startArray;
		var stopTime = stopTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].stop();
			}
		}, startTime*1000);

	},

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

function Effect(){

	this.input = audioCtx.createGain();
	this.filterFade = new FilterFade(0);
	this.output = audioCtx.createGain();
	this.startArray = [];

	this.input.connect(this.filterFade.input);

}

Effect.prototype = {

	input: this.input,
	output: this.output,
	filterFade: this.filterFade,
	startArray: this.startArray,

	effectMethod: function(){
		this.startArray = [];
	},

	thru: function(){

		this.filterFade.connect(this.output);

	},

	powerSequenceDelay: function(nDelays, base, eArray, fbArray){

		this.nDelays = nDelays;
		this.base = base;
		this.eArray = eArray;
		this.fbArray = fbArray;

		this.dLS = new Sequence();
		this.dRS = new Sequence();

		this.dLS.randomPowers(this.nDelays, this.base, this.eArray);
		this.dRS.randomPowers(this.nDelays, this.base, this.eArray);

		this.dLS = this.dLS.sequence;
		this.dRS = this.dRS.sequence;

		this.delay = new MultiStereoDelay(this.dLS, this.dRS, this.fbArray);

		this.filterFade.connect(this.delay);
		this.delay.connectAll(this.output);

	},

	filter: function(type, freq, Q){

		this.type = type;
		this.freq = freq;
		this.Q = Q;

		this.f = new MyBiquad(this.type, this.freq, this.Q);
		this.filterFade.connect(this.f);

		this.f.connect(this.output);

	},

	switch: function(switchVal){

		var switchVal = switchVal;

		this.filterFade.start(switchVal, 30);

	},

	switchAtTime: function(switchVal, time){

		var filterFade = this.filterFade;
		var switchVal = switchVal;

		setTimeout(function(){
			filterFade.start(switchVal, 20);
		}, time*1000);

	},

	switchSequence: function(valueSequence, timeSequence){

		var filterFade = this.filterFade;
		var valueSequence = valueSequence;
		var timeSequence = timeSequence;
		var v;
		var j=0;

		for(var i=0; i<timeSequence.length; i++){

			setTimeout(function(){

				v = valueSequence[j%valueSequence.length];
				filterFade.start(v, 20);
				j++;

			}, timeSequence[i]*1000);

		}

	},

	on: function(){

		this.filterFade.start(1, 30);

	},

	off: function(){

		this.filterFade.start(0, 20);

	},

	onAtTime: function(time){

		var filterFade = this.filterFade;

		setTimeout(function(){filterFade.start(1, 20);}, time*1000);

	},

	offAtTime: function(time){

		var filterFade = this.filterFade;

		setTimeout(function(){filterFade.start(0, 20);}, time*1000);

	},

	start: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}

	},

	stop: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}

	},

	startAtTime: function(startTime){

		var startArray = this.startArray;
		var startTime = startTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].start();
			}
		}, startTime*1000);

	},

	stopAtTime: function(stopTime){

		var startArray = this.startArray;
		var stopTime = stopTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].stop();
			}
		}, startTime*1000);

	},

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------
