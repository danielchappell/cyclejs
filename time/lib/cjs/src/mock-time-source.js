"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scheduler_1 = require("./scheduler");
var delay_1 = require("./delay");
var debounce_1 = require("./debounce");
var periodic_1 = require("./periodic");
var throttle_1 = require("./throttle");
var diagram_1 = require("./diagram");
var assert_equal_1 = require("./assert-equal");
var throttle_animation_1 = require("./throttle-animation");
var record_1 = require("./record");
var run_virtually_1 = require("./run-virtually");
var combineErrors = require("combine-errors");
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
    var scheduler = scheduler_1.makeScheduler();
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
        diagram: diagram_1.makeDiagram(scheduler.add, currentTime, interval, setMaxTime),
        record: record_1.makeRecord(scheduler.add, currentTime, interval),
        assertEqual: assert_equal_1.makeAssertEqual(function () { return timeSource; }, scheduler.add, currentTime, interval, addAssert),
        delay: delay_1.makeDelay(createOperator),
        debounce: debounce_1.makeDebounce(createOperator),
        periodic: periodic_1.makePeriodic(createOperator),
        throttle: throttle_1.makeThrottle(createOperator),
        animationFrames: function () { return timeSource.periodic(16).map(frame); },
        throttleAnimation: throttle_animation_1.makeThrottleAnimation(function () { return timeSource; }, scheduler.add, currentTime),
        run: function (doneCallback, timeToRunTo) {
            if (doneCallback === void 0) { doneCallback = raiseError; }
            if (timeToRunTo === void 0) { timeToRunTo = 0; }
            done = doneCallback;
            if (!timeToRunTo) {
                timeToRunTo = maxTime;
            }
            run_virtually_1.runVirtually(scheduler, function () { return finish(asserts, done); }, currentTime, setTime, timeToRunTo);
        },
        createOperator: createOperator,
        _scheduler: scheduler.add,
        _time: currentTime,
    };
    return timeSource;
}
exports.mockTimeSource = mockTimeSource;
function frame(i) {
    return {
        time: i * 16,
        delta: 16,
        normalizedDelta: 1,
    };
}
//# sourceMappingURL=mock-time-source.js.map