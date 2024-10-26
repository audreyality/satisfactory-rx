import { Connection } from "./connection";
import { Ticks } from "../system/time";

const resources = [
    {
        id: "iron-ore",
        connection: "belt"
    }, {
        id: "iron-alloy",
        connection: "belt"
    }, {
        id: "power",
        connection: "pole"
    }, {
        id: "water",
        connection: "pipe"
    }
] as const;

export type Resource = typeof resources[number]["id"];

export type ResourceInfo = {
    id: Resource,
    connection: Connection
}

export const Resources = Object.fromEntries(
    resources.map(r => [r.id, r])
) as Readonly<Record<Resource, ResourceInfo>>;

export type ResourceQty = {
    resource: Resource,
    quantity: number
}

export type Recipe = {
    requires: ResourceQty[],
    produces: ResourceQty[],
    throttle: Ticks
}