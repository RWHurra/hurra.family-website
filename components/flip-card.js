const template = document.createElement('template');

template.innerHTML = `
    <link rel="stylesheet" href="/components/flip-card.css">
    <div class="flip-card">
        <div class="flip-card-inner">
            
            <div class="flip-card-front">
            <slot name="front-content"></slot>
            </div>
            
            <div class="flip-card-back">
            <slot name="back-content"></slot>
            </div>
        </div>
    </div>
    `;

class FlipCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['card-width', 'card-height'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'card-width') {
            this.shadowRoot.querySelector('.flip-card').style.setProperty('--card-width', newValue);
        }
        if (name === 'card-height') {
            this.shadowRoot.querySelector('.flip-card').style.setProperty('--card-height', newValue);
        }
    }
}

customElements.define('flip-card', FlipCard);