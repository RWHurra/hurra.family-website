// section.js
class TSection extends HTMLElement {
  connectedCallback() {
    const heading = this.getAttribute("heading");
    const details = this.getAttribute("details");

    // Hämta data från attributet
    const cardDataString = this.getAttribute("cards");
    let cards = [];

    try {
      // Försök parsa JSON-strängen
      if (cardDataString) {
        cards = JSON.parse(cardDataString);
      }
    } catch (e) {
      console.error("Kunde inte parsa 'card-data' i TSection:", e);
    }

    // Skapa strukturen utan <slot> (eftersom vi skapar korten själva)
    this.innerHTML =`
      <section class="section-wrapper">
        <div class="section-heading">
          <h2>${heading}</h2>
          <p>${details}</p>
        </div>
        <div class="card-container">
        </div>
      </section>
      `;

    const container = this.querySelector('.card-container');

    // Skapa och lägg till varje kort
    cards.forEach(cardInfo => {
      const cardElement = document.createElement('t-card');

      // Sätt attributen på det nya <t-card> elementet
      cardElement.setAttribute('heading', cardInfo.heading || 'No Heading');
      cardElement.setAttribute('details', cardInfo.details || '');
      cardElement.setAttribute('bullets', cardInfo.bullets || '');

      // Lägg till kortet i containern
      container.appendChild(cardElement);
    });
  }
}
customElements.define("t-section", TSection);