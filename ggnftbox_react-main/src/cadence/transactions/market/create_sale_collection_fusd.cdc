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
