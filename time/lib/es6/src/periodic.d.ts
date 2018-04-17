import xs from 'xstream';
import { OperatorArgs } from './types';
declare function makePeriodic(createOperator: () => OperatorArgs<any>): (period: number) => xs<number>;
export { makePeriodic };
