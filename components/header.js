class THeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
            <span>hamburger</span>
            <nav>
                <a href="#">Slot 1</a>
                <a href="#">Slot 2</a>
                <a href="#">Slot 3</a>
            </nav>
        </header>
        `;
    }
}
customElements.define("t-header", THeader);
