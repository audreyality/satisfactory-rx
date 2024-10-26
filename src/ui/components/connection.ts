import { Observer, ReplaySubject } from "rxjs";
import { FilePath } from "../../system/file";
import { Template, Templates } from "../template";
import { TemplateId } from "../../system/host";
import { Connection } from "../../sim/connection";

const templateId = {
    belt: 'belt-connection' as TemplateId,
    pipe: 'pipe-connection' as TemplateId,
    power: 'power-connection' as TemplateId
}

export class ConnectionElement extends HTMLElement implements Observer<Connection> {
    static readonly templatePath = "./connection.html" as FilePath;
    private belt: Template;
    private pipe: Template;
    private pole: Template;

    kind: Connection;

    static get observedAttributes() {
        return ["kind"];
    }

    constructor() {
        super();
    }

    next(value: Connection) {
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


    disconnectedCallback() {
        console.log("Custom element removed from page.");
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

    private templates: Record<string, string>;

    private readonly input = new ReplaySubject<Connection>(1);
    private root: ShadowRoot;
    private elements: {
        resource: HTMLElement,
        container: HTMLElement,
        connection: HTMLElement,
        queue?: HTMLMeterElement,
    };
}

customElements.define("connection", ConnectionElement);

function wire(shadow: ShadowRoot) {
    const container = shadow.querySelector<HTMLElement>(".connection");

    return {
        container,
        resource: shadow.querySelector<HTMLElement>("b[slot=resource]"),
        connection: container.querySelector<HTMLElement>("i"),
        queue: container.querySelector<HTMLMeterElement>("meter.queue"),
    };
}
