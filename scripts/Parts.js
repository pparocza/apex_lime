//--------------------------------------------------------------

function resonantSequence(now, gainVal, rate, fund, pSL){

	var now = now;
	var gainVal = gainVal;

  var output = audioCtx.createGain();
  output.gain.value = gainVal;
  var dryGain = audioCtx.createGain();
  var fxInGain = audioCtx.createGain();
  var fxOutGain = audioCtx.createGain();

  var rate = rate;
  var fund = fund;
	var pSL = pSL;

  var fT = new Instrument();
  fT.filterTick(rate, "bandpass", fund, fund);

  var dS1 = new Effect();
  var dS1NDelays = 4;
  var dS1FB = new Sequence();
  dS1FB.duplicates(dS1NDelays, 0);
  dS1FB = dS1FB.sequence;
  // nDelays, base, eArray
  dS1.powerSequenceDelay(dS1NDelays, 4, [-3, -4, -5, -3.3, -4.12, -5.6], dS1FB);
  dS1.on();

  var dS2 = new Effect();
  var dS2NDelays = 3;
  var dS2FB = new Sequence();
  dS2FB.randomFloats(dS2NDelays, 0.1, 0.15);
  dS2FB = dS2FB.sequence;
  dS2.powerSequenceDelay(dS2NDelays, 1/8, [1, 2, 0.5], dS2FB);
  dS2.on();

  fT.connect(dryGain);
  fT.connect(fxInGain);

  fxInGain.connect(dS1.input);
  dS1.connect(fxOutGain);
  dS1.connect(dS2);
  dS2.connect(fxOutGain);

  dryGain.connect(output);
  fxOutGain.connect(output);

	var f1 = new MyBiquad("highpass", 30, 0);
	var f2 = new MyBiquad("lowshelf", 100, 0);
	var f3 = new MyBiquad("lowpass", 20000, 0);
	f2.biquad.gain.value = -8;

  output.connect(f1.input);
	f1.connect(f2);
	f2.connect(f3);
	f3.connect(masterGain);

  fT.start();

  // PITCH Sequence

  var pS = new Sequence();
  pS.randomPowers(pSL, fund, [0.8, 0.9, 1, 1.05, 1.1]);
  pS = pS.sequence;
  var j=0

  var pOS = new Sequence();
  pOS.additive(pSL, [0.125]);
  pOS = pOS.sequence;

  for(var i=0; i<pS.length; i++){
      fT.f.biquad.frequency.setValueAtTime(parseInt(pS[j]), now+pOS[i]);
			fT.f.biquad.Q.setValueAtTime(0.2125*parseInt(pS[j]), now+pOS[i])
      j++;
  }

}

//--------------------------------------------------------------
