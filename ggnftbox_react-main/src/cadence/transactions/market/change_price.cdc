import GGCore from 0xGGCORE
import GGMarket from 0xGGMARKET

// This transaction changes the price of a nft that a user has for sale

transaction(tokenID: UInt64, newPrice: UFix64) {

    let saleCollectionRef: &GGMarket.SaleCollection

    prepare(signer: AuthAccount) {

        // Borrow a reference to the GGMarket Sale Collection
        self.saleCollectionRef = signer.borrow<&GGMarket.SaleCollection>(from: GGMarket.MarketStoragePath)
            ?? panic("Could not borrow sale collection from storage")
    }

    execute {

        // Change the price of the nft
        self.saleCollectionRef.changePrice(tokenID: tokenID, newPrice: newPrice)
    }


}
