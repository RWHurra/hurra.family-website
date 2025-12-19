/**
 * FamilyTreePage.js
 * Controller-komponenten som koordinerar data och rendering.
 */
import { FamilyTreeService } from './FamilyTreeService.js';
import { FamilyTreeRenderer } from './FamilyTreeRenderer.js';
import './PersonBox.js';

const DATA_URL = './data/family-tree.json';
const DEFAULT_CENTER_ID = '3';

class FamilyTreePage extends HTMLElement {
    constructor() {
        super();
        this.service = new FamilyTreeService();
        this.renderer = new FamilyTreeRenderer();
        this.centerId = null;
    }

    async connectedCallback() {
        try {
            // 1. Ladda data via servicen
            await this.service.loadData(DATA_URL);

            // 2. Hantera routing/initial visning
            this.handleUrlChange();

            // Lyssna på bakåt/framåt i webbläsaren
            window.addEventListener('popstate', () => this.handleUrlChange());
        } catch (error) {
            this.innerHTML = `<p class="error">Kunde inte initiera trädet: ${error.message}</p>`;
        }
    }

    /**
     * Läser ID från URL eller fallback och triggar rendering.
     */
    handleUrlChange() {
        // Här kan du använda din routing.js framöver
        const newId = DEFAULT_CENTER_ID;

        if (newId && newId !== this.centerId) {
            this.centerId = newId;
            this.renderTree(newId);
        }
    }

    /**
     * Huvudprocessen för att rita upp trädet.
     */
    renderTree(id) {
        // 1. Hämta beräknad träd-data från servicen
        const treeData = this.service.getTreeData(id);
        if (!treeData) return;

        // 2. Generera HTML-sträng via renderaren och sätt in i DOM
        this.innerHTML = `
            <link rel="stylesheet" href="./tree.css">
            ${this.renderer.renderFullTree(treeData)}
        `;

        // 3. Hydrera: Fyll de tomma <person-box> med faktiska JS-objekt
        this.initializePersonBoxes(treeData);
    }

    /**
     * Kopplar ihop DOM-elementen med deras dataobjekt.
     */
    initializePersonBoxes(treeData) {
        // Hämta en platt lista på alla som faktiskt syns i trädet
        const peopleInView = this.service.getAllPeopleInTree(treeData);
        const peopleMap = new Map(peopleInView.map(p => [p.id, p]));

        // Hitta alla boxar som markerats med klassen 'needs-hydration'
        const boxes = this.querySelectorAll('person-box.needs-hydration');

        boxes.forEach(box => {
            const id = box.getAttribute('data-person-id');
            const data = peopleMap.get(id);

            if (data) {
                // Detta triggar PersonBox._render() internt
                box.person = data;
                if (id === this.centerId) {
                    box.classList.add('is-center-person');
                }
            }
        });
    }

    /**
     * Anropas från PersonBox vid klick.
     */
    handlePersonClick(id) {
        if (id !== this.centerId) {
            // Här kan du anropa navigateTo(id) från routing.js
            this.centerId = id;
            this.renderTree(id);
        }
    }
}

customElements.define('family-tree', FamilyTreePage);