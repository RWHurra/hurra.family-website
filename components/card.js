const template = document.createElement("template");
template.innerHTML = `
    <div part="card-base">
        <div part="card-header">
            <div part="card-title">
                <slot name="card-title"></slot>
            </div>
        </div>
        <div part="card-content">
            <div part="card-body">
                <slot name="card-body"></slot>
            </div>
            <div part="card-bullet-wrapper">
                <ul part="card-bullets">
                    <slot name="card-bullet"></slot>
                </ul>
            </div>
        </div>
        <div part="card-footer">
            <div part="cta-buttons">
                <slot name="card-action" part="cta-button"></slot> 
            </div>
        </div>
    </div>
    `
class TCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.append(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.innerHTML = `<link rel="stylesheet" href="/components/card.css">` + this.innerHTML;
    }
}
customElements.define("t-card", TCard);