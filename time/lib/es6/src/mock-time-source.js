import { makeScheduler } from './scheduler';
import { makeDelay } from './delay';
import { makeDebounce } from './debounce';
import { makePeriodic } from './periodic';
import { makeThrottle } from './throttle';
import { makeDiagram } from './diagram';
import { makeAssertEqual } from './assert-equal';
import { makeThrottleAnimation } from './throttle-animation';
import { makeRecord } from './record';
import { runVirtually } from './run-virtually';
import * as combineErrors from 'combine-errors';
function raiseError(err) {
    if (err) {
        throw err;
    }
}
function finish(asserts, done) {
    var pendingAsserts = asserts.filter(function (assert) { return assert.state === 'pending'; });
    pendingAsserts.forEach(function (assert) { return assert.finish(); });
    var failedAsserts = asserts.filter(function (assert) { return assert.state === 'failed'; });
    var success = failedAsserts.length === 0;
    if (success) {
        done();
    }
    else {
        var errors = failedAsserts.map(function (assert) { return assert.error; });
        var error = combineErrors(errors);
        var usingJasmine = 'fail' in done;
        if (usingJasmine) {
            done.fail(error);
        }
        else {
            done(error);
        }
    }
}
function mockTimeSource(_a) {
    var _b = (_a === void 0 ? {} : _a).interval, interval = _b === void 0 ? 20 : _b;
    var time = 0;
    var maxTime = 0;
    var asserts = [];
    var done;
    var scheduler = makeScheduler();
    function addAssert(assert) {
        asserts.push(assert);
    }
    function currentTime() {
        return time;
    }
    function setTime(newTime) {
        time = newTime;
    }
    function setMaxTime(newTime) {
        maxTime = Math.max(newTime, maxTime);
    }
    function createOperator() {
        return { schedule: scheduler.add, currentTime: currentTime };
    }
    var timeSource = {
        diagram: makeDiagram(scheduler.add, currentTime, interval, setMaxTime),
        record: makeRecord(scheduler.add, currentTime, interval),
        assertEqual: makeAssertEqual(function () { return timeSource; }, scheduler.add, currentTime, interval, addAssert),
        delay: makeDelay(createOperator),
        debounce: makeDebounce(createOperator),
        periodic: makePeriodic(createOperator),
        throttle: makeThrottle(createOperator),
        animationFrames: function () { return timeSource.periodic(16).map(frame); },
        throttleAnimation: makeThrottleAnimation(function () { return timeSource; }, scheduler.add, currentTime),
        run: function (doneCallback, timeToRunTo) {
            if (doneCallback === void 0) { doneCallback = raiseError; }
            if (timeToRunTo === void 0) { timeToRunTo = 0; }
            done = doneCallback;
            if (!timeToRunTo) {
                timeToRunTo = maxTime;
            }
            runVirtually(scheduler, function () { return finish(asserts, done); }, currentTime, setTime, timeToRunTo);
        },
        createOperator: createOperator,
        _scheduler: scheduler.add,
        _time: currentTime,
    };
    return timeSource;
}
function frame(i) {
    return {
        time: i * 16,
        delta: 16,
        normalizedDelta: 1,
    };
}
export { mockTimeSource };
//# sourceMappingURL=mock-time-source.js.map