export function calculatePokerStats(rawData) {
    const playerStats = {};

    rawData.forEach(event => {
        const eventBuyIn = event.buyIn || 0;
        
        event.players.forEach(player => {
            const name = player.name;
            const extraBuyIns = player.extraBuyIns || 0;
            const totalInsatt = eventBuyIn + (extraBuyIns * eventBuyIn);
            const netWinnings = (player.winnings || 0) - totalInsatt;

            // 1. Initialisera spelaren om den är ny
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

            // 2. Aggregera statistik
            playerStats[name].eventsPlayed++;
            playerStats[name].totalBuyIns += totalInsatt;
            playerStats[name].totalWinnings += (player.winnings || 0);
            playerStats[name].netProfit += netWinnings;
            playerStats[name].placementSum += player.placement;
            
            if (player.placement === 1) {
                playerStats[name].wins++;
            }

            // 3. Identifiera "Bubblan" (Näst sista placeringen)
            const numParticipants = event.players.length;
            if (player.placement === numParticipants) {
                playerStats[name].bubbled++;
            }
        });
    });

    const finalStatsArray = Object.values(playerStats);
    
    finalStatsArray.forEach(stats => {
        stats.averagePlacement = (stats.placementSum / stats.eventsPlayed).toFixed(2);
    });

    return finalStatsArray;
}