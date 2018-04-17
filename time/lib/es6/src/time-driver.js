import { makeScheduler } from './scheduler';
import { makeDelay } from './delay';
import { makeDebounce } from './debounce';
import { makePeriodic } from './periodic';
import { makeThrottle } from './throttle';
import { makeAnimationFrames } from './animation-frames';
import { makeThrottleAnimation } from './throttle-animation';
import { runVirtually } from './run-virtually';
import * as requestAnimationFrame from 'raf';
import * as now from 'performance-now';
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
    var scheduler = makeScheduler();
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
        animationFrames: makeAnimationFrames(addFrameCallback, currentTime),
        delay: makeDelay(createOperator),
        debounce: makeDebounce(createOperator),
        periodic: makePeriodic(createOperator),
        throttle: makeThrottle(createOperator),
        throttleAnimation: makeThrottleAnimation(function () { return timeSource; }, scheduler.add, currentTime),
        _time: currentTime,
        _scheduler: scheduler.add,
        _pause: pause,
        _resume: resume,
        _runVirtually: function (done, timeToRunTo) {
            // TODO - frameCallbacks?
            runVirtually(scheduler, done, currentTime, setTime, timeToRunTo);
        },
        dispose: pause,
        createOperator: createOperator,
    };
    return timeSource;
}
export { timeDriver };
//# sourceMappingURL=time-driver.js.map