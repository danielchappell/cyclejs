import xs from 'xstream';
export declare type Frame = {
    delta: number;
    normalizedDelta: number;
    time: number;
};
declare function makeAnimationFrames(addFrameCallback: any, currentTime: () => number): () => xs<Frame>;
export { makeAnimationFrames };
