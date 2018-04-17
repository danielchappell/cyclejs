"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var adapt_1 = require("@cycle/run/lib/adapt");
var EXPECTED_DELTA = 1000 / 60;
function makeAnimationFrames(addFrameCallback, currentTime) {
    return function animationFrames() {
        var frame = {
            time: 0,
            delta: 16,
            normalizedDelta: 1,
        };
        var stopped = false;
        var frameStream = xstream_1.default.create({
            start: function (listener) {
                frame.time = currentTime();
                function nextFrame() {
                    if (stopped) {
                        return;
                    }
                    var oldTime = frame.time;
                    frame.time = currentTime();
                    frame.delta = frame.time - oldTime;
                    frame.normalizedDelta = frame.delta / EXPECTED_DELTA;
                    listener.next(frame);
                    addFrameCallback(nextFrame);
                }
                addFrameCallback(nextFrame);
            },
            stop: function () {
                stopped = true;
            },
        });
        return adapt_1.adapt(frameStream);
    };
}
exports.makeAnimationFrames = makeAnimationFrames;
//# sourceMappingURL=animation-frames.js.map