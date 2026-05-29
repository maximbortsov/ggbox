export const ReadEditionRoyalty =
    `
import GGCore from 0xGGCORE

// This script returns an Edition for an id number, if it exists.

pub fun main(editionID: UInt64): {String:UFix64} {
    return GGCore.getEditionData(id: editionID).influencerRoyalties
}
    `

export const ReadBeneficiaryFee =
    `
import GGMarketFee from 0xGGMARKETFEE

// This script returns the beneficiary's fee

pub fun main(): UFix64 {
    return GGMarketFee.beneficiaryFee
}
    `

export const ReadSellerFee =
    `
import GGMarketFee from 0xGGMARKETFEE

// This script returns the seller's fee

pub fun main(): UFix64 {
    return GGMarketFee.sellerFee
}
    `

export const ReadBuyerFee =
    `
import GGMarketFee from 0xGGMARKETFEE

// This script returns the buyer's fee

pub fun main(): UFix64 {
    return GGMarketFee.buyerFee
}
    `