import xs from 'xstream';
declare function makeAssertEqual(timeSource: any, schedule: any, currentTime: () => number, interval: number, addAssert: any): (actual: xs<any>, expected: xs<any>, comparator?: {
    (actual: any, expected: any, message?: string | undefined): void;
    (actual: any, expected: any, message?: string | undefined): void;
}) => void;
export { makeAssertEqual };
