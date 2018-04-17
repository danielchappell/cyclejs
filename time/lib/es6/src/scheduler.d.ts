import { Listener } from 'xstream';
export interface Schedule<T> {
    shiftNextEntry(): T | undefined;
    isEmpty(): boolean;
    peek(): T | undefined;
    add: Scheduler<T>;
}
export declare type PostEventCallback<T> = (event: any, time: number, schedule: Scheduler<T>, currentTime: () => number) => void;
export interface Scheduler<T> {
    _schedule: any;
    next(listener: Listener<T>, time: number, value: T, callback?: PostEventCallback<T>): void;
    error(listener: Listener<T>, time: number, error: Error): void;
    complete(listener: Listener<T>, time: number): void;
}
declare function makeScheduler<T>(): Schedule<T>;
export { makeScheduler };
