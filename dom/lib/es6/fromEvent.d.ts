import { Stream } from 'xstream';
export declare type Predicate = (ev: any) => boolean;
export declare type PreventDefaultOpt = boolean | Predicate | Comparator;
export declare type Comparator = {
    [key: string]: any;
};
export declare function fromEvent(element: Element | Document, eventName: string, useCapture?: boolean, preventDefault?: PreventDefaultOpt): Stream<Event>;
export declare function preventDefaultConditional(event: any, preventDefault: PreventDefaultOpt): void;
