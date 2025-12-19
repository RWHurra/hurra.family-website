/**
 * FamilyTreeService.js
 * Hanterar datahämtning och logik för att beräkna släktskapsrelationer.
 */

export class FamilyTreeService {
    constructor() {
        this.personMap = {};
        this.RENDER_DEPTH = 2;
    }

    /**
     * Laddar JSON-data och bygger en lookup-map.
     */
    async loadData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            this.personMap = data.reduce((map, person) => {
                map[person.id] = person;
                return map;
            }, {});
            
            return this.personMap;
        } catch (error) {
            console.error("FamilyTreeService: Failed to load data", error);
            throw error;
        }
    }

    /**
     * Hämtar ett strukturerat objekt med alla släktingar för en fokusperson.
     */
    getTreeData(centerId) {
        const centerPerson = this.personMap[centerId];
        if (!centerPerson) return null;

        // 1. Föräldrar
        const parentIds = new Set();
        if (centerPerson.motherId) parentIds.add(centerPerson.motherId);
        if (centerPerson.fatherId) parentIds.add(centerPerson.fatherId);

        // 2. Far/Morföräldrar (via rekursiv insamling)
        const ancestorIds = new Set();
        this._collectAncestors(centerId, this.RENDER_DEPTH, ancestorIds);

        const grandParentIds = new Set();
        parentIds.forEach(parentId => {
            const parent = this.personMap[parentId];
            if (parent) {
                if (parent.motherId && ancestorIds.has(parent.motherId)) grandParentIds.add(parent.motherId);
                if (parent.fatherId && ancestorIds.has(parent.fatherId)) grandParentIds.add(parent.fatherId);
            }
        });

        // 3. Barn och barnbarn
        const descendantIds = new Set();
        this._collectDescendants(centerId, this.RENDER_DEPTH, descendantIds);

        const childrenIds = new Set(centerPerson.childrenIds || []);
        const grandChildrenIds = new Set([...descendantIds].filter(id => !childrenIds.has(id)));

        // 4. Partner och syskon
        const contextualIds = this._getContextualRelations(centerId);

        const mapIdsToPeople = (ids) => [...ids].map(id => this.personMap[id]).filter(Boolean);

        return {
            center: centerPerson,
            spouse: this.personMap[centerPerson.spouseId] || null,
            siblings: mapIdsToPeople([...contextualIds].filter(id => id !== centerPerson.spouseId)),
            parents: mapIdsToPeople(parentIds),
            grandParents: mapIdsToPeople(grandParentIds),
            children: mapIdsToPeople(childrenIds),
            grandChildren: mapIdsToPeople(grandChildrenIds)
        };
    }

    /**
     * Hjälpmetod för att samla alla personobjekt i en platt array (för hydrering)
     */
    getAllPeopleInTree(treeData) {
        return [
            treeData.center,
            treeData.spouse,
            ...treeData.siblings,
            ...treeData.parents,
            ...treeData.grandParents,
            ...treeData.children,
            ...treeData.grandChildren
        ].filter(p => p && p.id);
    }

    // --- Privata logikmetoder (tidigare i FamilyTreeLogic.js) ---

    _collectAncestors(id, depth, collectedIds) {
        if (depth <= 0) return;
        const person = this.personMap[id];
        if (!person) return;

        [person.motherId, person.fatherId].forEach(parentId => {
            if (parentId && this.personMap[parentId]) {
                collectedIds.add(parentId);
                this._collectAncestors(parentId, depth - 1, collectedIds);
            }
        });
    }

    _collectDescendants(id, depth, collectedIds) {
        if (depth <= 0) return;
        const person = this.personMap[id];
        if (!person || !person.childrenIds) return;

        person.childrenIds.forEach(childId => {
            if (this.personMap[childId]) {
                collectedIds.add(childId);
                this._collectDescendants(childId, depth - 1, collectedIds);
            }
        });
    }

    _getContextualRelations(id) {
        const person = this.personMap[id];
        const relatedIds = new Set();
        if (!person) return relatedIds;

        if (person.spouseId) relatedIds.add(person.spouseId);

        const parentId = person.fatherId || person.motherId;
        if (parentId && this.personMap[parentId]) {
            const parent = this.personMap[parentId];
            (parent.childrenIds || []).forEach(childId => {
                if (childId !== id) relatedIds.add(childId);
            });
        }
        return relatedIds;
    }
}