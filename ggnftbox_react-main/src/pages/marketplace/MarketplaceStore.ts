import { makeAutoObservable } from 'mobx'
import { Streamer } from '../../entities/Streamer'
import { Game } from '../../entities/Game'
import { Tag } from '../../entities/Tag'
import { Currencies, Sorts } from '../../utils/enums'
import { Play } from '../../entities/Play'


class MarketplaceStore {

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

    isPlayInfoOpen = false
    pickedPlayId: string
    pickedCurrency = Currencies.FUSD

    refetch = true

    constructor() {
        makeAutoObservable(this)
    }

    setSearchPattern = (value: string): void => {
        this.searchPattern = value
    }

    setSortPattern = (value: Sorts): void => {
        this.sortPattern = value
    }

    sortFunction = (a: Play, b: Play): number => {
        switch (this.sortPattern) {
            case Sorts.PriceUp: {
                return (a.lowestAsk ?? 0) - (b.lowestAsk ?? 0)
            }
            case Sorts.PriceDown: {
                return (b.lowestAsk ?? 0) - (a.lowestAsk ?? 0)

            }
            // case Sorts.LotsUp: {
            //     return (a.lowestAsk ?? 0) - (b.lowestAsk ?? 0)
            //
            // }
            // case Sorts.LotsDown: {
            //     return (a.lowestAsk ?? 0) - (b.lowestAsk ?? 0)
            // }
            case Sorts.Newest: {
                return a.createdAt.getTime() - b.createdAt.getTime()
            }
        }
        return 0
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

    // FOR MOMENT DIALOG
    openOrCloseFilterMenu(): void {
        this.filterMenuOpen = !this.filterMenuOpen
    }

    closeFilterMenu = (): void => {
        this.filterMenuOpen = false
    }

    openPlayInfo = (playId: string): void => {
        this.pickedPlayId = playId
        this.isPlayInfoOpen = true
    }

    closePlayInfo = (): void => {
        this.isPlayInfoOpen = false
    }

    pickCurrency = (currency: Currencies): void => {
        if (currency !== Currencies.GG) {
            this.pickedCurrency = currency as Currencies
        }
    }
}


export default MarketplaceStore
