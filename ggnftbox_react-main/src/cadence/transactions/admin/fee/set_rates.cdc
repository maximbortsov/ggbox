import GGMarketFee from 0xGGMARKETFEE

// This transaction sets rates in GGMarketFee
//
// maxFeeRate: the upper possible limit of the sum of sellerFee, buyerFee, beneficiaryFee
// maxRoyaltyRate: the upper possible limit of the sum of royalties
// minRewardRate: the lower guaranteed limit of the user's reward from the sale of NFT

transaction(maxFeeRate: UFix64, maxRoyaltyRate: UFix64, minRewardRate: UFix64) {
    let admin: &GGMarketFee.Admin

    prepare(signer: AuthAccount) {
        self.admin = signer.borrow<&GGMarketFee.Admin>(from: GGMarketFee.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGMarketFee Admin capability")
    }

    execute {
        self.admin.setRates(maxFeeRate: maxFeeRate, maxRoyaltyRate: maxRoyaltyRate, minRewardRate: minRewardRate)
    }
}
