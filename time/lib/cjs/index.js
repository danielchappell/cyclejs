"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var time_driver_1 = require("./src/time-driver");
var mock_time_source_1 = require("./src/mock-time-source");
function mockTimeSource(args) {
    return mock_time_source_1.mockTimeSource(args);
}
exports.mockTimeSource = mockTimeSource;
function timeDriver(sink) {
    return time_driver_1.timeDriver(sink);
}
exports.timeDriver = timeDriver;
//# sourceMappingURL=index.js.map