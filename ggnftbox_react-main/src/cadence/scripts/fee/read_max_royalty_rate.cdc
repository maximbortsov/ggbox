import GGMarketFee from 0xGGMARKETFEE

// This script returns the upper possible limit of the sum
// of royalties

pub fun main(): UFix64 {
    return GGMarketFee.maxRoyaltyRate
}

