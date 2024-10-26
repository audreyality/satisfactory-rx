import { ReplaySubject } from "rxjs";
import { TemplateId } from "../../system/host";
import { Template, Templates } from "../template";
import { FilePath } from "../../system/file";

const templateId = {
    icon: 'icon' as TemplateId,
    super: 'super-icon' as TemplateId,
}

export class StackLightsElement extends HTMLElement {
    static readonly templatePath = "./icon.html" as FilePath;
    private _super: Template;
    private icon: Template;

    static get observedAttributes() {
        return ["i", "tags", "super", "class"];
    }

    constructor() {
        super();
    }

    i: string;
    super: boolean;
    tags: string[] = [];

    connectedCallback() {
        console.log("Custom element added to page.");

        this.root = this.attachShadow({ mode: "open" });

        this.loadTemplate();
        this.setTemplate();
    }

    async loadTemplate() {
        const ids = [templateId.icon, templateId.super] as const;
        [this.icon, this._super] = await Promise.all(
            ids.map((id) => Templates.get(id, StackLightsElement.templatePath))
        );
    };

    private setTemplate() {

        let content: Node;
        if (this.super) {
            content = this._super.content.cloneNode(true);
        } else {
            content = this.icon.content.cloneNode(true);
        }
        this.root.replaceChildren(content);

        this.elements = wire(this.root);
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    private readonly input = new ReplaySubject<StackStatus>(1);
    private root: ShadowRoot;
    private elements: {
        inner: HTMLElement,
    };
}

function wire(shadow: ShadowRoot) {
    return {
        inner: shadow.querySelector<HTMLElement>("b, i")
    };
}