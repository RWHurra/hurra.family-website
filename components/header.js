class THeader extends HTMLElement {
    static PATH_OPEN = "M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z";
    static PATH_CLOSE = "M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z";
    static PATH_HOUSE = "M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z";
    static activeSubdomain = THeader.getCurrentSubdomain();

    connectedCallback() {
        this.innerHTML = `
        <header>
        <div class="nav-left">
            <div class="site-icon-container">
                <a href="//${THeader.activeSubdomain}.hurra.family">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="site-icon">
                        <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                        <path d="${THeader.PATH_HOUSE}"/>
                    </svg>
                </a>
            </div>
            <span class="subdomain-links">
                <a href="//hurra.family">hurra.family</a>
                /
                <a href="//robert.hurra.family">robert</a>
                /
                <a href="//#">jovana</a>
            </span>
        </div>

            <nav class="site-nav">
                <a href="//hurra.family">home</a>
                <a href="//robert.hurra.family">robert</a>
                <a href="#">jovana</a>
            </nav>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="ham">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path class="path" d="${THeader.PATH_OPEN}"/>
            </svg>
        </header>
        `;
        this.setupHamburger();
    }

    setupHamburger() {
        const ham = this.querySelector(".ham");
        const path = this.querySelector("path");
        const nav = this.querySelector(".site-nav");
        ham.addEventListener("click", toggle);
        nav.addEventListener("click", toggle);

        function toggle() {
            const currentPath = path.getAttribute("d");
            const newPath = currentPath.includes(THeader.PATH_OPEN)
                ? THeader.PATH_CLOSE
                : THeader.PATH_OPEN;

            path.setAttribute("d", newPath);
            nav.classList.toggle("show");
        }
    }

    static getCurrentSubdomain() {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        // handle dev enviroment
        const tld = parts[parts.length - 1];
        if (tld === 'local' || tld === 'dev' || tld === 'test' || tld === 'lan' || parts.length <= 2) {
            if (parts.length > 3) {
                return parts[0];
            }
            // if no subdomain, return www
            return 'www';
        }
    }
}
customElements.define("t-header", THeader);
