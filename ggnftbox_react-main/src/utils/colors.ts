export const rarityColor = (rarity: string): string => {
    switch (rarity) {
        case 'Common': {
            return '#c4c2c2'
        }
        case 'Rare': {
            return '#3b61c7'
        }
        case 'Mythical': {
            return '#9d65be'
        }
        case 'Legendary': {
            return '#ffb500'
        }
        default: {
            return '#c4c2c2'
        }
    }
}