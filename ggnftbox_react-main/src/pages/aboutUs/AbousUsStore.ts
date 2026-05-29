import { makeAutoObservable } from 'mobx'
import { AssetsPath } from '../../utils/api'


export interface CollectionPlay {
    id: number
    name: string
    twitchUsername: string
    playUrl: string
}


class AboutUsStore {

    uniqueCollectionPlay: CollectionPlay =
        {
            id: 1,
            name: 'Got 2.8%',
            twitchUsername: 'RduLive',
            playUrl: AssetsPath + 'plays/videos/d6399b09-d544-44c9-85bf-6fbf66997143.mp4',
        }

    constructor() {
        makeAutoObservable(this)
    }
}


export default AboutUsStore
