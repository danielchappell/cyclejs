"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scheduler_1 = require("./scheduler");
var delay_1 = require("./delay");
var debounce_1 = require("./debounce");
var periodic_1 = require("./periodic");
var throttle_1 = require("./throttle");
var animation_frames_1 = require("./animation-frames");
var throttle_animation_1 = require("./throttle-animation");
var run_virtually_1 = require("./run-virtually");
var requestAnimationFrame = require("raf");
var now = require("performance-now");
function popAll(array) {
    var poppedItems = [];
    while (array.length > 0) {
        poppedItems.push(array.pop());
    }
    return poppedItems;
}
function runRealtime(scheduler, frameCallbacks, currentTime, setTime) {
    var paused = false;
    var pause = function () { return (paused = true); };
    var resume = function (time) {
        setTime(time);
        paused = false;
    };
    function processFrameCallbacks(time) {
        if (paused) {
            requestAnimationFrame(processFrameCallbacks);
            return;
        }
        setTime(time);
        var currentCallbacks = popAll(frameCallbacks);
        currentCallbacks.forEach(function (callback) { return callback(time); });
        requestAnimationFrame(processFrameCallbacks);
    }
    requestAnimationFrame(processFrameCallbacks);
    function processEvent() {
        if (paused) {
            return;
        }
        var time = now();
        setTime(time);
        if (scheduler.isEmpty()) {
            return;
        }
        var nextEventTime = scheduler.peek().time;
        while (nextEventTime < time) {
            var eventToProcess = scheduler.shiftNextEntry();
            if (!eventToProcess.cancelled) {
                if (eventToProcess.f) {
                    eventToProcess.f(eventToProcess, time, scheduler.add, currentTime);
                }
                if (eventToProcess.type === 'next') {
                    eventToProcess.stream.shamefullySendNext(eventToProcess.value);
                }
                else if (eventToProcess.type === 'complete') {
                    eventToProcess.stream.shamefullySendComplete();
                }
                else if (eventToProcess.type === 'error') {
                    eventToProcess.stream.shamefullySendError(eventToProcess.error);
                }
                else {
                    throw new Error('Unhandled event type: ' + eventToProcess.type);
                }
            }
            nextEventTime = (scheduler.peek() && scheduler.peek().time) || Infinity;
        }
    }
    setInterval(processEvent, 10);
    return { pause: pause, resume: resume };
}
function timeDriver(sink) {
    var time = 0;
    var frameCallbacks = [];
    var scheduler = scheduler_1.makeScheduler();
    function currentTime() {
        return time;
    }
    function setTime(newTime) {
        time = newTime;
    }
    function addFrameCallback(callback) {
        frameCallbacks.push(callback);
    }
    // TODO - cancel requestAnimationFrame on dispose
    var _a = runRealtime(scheduler, frameCallbacks, currentTime, setTime), pause = _a.pause, resume = _a.resume;
    function createOperator() {
        return { schedule: scheduler.add, currentTime: currentTime };
    }
    var timeSource = {
        animationFrames: animation_frames_1.makeAnimationFrames(addFrameCallback, currentTime),
        delay: delay_1.makeDelay(createOperator),
        debounce: debounce_1.makeDebounce(createOperator),
        periodic: periodic_1.makePeriodic(createOperator),
        throttle: throttle_1.makeThrottle(createOperator),
        throttleAnimation: throttle_animation_1.makeThrottleAnimation(function () { return timeSource; }, scheduler.add, currentTime),
        _time: currentTime,
        _scheduler: scheduler.add,
        _pause: pause,
        _resume: resume,
        _runVirtually: function (done, timeToRunTo) {
            // TODO - frameCallbacks?
            run_virtually_1.runVirtually(scheduler, done, currentTime, setTime, timeToRunTo);
        },
        dispose: pause,
        createOperator: createOperator,
    };
    return timeSource;
}
exports.timeDriver = timeDriver;
//# sourceMappingURL=time-driver.js.map