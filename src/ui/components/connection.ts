import { Observer, ReplaySubject, Subject, takeUntil } from "rxjs";
import { FilePath } from "../../system/file";
import { Template, Templates } from "../template";
import { TemplateId } from "../../system/host";
import { Connection } from "../../sim/connection";
import { InventoryError, InventoryReport } from "../../sim/production";
import { Resources } from "../../sim/resource";

const templateId = {
    belt: 'belt-connection' as TemplateId,
    pipe: 'pipe-connection' as TemplateId,
    power: 'power-connection' as TemplateId
}

type Inventory = InventoryReport | InventoryError;

export class ConnectionElement extends HTMLElement implements Observer<Inventory> {
    static readonly templatePath = "./connection.html" as FilePath;
    private belt: Template;
    private pipe: Template;
    private pole: Template;

    private kind: Connection;

    static get observedAttributes() {
        return ["kind"];
    }

    constructor() {
        super();

        this.initializeRx();
    }

    private initializeRx() {
        this.input.pipe(
            takeUntil(this.disconnect$)
        ).subscribe((status) => this.onInput(status))
    }

    next(value: Inventory) {
        if (value.type !== "inventory") {
            this.input.next(value);
        }
    }

    error(err: unknown) {
        if (!err || typeof err !== "object") {
            return;
        } else if ("type" in err && err.type === "inventory") {
            this.input.next(err as Inventory);
            return;
        }

        this.input.error(err);
    }

    complete() {
        this.input.complete();

        this.input = new ReplaySubject<Inventory>();
        this.initializeRx();
    }

    connectedCallback() {
        console.log("Custom element added to page.");

        this.root = this.attachShadow({ mode: "open" });

        this.loadTemplate();
        this.setTemplate();
    }

    async loadTemplate() {
        const ids = [templateId.belt, templateId.pipe, templateId.power] as const;
        [this.belt, this.pipe, this.pole] = await Promise.all(
            ids.map((id) => Templates.get(id, ConnectionElement.templatePath))
        );
    };

    private setTemplate() {
        let connection: Node;
        switch (this.kind) {
            case "belt":
                connection = this.belt.content.cloneNode(true);

            case "pipe":
                connection = this.pipe.content.cloneNode(true);

            case "pole":
                connection = this.pole.content.cloneNode(true);
        }

        this.root.replaceChildren(connection);
        this.elements = wire(this.root);
    }

    private onInput(input: Inventory) {
        if (input.kind !== "report") {
            return;
        }

        const { icon } = Resources[input.resource];
        this.elements.resource.setAttribute("i", icon);

        if (this.elements.inventory) {
            this.elements.inventory.max = input.target;
            this.elements.inventory.value = input.current;
        }
    }

    private disconnect$ = new Subject<void>();

    disconnectedCallback() {
        console.log("Custom element removed from page.");
        this.disconnect$.next();
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "kind") {
            this.kind = newValue;
            this.setTemplate();
        }

        console.log("Custom element attributes changed.");
    }

    private input = new ReplaySubject<Inventory>(1);
    private root: ShadowRoot;
    private elements: {
        resource: HTMLElement,
        connection: HTMLElement,
        inventory?: HTMLMeterElement,
    };
}

customElements.define("connection", ConnectionElement, { extends: "li" });

function wire(shadow: ShadowRoot) {
    const connection = shadow.querySelector<HTMLElement>(".connection");

    return {
        connection,
        resource: connection.querySelector<HTMLElement>(".resource"),
        inventory: connection.querySelector<HTMLMeterElement>(".queue"),
    };
}
