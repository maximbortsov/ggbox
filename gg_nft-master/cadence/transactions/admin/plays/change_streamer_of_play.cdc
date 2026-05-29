import GGCore from 0xGGCORE

transaction(
    playID: UInt64,
    streamer: String
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
        play.changeStreamer(streamer)

        log("====================================")
        log("New Streamer of Play:")
        log("PlayID: ".concat(playID.toString()))
        log("Streamer: ".concat(streamer))
        log("====================================")
    }
}

