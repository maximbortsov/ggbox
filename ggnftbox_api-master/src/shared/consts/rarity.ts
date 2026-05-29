export enum Rarity {
    Common = 'Common',
    Rare = 'Rare',
    Mythical = 'Mythical',
    Legendary = 'Legendary',
}


export function checkRarityExist(rarity: string): boolean {
    const s = Object.values(Rarity) as string[]
    return s.includes(rarity)
}
