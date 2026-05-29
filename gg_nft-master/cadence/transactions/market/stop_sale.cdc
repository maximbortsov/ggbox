import GGCore from 0xGGCORE
import GGMarket from 0xGGMARKET

// This transaction is for a user to stop a nft sale in their account
// by withdrawing that nft from their sale collection and depositing
// it into their normal nft collection

transaction(tokenID: UInt64) {

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

        // withdraw the nft from the sale, thereby de-listing it
        let token <- self.saleCollectionRef.withdraw(tokenID: tokenID)

        // deposit the nft into the owner's collection
        self.collectionRef.deposit(token: <-token)
    }
}
