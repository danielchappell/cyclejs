"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var adapt_1 = require("@cycle/run/lib/adapt");
var xstream_1 = require("xstream");
function parseIntIfDecimal(str) {
    if (str.match(/[0-9]/)) {
        return parseInt(str, 10);
    }
    return str;
}
function makeDiagram(schedule, currentTime, interval, setMaxTime) {
    return function diagram(diagramString, values) {
        if (values === void 0) { values = {}; }
        var characters = diagramString.split('');
        var stream = xstream_1.default.create();
        function valueFor(character) {
            if (character in values) {
                return values[character];
            }
            return parseIntIfDecimal(character);
        }
        setMaxTime(diagramString.length * interval);
        var multipleValueFrame = false;
        characters.forEach(function (character, index) {
            if (character === '-') {
                return;
            }
            var timeToSchedule = index * interval;
            if (character === '(') {
                multipleValueFrame = timeToSchedule;
                return;
            }
            if (character === ')') {
                multipleValueFrame = false;
                return;
            }
            if (multipleValueFrame !== false) {
                timeToSchedule = multipleValueFrame;
            }
            if (character === '|') {
                schedule.complete(stream, timeToSchedule);
            }
            else if (character === '#') {
                schedule.error(stream, timeToSchedule, new Error("scheduled error"));
            }
            else {
                schedule.next(stream, timeToSchedule, valueFor(character));
            }
        });
        return adapt_1.adapt(stream);
    };
}
exports.makeDiagram = makeDiagram;
//# sourceMappingURL=diagram.js.map