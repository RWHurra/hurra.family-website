import { calculatePokerStats } from './PokerStatsCalculator.js';

class PokerStatsPage extends HTMLElement {
    constructor() {
        super();
        // Använder Light DOM för denna "sida" för enkel styling mot global CSS
        // (alternativt kan du använda Shadow DOM om du föredrar det)
    }

    connectedCallback() {
        // Visa en laddningsindikator medan vi väntar på data
        this.innerHTML = `<p>Laddar pokerstatistik...</p>`;

        // Starta asynkron laddning och beräkning
        this.loadStats();
    }

    async loadStats() {
        const dataPath = './data/poker_stats.json';

        try {
            // 1. Ladda rådata
            const response = await fetch(dataPath);

            if (!response.ok) {
                // Kasta fel om filen inte hittades (404) eller annan nätverksproblem
                throw new Error(`Kunde inte ladda data från ${dataPath}. Status: ${response.status}`);
            }

            const rawData = await response.json();

            // 2. Beräkna aggregerad statistik
            // Vi använder den importerade funktionen här
            const calculatedStats = calculatePokerStats(rawData);

            // 3. Skapa topplistan (Sortera efter Netto Vinst, högst först)
            const leaderboard = calculatedStats.sort((a, b) => b.netProfit - a.netProfit);

            // 4. Rendera hela sidan
            this.render(rawData, leaderboard);

        } catch (error) {
            console.error("Fel vid laddning eller bearbetning av pokerdata:", error);
            this.innerHTML = `
                <div style="color: var(--error-color, red); padding: 20px;">
                    <h2>Statistikfel</h2>
                    <p>Ett fel uppstod vid laddning av pokerstatistik: ${error.message}</p>
                </div>
            `;
        }
    }

    render(rawData, leaderboard) {
        // Formatfunktioner (enkla för demo)
        const formatCurrency = (amount) => amount > 0 ? `+${amount} kr` : `${amount} kr`;
        const formatNetWinnings = (amount) => {
            if (amount > 0) return `<span style="color: var(--success-color, green);">+${amount} kr</span>`;
            if (amount < 0) return `<span style="color: var(--error-color, red);">${amount} kr</span>`;
            return `0 kr`;
        };

        // Skapa HTML för topplistan (Netto Vinst)
        const leaderboardHtml = leaderboard.map((player, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${player.name}</strong></td>
                <td>${player.eventsPlayed}</td>
                <td style="color: ${player.netProfit > 0 ? 'var(--success-color, green)' : 'var(--error-color, red)'}; font-weight: bold;">
                    ${formatCurrency(player.netProfit)}
                </td>
                <td>${player.wins}</td>
            </tr>
        `).join('');

        const eventsListCardsHtml = rawData.map(event => `
            <flip-card card-width="350px" card-height="250px">
                <div slot="front-content">
                    <h1 style="color: var(--primary); font-size: 3rem; margin-bottom: 2rem;">🏆 ${event.players.find(p => p.placement === 1)?.name || 'N/A'}</h1>
                    <p style="font: var(--h2); margin-top: 0;">${event.date}</p>
                    <h3 style="color: var(--text-muted);">@ ${event.location}</h3>
                    
                    <pstyle="font-size: 1.2rem; font-weight: bold;">Pott: ${event.totalPot} kr</p>
                </div>

                <div slot="back-content">
                    <h2 style="font-size: 1.5rem; margin-bottom: 2rem;">Placeringar:</h2>
                    <p>🥇 ${event.players.find(p => p.placement === 1)?.name || 'N/A'} ${formatNetWinnings(event.players.find(p => p.placement === 1).winnings || 'N/A')}</p>
                    <p>🥈 ${event.players.find(p => p.placement === 2)?.name || 'N/A'} ${formatNetWinnings(event.players.find(p => p.placement === 2).winnings || 'N/A')}</p>
                    <p>🥉 ${event.players.find(p => p.placement === 3)?.name || 'N/A'} ${formatNetWinnings(event.players.find(p => p.placement === 3).winnings || 'N/A')}</p>
                    </div>
            </flip-card>
`).join('');


        // Huvudrendering
        this.innerHTML = `
            <link rel="stylesheet" href="/poker/poker.css">
            <section class="poker-stats-page">
                <div class="poker-container">
                    <h1>Tidigare Events (${rawData.length})</h1>
                    <t-card-grid>
                        ${eventsListCardsHtml}
                    </t-card-grid>

                    <h1>Poker Maratonlista</h1>
                    
                    <div class="leaderboard-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Spelare</th>
                                    <th>Spelade kvällar</th>
                                    <th>Netto Vinst/Förlust</th>
                                    <th>Vinster</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${leaderboardHtml}
                            </tbody>
                        </table>
                    </div>


                </div>
            </section>
        `;
    }
}

customElements.define('poker-stats-page', PokerStatsPage);