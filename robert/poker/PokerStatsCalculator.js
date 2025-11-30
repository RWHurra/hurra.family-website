export function calculatePokerStats(rawData) {
    const playerStats = {};

    rawData.forEach(event => {
        const eventBuyIn = event.buyIn || 0;
        let calculatedTotalPot = 0;
        let totalBuyInByPlayer = {}; // Mellanlagring för att undvika omläsning

        // =======================================================
        // FAS A: BERÄKNA NÖDVÄNDIGA VÄRDEN (Inom loopen)
        // Vi loopar spelare en gång för att få fram potten.
        // =======================================================

        event.players.forEach(player => {
            const extraBuyIns = player.extraBuyIns || 0;
            const totalBuyIn = eventBuyIn + (extraBuyIns * eventBuyIn);

            calculatedTotalPot += totalBuyIn;

            // Spara insatsen för att slippa räkna ut den igen i FAS B
            totalBuyInByPlayer[player.name] = totalBuyIn;
        });

        // Spara den beräknade potten på event-objektet för rendering i PokerStatsPage
        event.totalPot = calculatedTotalPot;

        // Hitta vinsterna baserat på standardregeln
        const secondPlaceWinnings = eventBuyIn;
        const firstPlaceWinnings = calculatedTotalPot - secondPlaceWinnings;

        // =======================================================
        // FAS B: AGGREGERA STATISTIK (Inom loopen)
        // Vi loopar spelare en gång till för att aggreggera/spara fält.
        // =======================================================

        event.players.forEach(player => {
            const name = player.name;
            const totalBuyIn = totalBuyInByPlayer[name]; // Hämta från mellanlagring

            // 1. Fallback-logik för 'winnings'
            if (player.winnings === undefined || player.winnings === null) {
                switch (player.placement) {
                    case 1:
                        player.winnings = firstPlaceWinnings;
                        event.firstPlaceWinner = name;
                        break;
                    case 2:
                        player.winnings = secondPlaceWinnings;
                        event.secondPlaceWinner = name;
                        break;
                    case 3:
                        event.thirdPlaceWinner = name;
                        break;

                    default:
                        player.winnings = 0;
                        break;
                }
            }

            // 2. Beräkna Netto Vinst/Förlust (behövs för aggregation och rendering)
            player.netWinnings = (player.winnings || 0) - totalBuyIn;

            if (!playerStats[name]) {
                playerStats[name] = {
                    name: name,
                    eventsPlayed: 0,
                    totalBuyIns: 0,
                    totalWinnings: 0,
                    netProfit: 0,
                    wins: 0,
                    placementSum: 0,
                    bubbled: 0
                };
            }

            playerStats[name].eventsPlayed++;
            playerStats[name].totalBuyIns += totalBuyIn;
            playerStats[name].totalWinnings += (player.winnings || 0);
            playerStats[name].netProfit += player.netWinnings;
            playerStats[name].placementSum += player.placement;

            if (player.placement === 1) {
                playerStats[name].wins++;
            }

            const numParticipants = event.players.length;
            if (player.placement === numParticipants) {
                playerStats[name].bubbled++;
            }
        });

        // Se till att event.players är sorterad för rendering i PokerStatsPage
        event.players.sort((a, b) => a.placement - b.placement);
    });

    // SLUTLIG BEARBETNING
    const finalStatsArray = Object.values(playerStats);

    finalStatsArray.forEach(stats => {
        stats.averagePlacement = (stats.placementSum / stats.eventsPlayed).toFixed(2);
    });

    return finalStatsArray;
}