import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD
import GGCore from 0xGGCORE
import GGMarket from 0xGGMARKET

// This transaction creates a public sale collection capability that any user can interact with
// Also put a nft up for sale
// Use FUSD as Fungible Tokens

transaction(tokenID: UInt64, price: UFix64) {

    let collectionRef: &GGCore.Collection
    let saleCollectionRef: &GGMarket.SaleCollection

    prepare(signer: AuthAccount) {

        // check to see if a sale collection already exists
        if signer.type(at: GGMarket.MarketStoragePath) != Type<@GGMarket.SaleCollection>() {

            let ownerCapability = signer.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)

            let collection <- GGMarket.createSaleCollection(ftType: Type<@FUSD.Vault>(), ownerCapability: ownerCapability)

            signer.save(<-collection, to: GGMarket.MarketStoragePath)

            signer.link<&GGMarket.SaleCollection{GGMarket.SalePublic}>(GGMarket.MarketPublicPath, target: GGMarket.MarketStoragePath)
        }

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
