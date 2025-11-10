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
                let trimmedItem = item.trim();
                let listItemContent = trimmedItem;

                // Hitta positionen för kolon (:) för att dela upp nyckel/värde
                const colonIndex = trimmedItem.indexOf(':');

                if (colonIndex > 0) {
                    // Dela upp i nyckel och värde
                    const key = trimmedItem.substring(0, colonIndex).trim();
                    const value = trimmedItem.substring(colonIndex + 1).trim();

                    // Använd <strong> för nyckelordet
                    listItemContent = `<strong>${key}:</strong> ${value}`;
                }

                bulletsHTML += `<li>${listItemContent}</li>`;
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