import xs from 'xstream';
import { OperatorArgs } from './types';
declare function makeDebounce(createOperator: () => OperatorArgs<any>): (debounceInterval: number) => <T>(stream: xs<T>) => xs<T>;
export { makeDebounce };
