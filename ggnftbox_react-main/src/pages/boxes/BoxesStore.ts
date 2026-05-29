import { makeAutoObservable } from 'mobx'
import { Streamer } from '../../entities/Streamer'
import { Game } from '../../entities/Game'
import { Tag } from '../../entities/Tag'
import { Currencies, Sorts } from '../../utils/enums'


class BoxesStore {

    searchPattern = ''
    sortPattern: Sorts = Sorts.Newest
    filterMenuOpen = false

    filters = {
        minPrice: 0,
        maxPrice: 10000,
        streamers: [''],
        games: [''],
        tags: [''],
    }
    refetch = true

    isBoxInfoOpen = false
    pickedBoxId: string
    pickedCurrency = Currencies.USD

    boxTokenId = ''

    constructor() {
        makeAutoObservable(this)
    }

    setSearchPattern = (value: string): void => {
        this.searchPattern = value
    }

    setSortPattern = (value: Sorts): void => {
        this.sortPattern = value
        this.applySortPattern(value)
    }

    applySortPattern = (sortType: Sorts): void => {
        // switch (sortType) {
        //     case Sorts.PriceUp: {
        //         this.boxesList.sort((a, b) => a.cost - b.cost)
        //         return
        //     }
        //     case Sorts.PriceDown: {
        //         this.boxesList.sort((a, b) => b.cost - a.cost)
        //         return
        //     }
        //     case Sorts.LotsUp: {
        //         return
        //     }
        //     case Sorts.LotsDown: {
        //         return
        //     }
        //     case Sorts.Newest: {
        //         this.boxesList.sort((a, b) => a.id - b.id)
        //         return
        //     }
        // }
    }

    setFilterMinPrice = (value: string): void => {
        this.filters.minPrice = parseFloat(value)
    }

    setFilterMaxPrice = (value: string): void => {
        this.filters.maxPrice = parseFloat(value)
    }

    setFilterStreamer = (value: Streamer[]): void => {
        this.filters.streamers = value.map((streamer) => streamer.name)
    }

    setFilterGame = (value: Game[]): void => {
        this.filters.games = value.map((game) => game.name)
    }

    setFilterTag = (value: Tag[]): void => {
        this.filters.tags = value.map((tag) => tag.name)
    }

    clearFilters = (): void => {
        this.filters.minPrice = 0
        this.filters.maxPrice = 10000
        this.filters.streamers = ['']
        this.filters.games = ['']
    }

    applyFilters = (): void => {
        this.refetch = !this.refetch
        this.closeFilterMenu()
    }

    // FOR BOX DIALOG
    openOrCloseFilterMenu(): void {
        this.filterMenuOpen = !this.filterMenuOpen
    }

    closeFilterMenu = (): void => {
        this.filterMenuOpen = false
    }

    openBoxInfo = (boxId: string): void => {
        this.pickedBoxId = boxId
        this.isBoxInfoOpen = true
    }

    closeBoxInfo = (): void => {
        this.isBoxInfoOpen = false
    }

    pickCurrency = (currency: Currencies): void => {
        if (currency !== Currencies.GG) {
            this.pickedCurrency = currency as Currencies
        }
    }

    setBoxTokenId = (id: string) => {
        this.boxTokenId = id
    }

    removeBoxTokenId = () => {
        this.boxTokenId = ''
    }
}


export default BoxesStore

