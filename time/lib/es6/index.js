import { timeDriver as timeDriverUntyped } from './src/time-driver';
import { mockTimeSource as mockTimeSourceUntyped } from './src/mock-time-source';
function mockTimeSource(args) {
    return mockTimeSourceUntyped(args);
}
function timeDriver(sink) {
    return timeDriverUntyped(sink);
}
export { timeDriver, mockTimeSource };
//# sourceMappingURL=index.js.map