import GGCore from 0xGGCORE

// This transaction is what GGAdmin uses to send the nfts in a "box" to
// a user's collection

// Parameters:
//
// recipientAddr: the Flow address of the account receiving a box of nfts
// nftIDs: an array of nft IDs to be withdrawn from the owner's nft collection

transaction(recipientAddr: Address, nftIDs: [UInt64]) {

    let receiverRef: &{GGCore.GGNFTCollectionPublic}
    let signerRef: &GGCore.Collection

    prepare(signer: AuthAccount) {
        // get the recipient's public account object
        let recipient = getAccount(recipientAddr)

        // borrow a reference to the recipient's nft collection
        self.receiverRef = recipient.getCapability(GGCore.CollectionPublicPath)
            .borrow<&{GGCore.GGNFTCollectionPublic}>()
            ?? panic("Could not borrow reference to the receiver's collection")

        // borrow a reference to the signer's nft collection
        self.signerRef = signer.borrow<&GGCore.Collection>(from: GGCore.CollectionStoragePath)
                ?? panic("Could not borrow a reference to the owner's collection")
    }

    execute {
        /// Iterate through the keys in the collection and deposit each one
        for nftID in nftIDs {
            self.receiverRef.deposit(token: <- self.signerRef.withdraw(withdrawID: nftID))
        }
    }
}
