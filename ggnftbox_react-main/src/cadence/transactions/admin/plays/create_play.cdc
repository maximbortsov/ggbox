import GGCore from 0xGGCORE

transaction(
    name: String,
    description: String,
    game: String,
    streamer: String,
    url: String,
    metadata: {String: String}
   ) {
    // local variable for the admin reference
    let admin: &GGCore.Admin

    prepare(signer: AuthAccount) {
        // borrow a reference to the Admin resource
        self.admin = signer.borrow<&GGCore.Admin>(from: GGCore.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGCore Admin capability")
    }

    execute {
        let id = self.admin.createPlay(
            name: name,
            description: description,
            game: game,
            streamer: streamer,
            url: url,
            metadata: metadata
        )

        log("====================================")
        log("New Play:")
        log("PlayID: ".concat(id.toString()))
        log("====================================")
    }
}

