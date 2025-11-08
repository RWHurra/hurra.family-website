class TCard extends HTMLElement {
    connectedCallback() {
        const heading = this.getAttribute("heading");
        const details = this.getAttribute("details");
        const bulletsString = this.getAttribute("bullets");

        let bulletsHTML = '';

        if (bulletsString) {
            const bulletItems = bulletsString.split(',');

            bulletsHTML = `<ul>`;
            bulletItems.forEach(item => {
                bulletsHTML += `<li>${item.trim()}</li>`;
            });
            bulletsHTML += `</ul>`;
        }

        this.innerHTML = `
            <div class="card-base">

                <div class="card-heading">
                    <h2>${heading}</h2>
                </div>

                <div class="card-details">
                    <p>${details}</p>

                    ${bulletsHTML}

                </div>

            </div>
            `;
    }
}

customElements.define('t-card', TCard);