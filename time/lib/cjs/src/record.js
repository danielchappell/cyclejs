"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var adapt_1 = require("@cycle/run/lib/adapt");
function recordListener(currentTime, outListener) {
    var entries = [];
    outListener.next(entries);
    return {
        next: function (ev) {
            entries = entries.concat({ type: 'next', value: ev, time: currentTime() });
            outListener.next(entries);
        },
        error: function (error) {
            entries = entries.concat({ type: 'error', time: currentTime(), error: error });
            outListener.next(entries);
            outListener.complete();
        },
        complete: function () {
            entries = entries.concat({ type: 'complete', time: currentTime() });
            outListener.next(entries);
            outListener.complete();
        },
    };
}
function makeRecord(schedule, currentTime, interval) {
    return function record(stream) {
        var recordedStream = xstream_1.default.createWithMemory({
            start: function (listener) {
                xstream_1.default
                    .fromObservable(stream)
                    .addListener(recordListener(currentTime, listener));
            },
            stop: function () { },
        });
        return adapt_1.adapt(recordedStream);
    };
}
exports.makeRecord = makeRecord;
//# sourceMappingURL=record.js.map