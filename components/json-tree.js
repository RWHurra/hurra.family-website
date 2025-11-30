/**
 * Rekursiv funktion för att bygga HTML-trädet från JSON-data.
 * @param {any} data - JSON-objekt, array eller primitivt värde.
 * @param {string} key - Nyckeln/etiketten för nuvarande datadel.
 * @returns {string} HTML-strängen för denna nod.
 */
function buildTree(data, key = 'root') {
    // 1. Hantera Primitiva Värden (String, Number, Boolean, null)
    if (data === null || typeof data !== 'object') {
        const value = data === null ? 'null' : (typeof data === 'string' ? `"${data}"` : data);
        return `<p class="json-value">${key}: <span class="json-primitive">${value}</span></p>`;
    }

    // 2. Hantera Arrayer (Visas som en lista av indexerade objekt)
    if (Array.isArray(data)) {
        const arrayItems = data.map((item, index) => {
            // Använd ett meningsfullt namn för array-element om möjligt (t.ex. player name)
            let itemKey = index;
            if (typeof item === 'object' && item !== null) {
                // För Poker JSON: Använd 'name' om det finns, annars index
                itemKey = item.name || item.id || index;
            }

            // Rekursivt anrop för varje element i arrayen
            return buildTree(item, itemKey);
        }).join('');

        return `
            <details class="json-array" open>
                <summary class="json-summary array-summary">${key} [${data.length}]</summary>
                <div class="json-children">${arrayItems}</div>
            </details>
        `;
    }

    // 3. Hantera Objekt (Visas som en lista av nyckel/värde-par)
    const objectItems = Object.keys(data).map(objectKey => {
        // Rekursivt anrop för varje egenskap i objektet
        return buildTree(data[objectKey], objectKey);
    }).join('');

    return `
        <details class="json-object" open>
            <summary class="json-summary object-summary">${key} {${Object.keys(data).length}}</summary>
            <div class="json-children">${objectItems}</div>
        </details>
    `;
}

// CSS för inkapsling i Shadow DOM
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="/components/json-tree.css">
    <div id="controls">
        <button class="tree-button" id="expand-all">Expand All</button>
        <button class="tree-button" id="collapse-all">Collapse All</button>
    </div>
    <div id="tree-container"></div>
    `;


class JsonTree extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.container = this.shadowRoot.getElementById('tree-container');

        this.shadowRoot.getElementById('expand-all').addEventListener('click', this.expandAll.bind(this));
        this.shadowRoot.getElementById('collapse-all').addEventListener('click', this.collapseAll.bind(this));
    }

    static get observedAttributes() {
        return ['data']; // Vi lyssnar efter "data" attributet
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data' && oldValue !== newValue) {
            this.loadData(newValue);
        }
    }

    expandAll() {
        // Selektra alla <details> element inom Shadow DOM:et
        const detailsElements = this.container.querySelectorAll('details');
        detailsElements.forEach(detail => {
            detail.open = true;
        });
    }

    collapseAll() {
        const detailsElements = this.container.querySelectorAll('details');
        detailsElements.forEach(detail => {
            detail.open = false;
        });
    }

    async loadData(url) {
        this.container.innerHTML = '<p>Laddar JSON...</p>';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Kunde inte ladda JSON från ${url}. Status: ${response.status}`);
            }
            const data = await response.json();

            // Starta den rekursiva renderingen
            const treeHtml = buildTree(data, url.split('/').pop());

            this.container.innerHTML = treeHtml;

        } catch (error) {
            this.container.innerHTML = `<p style="color: var(--danger);">Fel: ${error.message}</p>`;
            console.error(error);
        }
    }
}

customElements.define('json-tree', JsonTree);