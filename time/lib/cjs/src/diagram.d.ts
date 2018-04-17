import xs from 'xstream';
declare function makeDiagram(schedule: any, currentTime: () => number, interval: number, setMaxTime: any): (diagramString: string, values?: {}) => xs<any>;
export { makeDiagram };
