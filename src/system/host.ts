import { Tagged } from "type-fest";

const body = window.document.body;

const templateContainer = new HTMLDivElement();
templateContainer.setAttribute("style", "display:none;");
body.appendChild(templateContainer);

export type TemplateId = Tagged<string, "template">

export const Host = {
    addTemplate(templateElement: HTMLTemplateElement) {
        if (templateElement.tagName !== "template") {
            throw new Error(`${templateElement.tagName} is not a template.`);
        }

        const id = templateElement.id as TemplateId;
        if (id === "") {
            console.warn(`template not loaded: missing id`);
            return null;
        }

        let template = this.getTemplate(id);
        if (template) {
            console.warn(`${id} template already loaded; returning existing template`);
        } else {
            templateContainer.append(templateElement);
            template = this.getTemplate(id);
        }

        return { id, template };
    },

    getTemplate(id: TemplateId) {
        const template = templateContainer.querySelector<HTMLTemplateElement>(`#${id}`);

        return { id, template };
    }
}



