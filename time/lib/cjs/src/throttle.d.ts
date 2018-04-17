import xs from 'xstream';
import { OperatorArgs } from './types';
declare function makeThrottle(createOperator: () => OperatorArgs<any>): (period: number) => <T>(stream: xs<T>) => xs<T>;
export { makeThrottle };
