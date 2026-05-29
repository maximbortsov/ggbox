import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// This transaction configures an account to hold GGNFTs.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
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
