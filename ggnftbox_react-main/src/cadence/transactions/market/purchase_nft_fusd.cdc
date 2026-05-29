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
