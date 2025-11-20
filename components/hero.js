const template = document.createElement("template");
template.innerHTML = `
    <section class="hero-content">

        <h1 part="hero-title">
            <slot name="hero-title"></slot>
        </h1>

        <h2 part="hero-heading">
            <slot name="hero-heading"></slot>
        </h2>
            
        <div part="hero-body-wrapper">
            <slot name="hero-body"></slot> 
        </div>
        
        <div part="cta-buttons">
            <slot name="hero-action" part="cta-button"></slot> 
        </div>

    </section>
    `
class THero extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.append(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.innerHTML = `<link rel="stylesheet" href="/components/hero.css">` + this.innerHTML;
    }
}
customElements.define("t-hero", THero);