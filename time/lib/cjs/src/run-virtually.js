"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line no-import-side-effect
require("setimmediate");
function processEvent(args) {
    var scheduler = args.scheduler, done = args.done, currentTime = args.currentTime, setTime = args.setTime, timeToRunTo = args.timeToRunTo;
    var nextEvent = scheduler.peek();
    var outOfTime = nextEvent && timeToRunTo && nextEvent.time >= timeToRunTo;
    if (!nextEvent || outOfTime) {
        done();
        return;
    }
    var eventToProcess = scheduler.shiftNextEntry();
    if (eventToProcess.cancelled) {
        setImmediate(processEvent, args);
        return;
    }
    var time = eventToProcess.time;
    setTime(time);
    if (eventToProcess.f) {
        eventToProcess.f(eventToProcess, time, scheduler.add, currentTime);
    }
    if (eventToProcess.type === 'next') {
        eventToProcess.stream.shamefullySendNext(eventToProcess.value);
    }
    if (eventToProcess.type === 'error') {
        eventToProcess.stream.shamefullySendError(eventToProcess.error);
    }
    if (eventToProcess.type === 'complete') {
        eventToProcess.stream.shamefullySendComplete();
    }
    setImmediate(processEvent, args);
}
function runVirtually(scheduler, done, currentTime, setTime, timeToRunTo) {
    if (timeToRunTo === void 0) { timeToRunTo = 0; }
    var args = { scheduler: scheduler, done: done, currentTime: currentTime, setTime: setTime, timeToRunTo: timeToRunTo };
    setImmediate(processEvent, args);
}
exports.runVirtually = runVirtually;
//# sourceMappingURL=run-virtually.js.map