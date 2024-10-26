import { Observer, ReplaySubject } from "rxjs";
import { TemplateId } from "../../system/host";
import { FilePath } from "../../system/file";
import { Template, Templates } from "../template";

const templateId = {
    core: 'stack-lights' as TemplateId,
    light: 'stack-lights-light' as TemplateId,
}

export class StackLightsElement extends HTMLElement implements Observer<StackStatus> {
    static readonly templatePath = "./stack-lights.html" as FilePath;
    private core: Template;
    private light: Template;

    static get observedAttributes() {
        return ["watch"];
    }

    watch: OptionalLights[] = [];

    next(value: StackStatus) {
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
        const ids = [templateId.core, templateId.light] as const;
        [this.core, this.light] = await Promise.all(
            ids.map((id) => Templates.get(id, StackLightsElement.templatePath))
        );
    };

    private setTemplate() {
        const core = this.core.content.cloneNode(true);
        this.root.replaceChildren(core);

        const stack = this.root.querySelector(".stack-lights");
        for (let s in this.watch) {
            const light = this.light.content.cloneNode(true);
            stack.appendChild(light);
        }

        this.elements = wire(this.root);
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "watch" && typeof newValue === "string") {
            this.watch = newValue.split(' ').filter(
                s => optionalLights.includes(s as any)
            ) as OptionalLights[];

            this.setTemplate();
        }
        console.log("Custom element attributes changed.");
    }

    private readonly input = new ReplaySubject<StackStatus>(1);
    private root: ShadowRoot;
    private elements: {
        red: HTMLElement,
        yellow: HTMLElement,
        green: HTMLElement,
        blue?: HTMLElement,
        white?: HTMLElement,
    };
}

customElements.define("stack-lights", StackLightsElement);

function wire(shadow: ShadowRoot) {
    return {
        red: shadow.querySelector<HTMLElement>(".red")!,
        yellow: shadow.querySelector<HTMLElement>(".yellow")!,
        green: shadow.querySelector<HTMLElement>(".green")!,
        blue: shadow.querySelector<HTMLElement>(".blue"),
        white: shadow.querySelector<HTMLElement>(".white"),
    };
}
