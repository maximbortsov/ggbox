export const ChangePrice =
    `
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
`

export const CreateSaleCollection =
    `
import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD
import GGMarket from 0xGGMARKET

// This transaction creates a public sale collection capability that any user can interact with
// Use FUSD as Fungible Tokens
transaction() {

    prepare(signer: AuthAccount) {

        let ownerCapability = signer.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)

        let collection <- GGMarket.createSaleCollection(ftType: Type<@FUSD.Vault>(), ownerCapability: ownerCapability)

        signer.save(<-collection, to: GGMarket.MarketStoragePath)

        signer.link<&GGMarket.SaleCollection{GGMarket.SalePublic}>(GGMarket.MarketPublicPath, target: GGMarket.MarketStoragePath)
    }
}
`

export const CreateStartSaleFusd =
    `
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
`

export const PurchaseNftFusd =
    `
import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD
import GGCore from 0xGGCORE
import GGMarket from 0xGGMARKET

// This transaction is for a user to purchase a nft that another user
// has for sale in their sale collection
// Use FUSD as Fungible Tokens

transaction(sellerAddress: Address, tokenID: UInt64, purchaseAmount: UFix64) {

    let collectionRef: &GGCore.Collection
    let sellerCollectionRef: &{GGMarket.SalePublic}
    let providerRef: &FUSD.Vault{FungibleToken.Provider}

    prepare(signer: AuthAccount) {

        // Borrow a reference to the GGCore Collection
        self.collectionRef = signer.borrow<&GGCore.Collection>(from: GGCore.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // Borrow a reference to the signer's fungible token Vault
        self.providerRef = signer.borrow<&FUSD.Vault{FungibleToken.Provider}>(from: /storage/fusdVault)
            ?? panic("Could not borrow FUSD vault from storage")

        self.sellerCollectionRef = getAccount(sellerAddress)
            .getCapability(GGMarket.MarketPublicPath)
            .borrow<&{GGMarket.SalePublic}>()
            ?? panic("Could not borrow public sale reference from seller account")
    }

    execute {

        // Withdraw tokens from the signer's vault
        let tokens <- self.providerRef.withdraw(amount: purchaseAmount) as! @FUSD.Vault

        // Purchase the nft
        let purchasedToken <- self.sellerCollectionRef.purchase(tokenID: tokenID, buyTokens: <-tokens)

        // Deposit the purchased nft into the signer's collection
        self.collectionRef.deposit(token: <-purchasedToken)
    }
}

`

export const StartSale =
    `
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

`

export const StopSale =
    `
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

`