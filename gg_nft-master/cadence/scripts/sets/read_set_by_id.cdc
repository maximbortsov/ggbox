import GGCore from 0xGGCORE

// This script returns a Set struct for the given id,
// if it exists

pub fun main(id: UInt64): GGCore.SetData {
    return GGCore.getSetData(id: id)
}

