import GGMarketFee from 0xGGMARKETFEE

// This script returns the upper possible limit of the sum
// of seller's fee, buyer's fee and  beneficiary's fee

pub fun main(): UFix64 {
    return GGMarketFee.maxFeeRate
}

