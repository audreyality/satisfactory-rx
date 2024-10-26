import { Resource } from "./resource";
import { Ticks } from "./ticks";

export type ProductionStage = "Loading" | "Processing" | "Emptying";
export type ProductionStatus = "Running" | "Backpressure" | "Blocked" | "Stopped";

export type ResourceQty = {
    resource: Resource,
    quantity: number
};

export type Recipe = {
    requires: ResourceQty[],
    produces: ResourceQty[],
    throttle: Ticks
};
