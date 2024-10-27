import { Connection } from "./connection";
import { Tick } from "./tick";

const resources = [
    {
        id: "iron-ore",
        connection: "belt",
        icon: "resource-iron-ore",
    }, {
        id: "iron-alloy",
        connection: "belt",
        icon: "resource-iron-alloy",
    }, {
        id: "power",
        connection: "pole",
        icon: "resource-power",
    }, {
        id: "water",
        connection: "pipe",
        icon: "resource-water",
    }
] as const;

export type Resource = typeof resources[number]["id"];

export type ResourceInfo = {
    id: Resource,
    icon: string,
    connection: Connection
}

export const Resources = Object.fromEntries(
    resources.map(r => [r.id, r])
) as Readonly<Record<Resource, ResourceInfo>>;
