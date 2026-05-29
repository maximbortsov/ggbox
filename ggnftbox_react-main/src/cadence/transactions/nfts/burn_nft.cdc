import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// This transaction burn a GGCore NFT from a collection.

transaction(tokenID: UInt64) {

    let collectionRef: &GGCore.Collection

    prepare(signer: AuthAccount) {
        self.collectionRef = signer.borrow<&GGCore.Collection>(from: GGCore.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
    }

    execute {

        // withdraw the NFT from the owner's collection
        let token <- self.collectionRef.withdraw(withdrawID: tokenID)

        destroy token
    }
}
