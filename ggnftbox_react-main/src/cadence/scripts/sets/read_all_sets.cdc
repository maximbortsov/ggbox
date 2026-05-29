import GGCore from 0xGGCORE

// This script returns all the Set structs.
// This will eventually be *long*.

pub fun main(): [GGCore.SetData] {
    let sets: [GGCore.SetData] = []
    var id: UInt64 = 1
    // Note < , as nextSetID has not yet been used
    while id < GGCore.nextSetID {
        sets.append(GGCore.getSetData(id: id))
        id = id + 1
    }
    return sets
}

