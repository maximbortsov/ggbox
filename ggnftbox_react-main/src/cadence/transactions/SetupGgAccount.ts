export const SetupGgAccount =
    `
import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD
import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// This transaction configures an account to hold GGNFTs.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a FUSD Vault
        if signer.type(at: /storage/fusdVault) != Type<@FUSD.Vault>() {

            // save FUSD vault to the account
            signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

            // create a public capability for the receiver
            signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
                    /public/fusdReceiver,
                    target: /storage/fusdVault
            )

            // create a public capability for the receiver
            signer.link<&FUSD.Vault{FungibleToken.Balance}>(
                    /public/fusdBalance,
                    target: /storage/fusdVault
            )
        }
        // if the account doesn't already have a GGCore.Collection
        if signer.type(at: GGCore.CollectionStoragePath) != Type<@GGCore.Collection>() {

            // create a new empty collection
            let collection <- GGCore.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: GGCore.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&GGCore.Collection{NonFungibleToken.CollectionPublic, GGCore.GGNFTCollectionPublic}>(
                GGCore.CollectionPublicPath,
                target: GGCore.CollectionStoragePath
            )
        }
    }
}
    `