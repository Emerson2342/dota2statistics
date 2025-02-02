

export function Medal(rank_tier: number | undefined) {
    let rank = '';
    switch (rank_tier) {
        case 11:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/8/85/SeasonalRank1-1.png'
            break;
        case 12:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/e/ee/SeasonalRank1-2.png'
            break;
        case 13:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/0/05/SeasonalRank1-3.png'
            break;
        case 14:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/6/6d/SeasonalRank1-4.png'
            break;
        case 15:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/2/2b/SeasonalRank1-5.png'
            break;
        case 21:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c7/SeasonalRank2-1.png'
            break;
        case 22:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/2/2c/SeasonalRank2-2.png'
            break;
        case 23:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/f/f5/SeasonalRank2-3.png'
            break;
        case 24:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/b/b4/SeasonalRank2-4.png'
            break;
        case 25:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/3/32/SeasonalRank2-5.png'
            break;
        case 31:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/8/82/SeasonalRank3-1.png'
            break;
        case 32:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/6/6e/SeasonalRank3-2.png'
            break;
        case 33:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/6/67/SeasonalRank3-3.png'
            break;
        case 34:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/8/87/SeasonalRank3-4.png'
            break;
        case 35:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/b/b1/SeasonalRank3-5.png'
            break;
        case 41:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/7/76/SeasonalRank4-1.png'
            break;
        case 42:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/8/87/SeasonalRank4-2.png'
            break;
        case 43:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/6/60/SeasonalRank4-3.png'
            break;
        case 44:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/4/4a/SeasonalRank4-4.png'
            break;
        case 45:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/a/a3/SeasonalRank4-5.png'
            break;
        case 51:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/7/79/SeasonalRank5-1.png'
            break
        case 52:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/5/52/SeasonalRank5-2.png'
            break;
        case 53:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/8/88/SeasonalRank5-3.png'
            break;
        case 54:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/2/25/SeasonalRank5-4.png'
            break;
        case 55:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/8/8e/SeasonalRank5-5.png'
            break;
        case 61:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/e/e0/SeasonalRank6-1.png'
            break;
        case 62:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/1/1c/SeasonalRank6-2.png'
            break;
        case 63:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/d/da/SeasonalRank6-3.png'
            break;
        case 64:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/d/db/SeasonalRank6-4.png'
            break;
        case 65:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/4/47/SeasonalRank6-5.png'
            break;
        case 71:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/b/b7/SeasonalRank7-1.png'
            break;
        case 72:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/8/8f/SeasonalRank7-2.png'
            break;
        case 73:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/SeasonalRank7-3.png'
            break;
        case 74:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/1/13/SeasonalRank7-4.png'
            break;
        case 75:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/3/33/SeasonalRank7-5.png'
            break;
        case 80:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/f/f2/SeasonalRankTop0.png'
            break;
        case null:
        case undefined:
        case 0:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/e/e7/SeasonalRank0-0.png'
            break;
        default:
            rank = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/4/46/SeasonalRankTop4.png'
            break;
    }
    return rank;
}