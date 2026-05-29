import GGCore from 0xGGCORE

transaction(
    setID: UInt64,
    playID: UInt64,
    name: String,
    maxMintSize: UInt64?,
    rarity: String,
    royalties: {String:UFix64}
   ) {
    // local variable for the admin reference
    let admin: &GGCore.Admin

    prepare(signer: AuthAccount) {
        // borrow a reference to the Admin resource
        self.admin = signer.borrow<&GGCore.Admin>(from: GGCore.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGCore Admin capability")
    }

    execute {
        let id = self.admin.createEdition(
            setID: setID,
            playID: playID,
            name: name,
            maxMintSize: maxMintSize,
            rarity: rarity,
            royalties: royalties
        )

        log("====================================")
        log("New Edition:")
        log("EditionID: ".concat(id.toString()))
        log("====================================")
    }
}

