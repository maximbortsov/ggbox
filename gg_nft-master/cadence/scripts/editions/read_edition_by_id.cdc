import GGCore from 0xGGCORE

// This script returns an Edition for an id number, if it exists.

pub fun main(editionID: UInt64): GGCore.EditionData {
    return GGCore.getEditionData(id: editionID)
}

