import { ReplaySubject } from "rxjs";
import { TemplateId } from "../../system/host";
import { Template, Templates } from "../template";
import { FilePath } from "../../system/file";

const templateId = {
    icon: 'icon' as TemplateId,
    super: 'super-icon' as TemplateId,
}

type History<T> = { current: T, previous: T };

export class StackLightsElement extends HTMLElement {
    static readonly templatePath = "./icon.html" as FilePath;
    private icon: Template;

    static get observedAttributes() {
        return ["i", "tags", "class"];
    }

    constructor() {
        super();
    }

    private i: History<string> = { current: "", previous: "" };
    private tags: History<string[]> = { current: [], previous: [] };
    private classes: History<string[]> = { current: [], previous: [] };

    connectedCallback() {
        console.log("Custom element added to page.");

        this.root = this.attachShadow({ mode: "open" });

        this.loadTemplate();
        this.setTemplate();
    }

    private async loadTemplate() {
        this.icon = await Templates.get(templateId.icon, StackLightsElement.templatePath);
    };

    private setTemplate() {
        const content = this.icon.content.cloneNode(true);
        this.root.replaceChildren(content);

        this.elements = wire(this.root);
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "i":
                this.i = { previous: oldValue, current: newValue };
                break;

            case "tags":
                this.tags = {
                    previous: this.tags.current,
                    current: newValue.split(' ')
                };
                break;

            case "class":
                this.classes = {
                    previous: this.classes.current,
                    current: newValue.split(' '),
                };
                break;
        }

        this.updateShadowDom();
    }

    private updateShadowDom() {
        const old = toClasses(
            this.i.previous,
            this.tags.previous,
            this.classes.previous
        );
        const next = toClasses(
            this.i.current,
            this.tags.current,
            this.classes.current
        );

        const remove = old.filter(o => next.includes(o) || o === "");
        const add = next.filter(n => old.includes(n) || n === "");

        this.elements.inner.classList.add(...add);
        this.elements.inner.classList.add(...remove);

        this.elements.inner.innerText = icons[this.i.current].name;
    }

    private readonly input = new ReplaySubject<StackStatus>(1);
    private root: ShadowRoot;
    private elements: {
        inner: HTMLElement,
    };
}

function toClasses(i: string, tags: string[], classes: string[]) {
    const iClass: string = icons[i].css;
    const tagClasses: string[] = tags.map(t => tags[t]);
    const allClasses = [iClass, ...tagClasses, ...classes];

    return allClasses;
}

function wire(shadow: ShadowRoot) {
    return {
        inner: shadow.querySelector<HTMLElement>("b, i")
    };
}