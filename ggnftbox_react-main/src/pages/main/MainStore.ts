import { makeAutoObservable } from 'mobx'

// export interface Play {
//     id: number
//     name: string
//     rarity: Rarity
//     twitchUsername: string
//     streamerPhotoUrl: string
//     cost: number
//     playUrl: string
// }

// export interface GGBox {
//     id: number
//     name: string
//     description: string
//     twitchUsername: string
//     streamerPhotoUrl: string
//     releaseDate: string
//     cost: number
//     image: string
// }

export interface Lot {
    id: number
    buyer: string | null
    seller: string
    price: number
    dateSold: string | null
}


class MainStore {

    // playsList: Play[] = [
    //     {
    //         id: 1,
    //         name: 'АХАХА 18+',
    //         rarity: Rarity.LEGENDARY,
    //         twitchUsername: 'poli_di_',
    //         cost: 7.5,
    //         playUrl: ichiniPlay,
    //         streamerPhotoUrl: polidiPhoto,
    //     },
    //     {
    //         id: 2,
    //         name: 'Не получилось',
    //         rarity: Rarity.RARE,
    //         twitchUsername: 'kakarotodota',
    //         cost: 13,
    //         playUrl: kakaroPlay,
    //         streamerPhotoUrl: kakaroPhoto,
    //     },
    //     {
    //         id: 3,
    //         name: 'Уснула на стриме',
    //         rarity: Rarity.COMMON,
    //         twitchUsername: 'IchiNiSan_twitch',
    //         cost: 150,
    //         playUrl: polidiPlay,
    //         streamerPhotoUrl: polidiPhoto,
    //     },
    // ]
    // boxesList: GGBox[] = [
    //     {
    //         id: 1,
    //         name: 'Базовый комплект',
    //         description: 'Description',
    //         releaseDate: '24.12.2021',
    //         twitchUsername: 'poli_di_',
    //         cost: 10,
    //         image: polidiBox,
    //         streamerPhotoUrl: polidiPhoto,
    //     },
    //     {
    //         id: 2,
    //         name: 'Базовый комплект',
    //         description: 'Description',
    //         releaseDate: '21.02.2022',
    //         twitchUsername: 'kakarotodota',
    //         cost: 8,
    //         image: kakaroBox,
    //         streamerPhotoUrl: kakaroPhoto,
    //     },
    //     {
    //         id: 3,
    //         name: 'Базовый комплект',
    //         description: 'Loooooooooooooo oooooooooooong desc',
    //         releaseDate: '22.11.2021',
    //         twitchUsername: 'IchiNiSan_twitch',
    //         cost: 5,
    //         image: ichiniBox,
    //         streamerPhotoUrl: ichiniPhoto,
    //     },
    // ]

    lotLists: Lot[] = [
        {
            id: 1,
            buyer: 'username',
            seller: 'username',
            price: 12,
            dateSold: '12.12.22',
        },
        {
            id: 2,
            buyer: 'username',
            seller: 'username',
            price: 14,
            dateSold: '12.12.22',
        },
        {
            id: 3,
            buyer: 'username',
            seller: 'username',
            price: 5,
            dateSold: '12.12.22',
        },
        {
            id: 4,
            buyer: 'username',
            seller: 'username',
            price: 63,
            dateSold: '12.12.22',
        },
        {
            id: 5,
            buyer: 'username',
            seller: 'username',
            price: 22,
            dateSold: '12.12.22',
        },
        {
            id: 6,
            buyer: 'username',
            seller: 'username',
            price: 20,
            dateSold: '12.12.22',
        },
        {
            id: 7,
            buyer: 'username',
            seller: 'username',
            price: 55,
            dateSold: '12.12.22',
        },
        {
            id: 8,
            buyer: null,
            seller: 'username',
            price: 120,
            dateSold: null,
        },
        {
            id: 9,
            buyer: null,
            seller: 'username',
            price: 13,
            dateSold: null,
        },
        {
            id: 10,
            buyer: null,
            seller: 'username',
            price: 53,
            dateSold: null,
        },
        {
            id: 11,
            buyer: null,
            seller: 'username',
            price: 22,
            dateSold: null,
        },
        {
            id: 12,
            buyer: null,
            seller: 'username',
            price: 25,
            dateSold: null,
        },
        {
            id: 13,
            buyer: null,
            seller: 'username',
            price: 63,
            dateSold: null,
        },
        {
            id: 14,
            buyer: null,
            seller: 'username',
            price: 3,
            dateSold: null,
        },
        {
            id: 15,
            buyer: null,
            seller: 'username',
            price: 1,
            dateSold: null,
        },
    ]

    // FOR MOMENT DIALOG
    isPlayInfoOpen = false
    pickedPlayId: string
    //FOR BOX DIALOG
    isBoxInfoOpen = false
    pickedBoxId: string

    constructor() {
        makeAutoObservable(this)
    }

    openPlayInfo = (playId: string): void => {
        this.pickedPlayId = playId
        this.isPlayInfoOpen = true
    }

    closePlayInfo = (): void => {
        this.isPlayInfoOpen = false
    }

    openBoxInfo = (boxId: string): void => {
        this.pickedBoxId = boxId
        this.isBoxInfoOpen = true
    }

    closeBoxInfo = (): void => {
        this.isBoxInfoOpen = false
    }
}


export default MainStore
