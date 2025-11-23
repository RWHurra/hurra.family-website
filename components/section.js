const sectionTemplate = document.createElement("template");
sectionTemplate.innerHTML = `
    <section part="section-wrapper">

        <div part="section-header">
            <div part="section-title">
                <slot name="section-title"></slot>
            </div>

            <div part="section-description">
                <slot name="section-description"></slot>
            </div>
        </div>

        <div part="section-body">
            <slot name="section-body"></slot> 
        </div>

    </section>
    `
class TSection extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.append(sectionTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this.innerHTML = `<link rel="stylesheet" href="/components/section.css">` + this.innerHTML;
    }
}
customElements.define("t-section", TSection);