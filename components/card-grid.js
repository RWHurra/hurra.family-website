const templateGrid = document.createElement("template");
templateGrid.innerHTML = `
    <section part="card-grid">
        <slot></slot>
    </section>
    `;

class TCardGrid extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.append(templateGrid.content.cloneNode(true));
    }
    connectedCallback() {
        this.innerHTML = `<link rel="stylesheet" href="/components/card.css">` + this.innerHTML;
    }
}
customElements.define("t-card-grid", TCardGrid);