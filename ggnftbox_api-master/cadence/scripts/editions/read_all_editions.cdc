import GGCore from 0xGGCORE

// This script returns all the Edition structs.
// This will be *long*.

pub fun main(): [GGCore.EditionData] {
    let editions: [GGCore.EditionData] = []
    var id: UInt64 = 1
    // Note < , as nextEditionID has not yet been used
    while id < GGCore.nextEditionID {
        editions.append(GGCore.getEditionData(id: id))
        id = id + 1
    }
    return editions
}

