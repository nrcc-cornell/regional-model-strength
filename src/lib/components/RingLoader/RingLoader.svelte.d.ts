// Code from svelte-loading-spinners, copied and adapted to avoid svelte closing tag warnings

import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        color?: string | undefined;
        unit?: string | undefined;
        duration?: string | undefined;
        size?: string | number | undefined;
        pause?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type RingLoaderProps = typeof __propDef.props;
export declare type RingLoaderEvents = typeof __propDef.events;
export declare type RingLoaderSlots = typeof __propDef.slots;
export default class RingLoader extends SvelteComponentTyped<RingLoaderProps, RingLoaderEvents, RingLoaderSlots> {
}
export {};
