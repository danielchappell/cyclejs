import { VNode } from 'snabbdom/vnode';
export declare class VNodeWrapper {
    rootElement: Element | DocumentFragment;
    constructor(rootElement: Element | DocumentFragment);
    call(vnode: VNode | null): VNode;
    private wrapDocFrag(children);
    private wrap(children);
}
