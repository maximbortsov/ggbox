import GGCore from 0xGGCORE

// This script returns all the Set structs.
// This will eventually be *long*.

pub fun main(): [GGCore.PlayData] {
    let plays: [GGCore.PlayData] = []
    var id: UInt64 = 1
    // Note < , as nextPlayID has not yet been used
    while id < GGCore.nextPlayID {
        plays.append(GGCore.getPlayData(id: id))
        id = id + 1
    }
    return plays
}

