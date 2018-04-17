import xs from 'xstream';
import { OperatorArgs } from './types';
declare function makeDelay(createOperator: () => OperatorArgs<any>): (delayTime: number) => <T>(stream: xs<T>) => xs<T>;
export { makeDelay };
