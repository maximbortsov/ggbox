import GGMarketFee from 0xGGMARKETFEE

// This script returns the lower guaranteed limit of
// the user's reward from the sale of NFT

pub fun main(): UFix64 {
    return GGMarketFee.minRewardRate
}

