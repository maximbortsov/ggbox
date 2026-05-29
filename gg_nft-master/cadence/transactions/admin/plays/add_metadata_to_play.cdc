import GGCore from 0xGGCORE

transaction(
    playID: UInt64,
    metadata: {String: String?}
   ) {
    // local variable for the admin reference
    let admin: &GGCore.Admin

    prepare(signer: AuthAccount) {
        // borrow a reference to the Admin resource
        self.admin = signer.borrow<&GGCore.Admin>(from: GGCore.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGCore Admin capability")
    }

    execute {
        let play = self.admin.borrowPlay(id: playID)
        for key in metadata.keys {
            let value = metadata[key]!
            play.metadata[key] = value
        }
    }
}

