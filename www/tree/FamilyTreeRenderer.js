/**
 * FamilyTreeRenderer.js
 * Ansvarar för att generera HTML-strängar baserat på trädata.
 */

export class FamilyTreeRenderer {

    /**
     * Huvudmetod för att bygga hela trädets struktur.
     */
    renderFullTree(treeData) {
        if (!treeData) return '<p>Ingen data tillgänglig.</p>';

        return `
            <div class="family-tree-container">
                <div class="generation grandparents-level">
                    <div class="family-units">${this.renderGrandParents(treeData)}</div>
                </div>

                <div class="generation parents-level">
                    <div class="family-units">${this.renderParents(treeData)}</div>
                </div>

                <div class="generation center-level">
                    <div class="center-focus-grid">${this.renderFocusPerson(treeData)}</div>
                </div>

                <div class="generation children-level">
                    <div class="family-units">${this.renderChildren(treeData)}</div>
                </div>

                <div class="generation grandchildren-level">
                    <div class="family-units">${this.renderGrandChildren(treeData)}</div>
                </div>
            </div>
        `;
    }

    renderGrandParents(data) {
        const father = data.parents.find(p => p.id === data.center.fatherId);
        const mother = data.parents.find(p => p.id === data.center.motherId);

        const gp = {
            paternalGF: father ? data.grandParents.find(g => g.id === father.fatherId) : null,
            paternalGM: father ? data.grandParents.find(g => g.id === father.motherId) : null,
            maternalGF: mother ? data.grandParents.find(g => g.id === mother.fatherId) : null,
            maternalGM: mother ? data.grandParents.find(g => g.id === mother.motherId) : null
        };

        return `
            <ul class="family-unit paternal-grandparents">
                ${this._renderBox(gp.paternalGF, 'Farfar')}
                ${this._renderBox(gp.paternalGM, 'Farmor')}
            </ul>
            <ul class="family-unit maternal-grandparents">
                ${this._renderBox(gp.maternalGF, 'Morfar')}
                ${this._renderBox(gp.maternalGM, 'Mormor')}
            </ul>
        `;
    }

    renderParents(data) {
        const father = data.parents.find(p => p.id === data.center.fatherId);
        const mother = data.parents.find(p => p.id === data.center.motherId);

        return `
            <ul class="family-unit center-parents">
                ${this._renderBox(father, 'Pappa')}
                ${this._renderBox(mother, 'Mamma')}
            </ul>
        `;
    }

    renderFocusPerson(data) {
        return `
            <div class="grid-col-1 context-column">
                <ul class="sibling-group">
                    ${data.siblings.map(s => this._renderBox(s)).join('')}
                </ul>
            </div>

            <div class="grid-col-2 center-person-column">
                <ul class="partner-group">
                    ${this._renderBox(data.center, 'Fokus')}
                </ul>
            </div>

            <div class="grid-col-3 partner-column">
                <ul class="partner-group">
                    ${this._renderBox(data.spouse, 'Partner')}
                </ul>
            </div>
        `;
    }

    renderChildren(data) {
        if (data.children.length === 0) return '';
        return `
            <ul class="family-unit center-children">
                ${data.children.map(child => this._renderBox(child)).join('')}
            </ul>
        `;
    }

    // renderGrandChildren(data) {
    //     if (data.grandChildren.length === 0) return '';

    //     // Här kan man gruppera barnbarn per barn om man vill ha mer komplex logik,
    //     // men vi renderar dem som en enhet för nu.
    //     return `
    //         <ul class="family-unit all-grandchildren">
    //             ${data.grandChildren.map(gc => this._renderBox(gc)).join('')}
    //         </ul>
    //     `;
    // }
    renderGrandChildren(data) {
        if (!data.grandChildren || data.grandChildren.length === 0) return '';

        // Vi mappar över varje barn (pappa/mamma till barnbarnen)
        // för att skapa separata grupper.
        const grandChildGroups = data.children.map(child => {
            // Hitta alla barnbarn där detta barnet är antingen mamma eller pappa
            const childsOwnChildren = data.grandChildren.filter(gc =>
                gc.fatherId === child.id || gc.motherId === child.id
            );

            // Om detta barnet inte har några barn ännu, returnera ingenting för denna grupp
            if (childsOwnChildren.length === 0) return '';

            // Skapa en ul-grupp för just denna syskonskara
            // Jag lägger till en unik klass (grandchildren-from-${child.id}) 
            // utifall att du vill styla dem specifikt i CSS.
            return `
            <ul class="family-unit grandchildren-group">
                ${childsOwnChildren.map(gc => this._renderBox(gc)).join('')}
            </ul>
        `;
        });

        return grandChildGroups.join('');
    }

    /**
     * Privat hjälpmetod för att skapa person-box taggen eller en platshållare.
     */
    _renderBox(person, label) {
        if (person) {
            // 'needs-hydration' klassen används för att hitta elementet senare i JS
            return `<li class="person-wrapper">
                        <person-box data-person-id="${person.id}" class="needs-hydration"></person-box>
                    </li>`;
        }
        return `<li class="person-placeholder">
                    <person-box data-person-id="" class"is-placeholder">${label || 'N/A'}</person-box>
                </li>`;
    }
}