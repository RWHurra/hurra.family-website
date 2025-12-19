/**
 * Mappning mellan landskoder (3 bokstäver) och Emoji-flaggor.
 * Lägg till fler vid behov.
 */
const COUNTRY_TO_FLAG = {
    'SWE': '🇸🇪',
    'AUT': '🇦🇹',
    'SRB': '🇷🇸',
    'NOR': '🇳🇴',
    'ICE': '🇮🇸',
    'GER': '🇩🇪',
    'USA': '🇺🇸'
};

/**
 * PersonBox.js
 * En fristående UI-komponent för att visa en person eller en platshållare.
 */
class PersonBox extends HTMLElement {

    static get is() {
        return 'person-box';
    }

    constructor() {
        super();
        this._personData = null;
        this.addEventListener('click', this._handleClick);
    }

    set person(data) {
        this._personData = data;
        this._render();
    }


    _handleClick = () => {
        if (this._personData && this._personData.id) {
            const page = this.closest('family-tree');
            if (page) {
                page.handlePersonClick(this._personData.id);
            }
        }
    }

    /**
     * Hjälpmetod för att hämta flagga baserat på kod.
     * Om flaggan saknas visas koden (t.ex. "USA").
     */
    _getFlag(countryCode) {
        if (!countryCode) return '';
        const code = countryCode.toUpperCase();
        console.log('Getting flag for code:', code);
        console.log('Matching flag:', COUNTRY_TO_FLAG[code]);
        return COUNTRY_TO_FLAG[code] || code;
    }

    _render() {
        if (!this._personData) {
            this.classList.add('is-placeholder');
            this.innerHTML = `<div class="placeholder-label">${this.textContent || 'N/A'}</div>`;
            return;
        }

        this.classList.remove('is-placeholder');
        const p = this._personData;

        // Hämta flaggor
        const citizenshipFlags = (p.citizenships || []).map(code => this._getFlag(code)).join(' ');
        const residenceFlag = !p.deathDate ? this._getFlag(p.residenceCountry) : this._getFlag(p.deathCountry);

        // Skapa en renare datumsträng
        const years = p.deathDate
            ? `${p.birthDate.split('-')[0]} – ${p.deathDate.split('-')[0]}`
            : `${p.birthDate.split('-')[0]} – `;

        this.innerHTML = `
        <div class="box-content">
            <div class="box-header">
                <span class="name">${p.firstName} ${p.lastName}</span>
                <span class="main-flag">${residenceFlag}</span>
            </div>
            <div class="box-details">
                <span class="dates">${years}</span>
                <span class="citizenship-bar">${citizenshipFlags}</span>
            </div>
        </div>
    `;

        this.setAttribute('data-person-id', p.id);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._handleClick);
    }
}

customElements.define(PersonBox.is, PersonBox);