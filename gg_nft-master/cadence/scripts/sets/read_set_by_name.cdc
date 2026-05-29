import GGCore from 0xGGCORE

// This script returns a Set struct for the given name,
// if it exists

pub fun main(setName: String): GGCore.SetData {
    return GGCore.getSetDataByName(name: setName)
}

