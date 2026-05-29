import GGMarketFee from 0xGGMARKETFEE

// This transaction sets the buyer's fee

transaction(percentage: UFix64) {
    let admin: &GGMarketFee.Admin

    prepare(signer: AuthAccount) {
        self.admin = signer.borrow<&GGMarketFee.Admin>(from: GGMarketFee.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGMarketFee Admin capability")
    }

    execute {
        self.admin.setBuyerFee(percentage)
    }
}
