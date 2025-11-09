class THeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
            <span>hurra.family</span>
            <nav>
                <a href="#">home</a>
                <a href="./robert">robert</a>
                <a href="#">jovana</a>
            </nav>
        </header>
        `;
    }
}
customElements.define("t-header", THeader);
