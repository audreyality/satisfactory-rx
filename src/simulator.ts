import { Observable } from "rxjs";

type TickTock = {};

export function run() {

}

export function stop() {

}

export const clock$: Observable<TickTock> = null!;
export const running$: Observable<boolean> = null!;
export const speed$: Observable<number> = null!;
