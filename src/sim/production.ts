import { Resource } from "./resource";
import { Tick } from "./tick";

export type ProductionStage = "Loading" | "Processing" | "Emptying";
export type ProductionStatus = "Running" | "Backpressure" | "Blocked" | "Stopped";

export type InventoryError = {
    type: "inventory",
    kind: "error",
    resource: Resource,
    actual: Resource,
    current?: number,
    target?: number
}

export type InventoryReport = {
    type: "inventory",
    kind: "report",
    resource: Resource,
    current: number,
    target: number
}

export type ResourceQty = {
    resource: Resource,
    quantity: number
};

export type Recipe = {
    requires: ResourceQty[],
    produces: ResourceQty[],
    throttle: Tick
};
