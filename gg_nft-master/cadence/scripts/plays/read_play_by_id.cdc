import GGCore from 0xGGCORE

// This script returns a Play struct for the given id,
// if it exists

pub fun main(id: UInt64): GGCore.PlayData {
    return GGCore.getPlayData(id: id)
}

