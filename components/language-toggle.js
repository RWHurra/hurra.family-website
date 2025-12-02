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
        
        // FIX 1: Rensa mellanslag från tillgängliga språk.
        this.availableLangs = (this.getAttribute('available-langs') || 'sv').split(',').map(lang => lang.trim());
        
        // Säkerställ att currentLang är ett giltigt språk i listan
        this.currentLang = this.availableLangs.includes(localStorage.getItem('userLang')) 
                            ? localStorage.getItem('userLang') 
                            : this.defaultLang;

        this.render();
        this.updatePageLanguage(this.currentLang);
    }

    // FUNKTIONERNA getToggleLang() och toggleLanguage() ÄR BORTTAGNA

    render() {
        // 1. Skapa huvudknappen (Visar alltid det aktuella språket)
        const mainButton = document.createElement('button');
        mainButton.classList.add('main-toggle');
        mainButton.addEventListener('click', () => this.toggleDropdown());

        // 2. Skapa dropdown-menyn
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown');

        // 3. Fyll menyn med ett listobjekt (li) för varje tillgängligt språk
        this.availableLangs.forEach(lang => {
            const li = document.createElement('li');
            li.dataset.lang = lang;
            // Använd FLAG_MAP för att få emojin och lägg till text
            li.textContent = `${FLAG_MAP[lang] || lang.toUpperCase()} ${lang.toUpperCase()}`;

            // Markera det initialt valda språket
            if (lang === this.currentLang) {
                li.classList.add('selected');
            }

            // Lägg till klickhändelse för att byta språk
            li.addEventListener('click', (e) => this.selectLanguage(e.currentTarget.dataset.lang));

            dropdownMenu.appendChild(li);
        });

        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/components/language-toggle.css');

        // 4. Lägg till allt i Shadow DOM
        this.shadowRoot.append(link, mainButton, dropdownMenu);

        // 5. Initial uppdatering av huvudknappen
        this.updateMainButtonDisplay();

        // Stäng menyn om man klickar utanför komponenten (lyssnar på hela dokumentet)
        document.addEventListener('click', (e) => {
            // Kontrollerar om klicket ÄR INUTI komponenten eller dess Shadow DOM
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
        // Stäng menyn efter val, detta anrop sker i slutet av setLanguage
        this.shadowRoot.querySelector('.dropdown').classList.remove('open'); 
    }

    updateMainButtonDisplay() {
        const button = this.shadowRoot.querySelector('.main-toggle');
        if (!button) return;

        const currentFlag = FLAG_MAP[this.currentLang] || this.currentLang.toUpperCase();
        
        // Här kan du välja hur knappen ska se ut (Flagga + Pil)
        button.innerHTML = `${currentFlag} <span class="arrow">▼</span>`;
    }

    setLanguage(newLang) {
        if (newLang === this.currentLang) return;

        this.currentLang = newLang;
        localStorage.setItem('userLang', newLang);

        // 1. Uppdatera sidans språk (triggar den globala CSS:en)
        this.updatePageLanguage(newLang);

        // 2. Uppdatera huvudknappens utseende
        this.updateMainButtonDisplay();

        // 3. Uppdatera markeringen i dropdown-listan
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