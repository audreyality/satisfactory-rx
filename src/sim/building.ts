import { Tagged } from "type-fest";
import { Recipe, ResourceQty } from "./production";
import { FilePath } from "../system/file";
import { Tick } from "./tick";
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
        countdown?: Tick,
        rate: [number, Tick], // number / Seconds
    },
};