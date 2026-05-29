import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

transaction(recipientAddress: Address, editionID: UInt64, metadata: {String:String}) {

    // local variable for storing the minter reference
    let minter: &{GGCore.NFTMinter}
    let recipient: &{GGCore.GGNFTCollectionPublic}

    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.getCapability(GGCore.MinterPrivatePath)
            .borrow<&{GGCore.NFTMinter}>()
            ?? panic("Could not borrow a reference to the NFT minter")

        // get the recipients public account object
        let recipientAccount = getAccount(recipientAddress)

        // borrow a public reference to the receivers collection
        self.recipient = recipientAccount.getCapability(GGCore.CollectionPublicPath)
            .borrow<&{GGCore.GGNFTCollectionPublic}>()
            ?? panic("Could not borrow a reference to the collection receiver")
    }

    execute {
        // mint the NFT and deposit it to the recipient's collection
        let ggNFT <- self.minter.mintNFT(editionID: editionID, metadata: metadata)
        self.recipient.deposit(token: <- (ggNFT as @NonFungibleToken.NFT))
    }
}

