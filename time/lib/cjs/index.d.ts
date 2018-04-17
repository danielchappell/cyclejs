import { TimeSource, MockTimeSource, Operator } from './src/time-source';
declare function mockTimeSource(args?: Object): MockTimeSource;
declare function timeDriver(sink: any): TimeSource;
export { Operator, TimeSource, timeDriver, MockTimeSource, mockTimeSource };
