import GGCore from 0xGGCORE

// This script returns all the names for Set.
// These can be related to Set structs via GGCore.getSetByName() .

pub fun main(): [String] {
    return GGCore.getAllSetNames()
}

