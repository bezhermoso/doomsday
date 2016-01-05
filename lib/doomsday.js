/*eslint-env es6 */

"use strict";

var moment = require("moment");
var Days = require("./days");

module.exports = function (date) {

  date = new Date(date);
  date = moment(new Date(date));

  var steps = [
    { operation: StepFunctions.datePortions },
    { operation: StepFunctions.getCentury },
    { operation: StepFunctions.getCenturyKeyDay },
    { operation: StepFunctions.getKeySum },
    { operation: StepFunctions.getKeyDay },
    { operation: StepFunctions.getKeyDayOfMonth },
    { operation: StepFunctions.getDaysApart },
    { operation: StepFunctions.getDayOfWeek },
  ];

  var data = steps.reduce(function (accum, step) {
    accum = step.operation(date, accum);
    return accum;
  }, {});

  var dayOfWeek = Days.get(date.day());

  if (data.dayOfWeek !== dayOfWeek) {
    throw "Algorithm is busted!";
  }

  return data;
};

module.exports.Sunday = Days.Sunday;
module.exports.Monday = Days.Monday;
module.exports.Tuesday = Days.Tuesday;
module.exports.Wednesday = Days.Wednesday;
module.exports.Thursday = Days.Thursday;
module.exports.Friday = Days.Friday;
module.exports.Saturday = Days.Saturday;

module.exports.Days = Days;

var getCenturyKeyDay = function (year) {
  var centuryYear = getCentury(year);
  var index = moment([centuryYear, 2, 1]).subtract(1, "day").day();
  return Days.get(index);
}

var getCentury = function (year) {
  return Math.floor(year / 100) * 100;
}

var StepFunctions = {
  datePortions: function (date, previous) {
    date = moment(date);
    return {
      day: date.date(),
      month: date.month() + 1,
      year: date.year(),
    };
  },
  getCentury: function (date, previous) {
    previous.century = getCentury(previous.year);
    return previous;
  },
  getCenturyKeyDay: function (date, previous) {
    previous.centuryKeyDay = getCenturyKeyDay(previous.year);
    return previous;
  },
  getKeySum: function (date, previous) {
    var num = previous.year - previous.century;
    previous.twelves = Math.floor(num / 12);
    previous.remainder = num % 12;
    previous.fours = Math.floor(previous.remainder / 4);
    previous.keySum = previous.twelves + previous.remainder + previous.fours;
    previous.reducedKeySum = previous.keySum % 7;
    return previous;
  },
  getKeyDay: function (date, previous) {
    previous.keyDay = previous.centuryKeyDay.forward(previous.reducedKeySum);
    return previous;
  },
  getKeyDayOfMonth: function (date, previous) {
    if (previous.month < 3) {
      previous.leapYear = moment([previous.year]).isLeapYear();
      if (previous.month == 1) {
        previous.keyDayOfMonth = previous.leapYear ? 4 : 3;
      } else {
        previous.keyDayOfMonth = previous.leapYear ? 1 : 7;
      }
    } else if (previous.month % 2 == 0) {
      previous.keyDayOfMonth = previous.month;
    } else {
      var map = {
        5: 9,
        7: 11,
        9: 5,
        11: 7
      };
      previous.keyDayOfMonth =  map[previous.month];
    }

    return previous;
  },
  getDaysApart: function (date, previous) {
    previous.daysApart = previous.day - previous.keyDayOfMonth;
    previous.reducedDaysApart = previous.daysApart % 7;
    return previous;
  },
  getDayOfWeek: function (date, previous) {
    if (previous.daysApart >= 0) {
      previous.dayOfWeek = previous.keyDay.forward(previous.daysApart);
    } else {
      previous.dayOfWeek = previous.keyDay.back(0 - previous.daysApart);
    }
    return previous;
  }
};

var keyDateForYear = function (date, sum)
{
  var year = moment(date).year();
  var ckd = getCenturyKeyDay(year);
  return ckd.forward(sum);
}

