function resonantSequenceSection(now){

  var fund = randomFloat(200, 300);
  var pSL = 1000;
  var rate = 1;
  var now = now;

  // now, gainVal, rate, fund, pSL
  resonantSequence(now, 0.75, rate, fund, pSL);
  resonantSequence(now, 0.75, rate*2, fund, pSL);
  resonantSequence(now, 0.75, rate*3, fund*P5, pSL);
  resonantSequence(now, 0.75, rate*4, fund, pSL);

}

//--------------------------------------------------------------
