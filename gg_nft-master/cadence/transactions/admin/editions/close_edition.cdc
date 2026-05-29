import GGCore from 0xGGCORE

transaction(editionID: UInt64) {
    // local variable for the admin reference
    let admin: &GGCore.Admin

    prepare(signer: AuthAccount) {
        // borrow a reference to the Admin resource
        self.admin = signer.borrow<&GGCore.Admin>(from: GGCore.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGCore Admin capability")
    }

    execute {
        let id = self.admin.closeEdition(id: editionID)

        log("====================================")
        log("Closed Edition:")
        log("EditionID: ".concat(id.toString()))
        log("====================================")
    }
}

