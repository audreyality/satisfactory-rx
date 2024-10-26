import { Tagged } from "type-fest";
import { Recipe, ResourceQty } from "./resource";
import { FilePath } from "../system/file";
import { Ticks } from "./ticks";
import { Connection } from "./connection";
import { ProductionStage, ProductionStatus } from "./production";

export type BuildingId = Tagged<string, "building">

export type BuildingPattern = {
    name: string,
    image: FilePath,
    inputs: Connection[],
    output?: Connection,
}

export type Building = {
    id: BuildingId,
    pattern: BuildingPattern,
    recipe: Recipe,
    inputs: ResourceQty[],
    output?: ResourceQty,
    state: {
        stage: ProductionStage,
        status: ProductionStatus,
    },
    metrics: {
        countdown?: Ticks,
        rate: [number, Ticks], // number / Seconds
    },
};