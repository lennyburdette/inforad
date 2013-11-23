var DEMO = function () {
  var i = 0;
  return [{
    timeForForm: clockTime(i++),
    type: 'movie',
    url: 'https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/GoodMorning_01.mp4',
    allowDefault: false
  },
  {
    timeForForm: clockTime(i++),
    type: 'image',
    url: 'https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/Quote_01.png',
    allowDefault: false
  },
  {
    timeForForm: clockTime(i++),
    type: 'movie',
    url: 'https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/Game_05_1.mp4',
    allowDefault: true
  },
  {
    timeForForm: clockTime(i++),
    type: 'url',
    url: 'https://radiator.office.vip.sjc1b.square/madmin'
  },
  {
    timeForForm: clockTime(i++),
    type: 'slideshow',
    url: 'https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/LunchTime_01.png,https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/LunchTime_02.png,https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/LunchTime_03.png',
    allowDefault: false
  },
  {
    timeForForm: clockTime(i++),
    type: 'clock',
    allowDefault: true
  },
  {
    timeForForm: clockTime(i++),
    type: 'image',
    url: 'https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/FourCorner_01.png',
    allowDefault: false
  },
  {
    timeForForm: clockTime(i++),
    type: 'gradient',
    url: 'ede4be,d5c98f,fedb9a,fec955,efb338,ef9b35,ef8933,ef6b31,ef5b30,ee452f,ef5b48,ee453e,b14a4b,ba444a,b04a4b,8a3756,7e4958,57324a',
    allowDefault: true
  },
  {
    timeForForm: clockTime(i++),
    type: 'movie',
    url: 'https://s3-us-west-1.amazonaws.com/inforad-media/hackweek/HourglassLoop_Slow.mov',
    allowDefault: false
  },
  {
    timeForForm: clockTime(i++),
    type: 'url',
    url: '/info/demo',
    allowDefault: true
  }];
};
