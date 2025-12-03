const FLAG_MAP = {
    'sv': '🇸🇪',
    'en': '🇬🇧',
    'sr': '🇷🇸',
};

class LanguageToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.defaultLang = this.getAttribute('default-lang') || 'sv';

        // get all elements with lang attribute in the document
        const langElements = document.querySelectorAll('[lang]');

        const detectedLangs = new Set();

        // populate detectedLangs set with unique lang codes
        langElements.forEach(el => {
            const langCode = el.getAttribute('lang').trim();
            if (langCode) {
                detectedLangs.add(langCode);
            }
        });

        this.availableLangs = Array.from(detectedLangs).sort();

        if (this.availableLangs.length === 0) {
            this.availableLangs = [this.defaultLang];
        }

        //check if userLang is stored in localStorage and is in availableLangs
        this.currentLang = this.availableLangs.includes(localStorage.getItem('userLang'))
            ? localStorage.getItem('userLang')
            : this.defaultLang;

        this.render();
        this.updatePageLanguage(this.currentLang);
    }

    render() {
        const mainButton = document.createElement('button');
        mainButton.classList.add('main-toggle');
        mainButton.addEventListener('click', () => this.toggleDropdown());

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown');

        // create list items for each available language
        this.availableLangs.forEach(lang => {
            const li = document.createElement('li');
            li.dataset.lang = lang;
            li.textContent = `${FLAG_MAP[lang] || lang.toUpperCase()} ${lang.toUpperCase()}`;

            // select the current language
            if (lang === this.currentLang) {
                li.classList.add('selected');
            }

            // add click event to select language
            li.addEventListener('click', (e) => this.selectLanguage(e.currentTarget.dataset.lang));

            dropdownMenu.appendChild(li);
        });

        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/components/language-toggle.css');

        this.shadowRoot.append(link, mainButton, dropdownMenu);

        this.updateMainButtonDisplay();

        // close dropdown when clicking outside the component
        document.addEventListener('click', (e) => {
            // check if click was inside the component
            const isInside = this.contains(e.target) || e.composedPath().includes(this);

            if (!isInside) {
                this.shadowRoot.querySelector('.dropdown').classList.remove('open');
            }
        });
    }

    toggleDropdown() {
        this.shadowRoot.querySelector('.dropdown').classList.toggle('open');
    }

    selectLanguage(newLang) {
        this.setLanguage(newLang);
        // close dropwdown after selection
        this.shadowRoot.querySelector('.dropdown').classList.remove('open');

        // dispatch a custom event to notify about the language change
        this.dispatchEvent(new CustomEvent('language-selected', {
            bubbles: true,   // let event bubble up through the DOM
            composed: true   // let event cross shadow DOM boundaries
        }));
    }

    updateMainButtonDisplay() {
        const button = this.shadowRoot.querySelector('.main-toggle');
        if (!button) return;

        const currentFlag = FLAG_MAP[this.currentLang] || this.currentLang.toUpperCase();
        button.innerHTML = `${currentFlag} <span class="arrow">▼</span>`;
    }

    setLanguage(newLang) {
        if (newLang === this.currentLang) return;

        this.currentLang = newLang;
        localStorage.setItem('userLang', newLang);

        this.updatePageLanguage(newLang);

        this.updateMainButtonDisplay();

        // update selected class in dropdown
        this.shadowRoot.querySelectorAll('li').forEach(li => {
            li.classList.remove('selected');
            if (li.dataset.lang === newLang) {
                li.classList.add('selected');
            }
        });
    }

    updatePageLanguage(lang) {
        document.body.dataset.currentLang = lang;
        document.documentElement.lang = lang;
    }
}

customElements.define('language-toggle', LanguageToggle);