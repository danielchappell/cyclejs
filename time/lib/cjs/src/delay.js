"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var adapt_1 = require("@cycle/run/lib/adapt");
function makeDelayListener(schedule, currentTime, delayTime, listener) {
    var delayedTime = function () { return currentTime() + delayTime; };
    return {
        next: function (value) {
            schedule.next(listener, delayedTime(), value);
        },
        error: function (error) {
            schedule.error(listener, delayedTime(), error);
        },
        complete: function () {
            schedule.complete(listener, delayedTime());
        },
    };
}
function makeDelay(createOperator) {
    var _a = createOperator(), schedule = _a.schedule, currentTime = _a.currentTime;
    return function delay(delayTime) {
        return function delayOperator(stream) {
            var producer = {
                start: function (listener) {
                    var delayListener = makeDelayListener(schedule, currentTime, delayTime, listener);
                    xstream_1.default.fromObservable(stream).addListener(delayListener);
                },
                stop: function () { },
            };
            return adapt_1.adapt(xstream_1.default.create(producer));
        };
    };
}
exports.makeDelay = makeDelay;
//# sourceMappingURL=delay.js.map