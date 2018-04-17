import { Scheduler } from './scheduler';
export declare type Comparator = (actual: any, expected: any) => void | boolean;
export declare type OperatorArgs<T> = {
    schedule: Scheduler<T>;
    currentTime(): number;
};
