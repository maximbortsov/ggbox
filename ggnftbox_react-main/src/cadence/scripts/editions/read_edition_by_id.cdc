import GGCore from 0xGGCORE

// This script returns an streamer royalty by Edition id (if it exists).

pub fun main(editionID: UInt64): GGCore.EditionData {
    return GGCore.getEditionData(id: editionID).influencerRoyalties
}

