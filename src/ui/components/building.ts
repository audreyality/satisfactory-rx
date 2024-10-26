import { Observer, ReplaySubject } from "rxjs";
import { Building } from "../../sim/building";
import { Template, Templates } from "../template";
import { FilePath } from "../../system/file";
import { StackLightsElement } from "./stack-lights";
import { ConnectionElement } from "./connection";
import { TemplateId } from "../../system/host";

const templateId = {
    building: "building" as TemplateId,
}

class BuildingElement extends HTMLElement implements Observer<Building> {
    static readonly template = "./component.html" as FilePath;
    private building: Template;

    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
    }

    next(value: Building) {
        this.input.next(value);
    }

    error(err: unknown) {
        this.input.error(err);
    }

    complete() {
        this.input.complete();
    }

    connectedCallback() {
        console.log("Custom element added to page.");
        this.root = this.attachShadow({ mode: "open" });
        this.loadTemplate();
        this.setTemplate();
    }

    async loadTemplate() {
        this.building = await Templates.get(templateId.building, BuildingElement.template);
    };

    private setTemplate() {
        let building = this.building.content.cloneNode(true);
        this.root.replaceChildren(building);
        this.elements = wire(this.root);
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("Custom element attributes changed.");
    }

    private readonly input = new ReplaySubject<Building>(1);
    private root: ShadowRoot;
    private elements: {
        name: HTMLElement,
        instance: HTMLImageElement,
        status: HTMLElement,
        stackLight: StackLightsElement,
        stage: HTMLElement,
        rate: HTMLMeterElement,
        next: HTMLElement,
        inputs: ConnectionElement[],
        output: ConnectionElement
    };
}

customElements.define("building", BuildingElement);

function wire(shadow: ShadowRoot) {
    const result = {
        name: shadow.querySelector<HTMLElement>(".name")!,
        instance: shadow.querySelector<HTMLImageElement>(".instance"),
        status: shadow.querySelector<HTMLElement>(".status")!,
        stackLight: shadow.querySelector<StackLightsElement>("stack-light"),
        stage: shadow.querySelector<HTMLElement>(".stage")!,
        rate: shadow.querySelector<HTMLMeterElement>(".rate")!,
        duration: shadow.querySelector<HTMLElement>(".duration"),
        next: shadow.querySelector<HTMLElement>(".next")!,
        inputs: [...shadow.querySelectorAll<ConnectionElement>(".input connection")],
        output: shadow.querySelector<ConnectionElement>(".output connection"),
    };

    return result;
}