"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sorted_immutable_list_1 = require("sorted-immutable-list");
var comparator = function (a) { return function (b) {
    if (a.time < b.time) {
        return -1;
    }
    if (a.time === b.time) {
        // In the case where a complete and next event occur in the same frame,
        // the next always comes before the complete
        if (a.stream === b.stream) {
            if (a.type === 'complete' && b.type === 'next') {
                return 1;
            }
            if (b.type === 'complete' && a.type === 'next') {
                return -1;
            }
        }
    }
    return 1;
}; };
function makeScheduler() {
    var schedule = [];
    function getSchedule() {
        return schedule;
    }
    var addScheduleEntry = sorted_immutable_list_1.default({
        comparator: comparator,
        unique: false,
    });
    function scheduleEntry(newEntry) {
        schedule = addScheduleEntry(schedule, newEntry);
        return newEntry;
    }
    function noop() { }
    return {
        shiftNextEntry: function () {
            return schedule.shift();
        },
        isEmpty: function () {
            return schedule.length === 0;
        },
        peek: function () {
            return schedule[0];
        },
        add: {
            _schedule: getSchedule,
            next: function (stream, time, value, f) {
                if (f === void 0) { f = noop; }
                return scheduleEntry({
                    type: 'next',
                    stream: stream,
                    time: time,
                    value: value,
                    f: f,
                });
            },
            error: function (stream, time, error) {
                return scheduleEntry({
                    type: 'error',
                    stream: stream,
                    time: time,
                    error: error,
                });
            },
            complete: function (stream, time) {
                return scheduleEntry({
                    type: 'complete',
                    stream: stream,
                    time: time,
                });
            },
        },
    };
}
exports.makeScheduler = makeScheduler;
//# sourceMappingURL=scheduler.js.map