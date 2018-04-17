"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var assert_1 = require("assert");
var variableDiff = require("variable-diff");
function checkEqual(completeStore, assert, interval, comparator) {
    var usingCustomComparator = comparator !== assert_1.deepEqual;
    var failReasons = [];
    if (completeStore['actual'].length !== completeStore['expected'].length) {
        failReasons.push("Length of actual and expected differs");
    }
    completeStore['actual'].forEach(function (actual, index) {
        var expected = completeStore['expected'][index];
        if (actual === undefined) {
            failReasons.push("Actual at index " + index + " was undefined");
            return;
        }
        if (expected === undefined) {
            failReasons.push("Expected at index " + index + " was undefined");
            return;
        }
        if (actual.type !== expected.type) {
            failReasons.push("Expected type " + expected.type + " at time " + actual.time + " but got " + actual.type);
        }
        if (actual.type === 'complete') {
            var rightTime = diagramFrame(actual.time, interval) ===
                diagramFrame(expected.time, interval);
            if (!rightTime) {
                failReasons.push("Expected stream to complete at " + expected.time + " but completed at " + actual.time);
            }
        }
        if (actual.type === 'next') {
            var rightTime = diagramFrame(actual.time, interval) ===
                diagramFrame(expected.time, interval);
            var rightValue = true;
            try {
                var comparatorResult = comparator(actual.value, expected.value);
                if (typeof comparatorResult === 'boolean') {
                    rightValue = comparatorResult;
                }
            }
            catch (error) {
                rightValue = false;
                assert.unexpectedErrors.push(error);
            }
            if (rightValue && !rightTime) {
                failReasons.push("Right value at wrong time, expected at " + expected.time + " but " +
                    ("happened at " + actual.time + " (" + JSON.stringify(actual.value) + ")"));
            }
            if (!rightTime || !rightValue) {
                var errorMessage = [
                    "Expected value at time " + expected.time + " but got different value at " + actual.time + "\n",
                ];
                if (usingCustomComparator) {
                    var message = "Expected " + JSON.stringify(expected.value) + ", got " + JSON.stringify(actual.value);
                    errorMessage.push(message);
                }
                else {
                    var diffMessage = [
                        "Diff (actual => expected):",
                        variableDiff(actual.value, expected.value).text,
                    ].join('\n');
                    errorMessage.push(diffMessage);
                }
                failReasons.push(errorMessage.join('\n'));
            }
        }
        if (actual.type === 'error') {
            var rightTime = diagramFrame(actual.time, interval) ===
                diagramFrame(expected.time, interval);
            var pass = true;
            if (expected.type !== 'error') {
                pass = false;
            }
            if (!rightTime) {
                pass = false;
            }
            if (!pass) {
                failReasons.push("Unexpected error occurred");
                assert.unexpectedErrors.push(actual.error);
            }
        }
    });
    if (failReasons.length === 0) {
        assert.state = 'passed';
    }
    else {
        assert.state = 'failed';
        assert.error = new Error(strip("\nExpected\n\n" + diagramString(completeStore['expected'], interval) + "\n\nGot\n\n" + diagramString(completeStore['actual'], interval) + "\n\nFailed because:\n\n" + failReasons.map(function (reason) { return " * " + reason; }).join('\n') + "\n\n" + displayUnexpectedErrors(assert.unexpectedErrors) + "\n    "));
    }
}
function makeAssertEqual(timeSource, schedule, currentTime, interval, addAssert) {
    return function assertEqual(actual, expected, comparator) {
        if (comparator === void 0) { comparator = assert_1.deepEqual; }
        var completeStore = {};
        var Time = timeSource();
        var assert = {
            state: 'pending',
            error: null,
            unexpectedErrors: [],
            finish: function () {
                checkEqual(completeStore, assert, interval, comparator);
            },
        };
        addAssert(assert);
        var actualLog$ = Time.record(actual);
        var expectedLog$ = Time.record(expected);
        xstream_1.default
            .combine(xstream_1.default.fromObservable(actualLog$), xstream_1.default.fromObservable(expectedLog$))
            .addListener({
            next: function (_a) {
                var aLog = _a[0], bLog = _a[1];
                completeStore['actual'] = aLog;
                completeStore['expected'] = bLog;
            },
            complete: function () {
                checkEqual(completeStore, assert, interval, comparator);
            },
        });
    };
}
exports.makeAssertEqual = makeAssertEqual;
function fill(array, value) {
    var i = 0;
    while (i < array.length) {
        array[i] = value;
        i++;
    }
    return array;
}
function diagramFrame(time, interval) {
    return Math.ceil(time / interval);
}
function chunkBy(values, f) {
    function chunkItGood(_a, value) {
        var items = _a.items, previousValue = _a.previousValue;
        var v = f(value);
        if (v !== previousValue) {
            return {
                items: items.concat([[value]]),
                previousValue: v,
            };
        }
        var lastItem = items[items.length - 1];
        return {
            items: items.slice(0, -1).concat([lastItem.concat(value)]),
            previousValue: previousValue,
        };
    }
    return values.reduce(chunkItGood, { items: [], previousValue: undefined })
        .items;
}
function characterString(entry) {
    if (entry.type === 'next') {
        return stringifyIfObject(entry.value);
    }
    if (entry.type === 'complete') {
        return '|';
    }
    if (entry.type === 'error') {
        return '#';
    }
}
function diagramString(entries, interval) {
    if (entries.length === 0) {
        return '<empty stream>';
    }
    var maxTime = Math.max.apply(Math, entries.map(function (entry) { return entry.time; }));
    var characterCount = Math.ceil(maxTime / interval);
    var diagram = fill(new Array(characterCount), '-');
    var chunks = chunkBy(entries, function (entry) {
        return Math.max(0, Math.floor(entry.time / interval));
    });
    chunks.forEach(function (chunk) {
        var characterIndex = Math.max(0, Math.floor(chunk[0].time / interval));
        if (chunk.length === 1) {
            diagram[characterIndex] = characterString(chunk[0]);
        }
        else {
            var characters = ['('].concat(chunk.map(characterString), [')']);
            characters.forEach(function (character, subIndex) {
                diagram[characterIndex + subIndex] = character;
            });
        }
    });
    return diagram.join('');
}
function strip(str) {
    var lines = str.split('\n');
    return lines.map(function (line) { return line.replace(/^\s{12}/, ''); }).join('\n');
}
function stringifyIfObject(value) {
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return value;
}
function displayUnexpectedErrors(errors) {
    if (errors.length === 0) {
        return "";
    }
    var messages = errors.map(function (error) { return error.stack; }).join('\n \n ');
    return "Unexpected error:\n " + messages;
}
//# sourceMappingURL=assert-equal.js.map