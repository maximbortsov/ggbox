import GGCore from 0xGGCORE
import GGMarket from 0xGGMARKET

// This transaction is for a user to put a nft up for sale
// They must have GGCore Collection and a GGMarket Sale Collection
// stored in their account

transaction(tokenID: UInt64, price: UFix64) {

    let collectionRef: &GGCore.Collection
    let saleCollectionRef: &GGMarket.SaleCollection

    prepare(signer: AuthAccount) {

        // Borrow a reference to the GGCore Collection
        self.collectionRef = signer.borrow<&GGCore.Collection>(from: GGCore.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // Borrow a reference to the GGMarket Sale Collection
        self.saleCollectionRef = signer.borrow<&GGMarket.SaleCollection>(from: GGMarket.MarketStoragePath)
            ?? panic("Could not borrow sale collection from storage")
    }

    execute {

        // Withdraw the specified token from the collection
        let token <- self.collectionRef.withdraw(withdrawID: tokenID) as! @GGCore.NFT

        // List the specified nft for sale
        self.saleCollectionRef.listForSale(token: <-token, price: price)
    }
}
