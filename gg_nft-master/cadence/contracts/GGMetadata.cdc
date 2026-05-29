pub contract GGMetadata {

    /// Clip metadata
    ///
    pub struct Clip {
        pub let date: UFix64
        pub let game: String
        pub let streamer: String

        init(
            date: UFix64,
            game: String,
            streamer: String
        ) {
            self.date = date
            self.game = game
            self.streamer = streamer
        }
    }
}
