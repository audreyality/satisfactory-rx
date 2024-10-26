import { FilePath } from "../system/file";
import { Host, TemplateId } from "../system/host";

export type Template = {
    id: TemplateId,
    location: FilePath,
    template: HTMLTemplateElement,
    content: DocumentFragment
};

const parser = new DOMParser();
const loaded = new Map<TemplateId, Template>();
const loading = new Map<FilePath, Promise<void>>();

export const Templates = class {
    private static async load(location: FilePath) {
        const waiting = loading.get(location);
        if (waiting) {
            return waiting;
        }

        const response = await fetch(location);
        const document = await html(response);
        const templateElements = [...document.body.querySelectorAll("template")];

        for (const t of templateElements) {
            const template: Partial<Template> = Host.addTemplate(t);
            template.location = location;
            template.content = template.template.content;
            loaded.set(template.id, template as Template);
        }
    }

    static async get(id: TemplateId, location?: FilePath) {
        // has it already loaded?
        let template: Template = loaded.get(id);
        if (template) {
            return template;
        }

        // join a pending load?
        let pending: Promise<void>;
        if (location) {
            pending = loading.get(location);
        } else {
            // or start one!
            pending = this.load(location);
            loading.set(location, pending);
        }
        await pending;

        // it should have loaded by now
        template = loaded.get(id);
        if (template) {
            return template;
        } else {
            throw new Error(`${id} template failed to load from ${location}`);
        }
    }
};

async function html(response: Response) {
    const type = response.headers.get("ContentType");
    if (type === "text/html") {
        const text = await response.text();
        const parsed = parser.parseFromString(text, "text/html");
        return parsed;
    } else {
        throw new Error(`Unexpected content type for template: ${type}`);
    }
}