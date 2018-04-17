import xs from 'xstream';
declare function makeRecord(schedule: any, currentTime: () => number, interval: number): (stream: xs<any>) => xs<any>;
export { makeRecord };
