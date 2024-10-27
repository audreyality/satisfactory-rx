import { interval, Subject } from "rxjs";
import { Tick } from "../sim/tick";


const clock = new Subject<Tick>();
interval(1000).subscribe(clock);

export const clock$ = clock.asObservable();