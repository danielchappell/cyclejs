"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var adapt_1 = require("@cycle/run/lib/adapt");
function makeDebounceListener(schedule, currentTime, debounceInterval, listener, state) {
    return {
        next: function (value) {
            var scheduledEntry = state.scheduledEntry;
            var timeToSchedule = currentTime() + debounceInterval;
            if (scheduledEntry) {
                var timeAfterPrevious = timeToSchedule - scheduledEntry.time;
                if (timeAfterPrevious <= debounceInterval) {
                    scheduledEntry.cancelled = true;
                }
            }
            state.scheduledEntry = schedule.next(listener, timeToSchedule, value);
        },
        error: function (e) {
            listener.error(e);
        },
        complete: function () {
            listener.complete();
        },
    };
}
function makeDebounce(createOperator) {
    var _a = createOperator(), schedule = _a.schedule, currentTime = _a.currentTime;
    return function debounce(debounceInterval) {
        return function debounceOperator(stream) {
            var state = { scheduledEntry: null };
            var debouncedStream = xstream_1.default.create({
                start: function (listener) {
                    var debounceListener = makeDebounceListener(schedule, currentTime, debounceInterval, listener, state);
                    xstream_1.default.fromObservable(stream).addListener(debounceListener);
                },
                // TODO - maybe cancel the scheduled event?
                stop: function () { },
            });
            return adapt_1.adapt(debouncedStream);
        };
    };
}
exports.makeDebounce = makeDebounce;
//# sourceMappingURL=debounce.js.map