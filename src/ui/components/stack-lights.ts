import { Observer, ReplaySubject, Subject, takeUntil } from "rxjs";
import { TemplateId } from "../../system/host";
import { FilePath } from "../../system/file";
import { Template, Templates } from "../template";
import { IconElement } from "./icon";

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

    private watch: OptionalLights[] = [];

    constructor() {
        super();

        this.input.pipe(
            takeUntil(this.disconnect$)
        ).subscribe((status) => this.onInput(status))
    }

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

    private onInput(status: StackStatus) {
        function configure(element: HTMLElement, light: LightBehavior) {
            element.setAttribute("tags", light);
        }

        configure(this.elements.red, status.red);
        configure(this.elements.yellow, status.yellow);
        configure(this.elements.green, status.green);

        if (this.elements.blue) {
            configure(this.elements.blue, status.blue);
        }
        if (this.elements.white) {
            configure(this.elements.white, status.white);
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

    attributeChangedCallback(name, _current, next) {
        if (name === "watch" && typeof next === "string") {
            this.watch = next.split(' ').filter(
                s => optionalLights.includes(s as any)
            ) as OptionalLights[];

            this.setTemplate();
        }
        console.log("Custom element attributes changed.");
    }

    private readonly input = new ReplaySubject<StackStatus>(1);
    private root: ShadowRoot;
    private elements: {
        red: IconElement,
        yellow: IconElement,
        green: IconElement,
        blue?: IconElement,
        white?: IconElement,
    };
}

customElements.define("stack-lights", StackLightsElement);

function wire(shadow: ShadowRoot) {
    return {
        red: shadow.querySelector<IconElement>(".red")!,
        yellow: shadow.querySelector<IconElement>(".yellow")!,
        green: shadow.querySelector<IconElement>(".green")!,
        blue: shadow.querySelector<IconElement>(".blue"),
        white: shadow.querySelector<IconElement>(".white"),
    };
}
