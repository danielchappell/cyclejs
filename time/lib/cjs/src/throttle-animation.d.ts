import xs from 'xstream';
declare function makeThrottleAnimation(timeSource: any, schedule: any, currentTime: () => number): <T>(stream: xs<T>) => xs<T>;
export { makeThrottleAnimation };
