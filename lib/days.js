/*eslint-env es6 */

"use strict";


var moment = require("moment");

var Days = {
  days: {},
  set: function (idx, day) {
    this.days[idx] = day;
  },
  get: function (idx) {
    return this.days[idx];
  }
};

class Day {
  constructor(index, name) {
    this.index = index;
    this.name = name;
  }

  forward(days) {
    var idx = (this.index + days) % 7;
    return Days.get(idx);
  }

  back (days) {
    var steps = days % 7;
    var add = 7 - steps;
    return this.forward(add);
  }
};

class Sunday extends Day {
  constructor() {
    super(0, "Sunday");
  }
}

class Monday extends Day {
  constructor() {
    super(1, "Monday");
  }
}

class Tuesday extends Day {
  constructor() {
    super(2, "Tuesday");
  }
}

class Wednesday extends Day {
  constructor() {
    super(3, "Wednesday");
  }
}

class Thursday extends Day {
  constructor() {
    super(4, "Thursday");
  }
}

class Friday extends Day {
  constructor() {
    super(5, "Friday");
  }
}

class Saturday extends Day {
  constructor() {
    super(6, "Saturday");
  }
}

Days.set(0, new Sunday());
Days.set(1, new Monday());
Days.set(2, new Tuesday());
Days.set(3, new Wednesday());
Days.set(4, new Thursday());
Days.set(5, new Friday());
Days.set(6, new Saturday());

exports.Sunday = Days.get(0);
exports.Monday = Days.get(1);
exports.Tuesday = Days.get(2);
exports.Wednesday = Days.get(3);
exports.Thursday = Days.get(4);
exports.Friday = Days.get(5);
exports.Saturday = Days.get(6);
exports.get = Days.get.bind(Days);
