class THero extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section class="hero">
            <h1>Welcome to hurra.family</h1>
            <p>Your go-to place for family updates, stories, and more!</p>
        </section>
        `;
    }
}
customElements.define("t-hero", THero);