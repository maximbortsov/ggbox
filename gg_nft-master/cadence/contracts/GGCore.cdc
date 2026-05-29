/**
    Based on AllDay, TopShot, Gaia and Eternal
*/

import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import GGMetadata from "./GGMetadata.cdc"
import GGMarketFee from "./GGMarketFee.cdc"
import GGInfluencerSystem from "./GGInfluencerSystem.cdc"

/**
    There are 4 levels of entity:
    1. Sets
    2. Plays
    3. Editions
    4. GGNFT (an NFT)

    An Edition is created with a combination of a Set and Play
    GGNFTs are minted out of Editions.

    Note that we cache some information (counts of entities) rather
    than calculate it each time.
    This is enabled by encapsulation and saves gas for entity lifecycle operations.
 */

/// The GGCore NFTs and metadata contract
///
pub contract GGCore: NonFungibleToken {

    ///------------------------------------------------------------
    /// Events
    ///------------------------------------------------------------

    /// Contract Events
    ///
    pub event ContractInitialized()

    /// NFT Collection Events
    ///
    /// Emitted when a nft is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)
    /// Emitted when a nft is deposited into a Collection
    pub event Deposit(id: UInt64, to: Address?)

    /// Set Events
    ///
    /// Emitted when a new set has been created by an admin
    pub event SetCreated(id: UInt64, name: String)
    /// Emitted when a new Play is added to a Set
    pub event PlayAddedToSet(setID: UInt64, playID: UInt64)

    /// Play Events
    ///
    /// Emitted when a new play has been created by an admin
    pub event PlayCreated(
        id: UInt64,
        name: String,
        description: String,
        date: UFix64,
        game: String,
        streamer: String,
        cid: String,
        metadata: {String:String}
    )
    /// Emitted when the streamer of Play is changed
    pub event PlayStreamerChanged(
        playID: UInt64,
        streamer: String
    )
    /// Emitted when the streamer of Play is changed
    pub event PlayGameChanged(
        playID: UInt64,
        game: String
    )

    /// Edition Events
    ///
    /// Emitted when a new edition has been created by an admin
    pub event EditionCreated(
        id: UInt64,
        setID: UInt64,
        playID: UInt64,
        name: String,
        maxMintSize: UInt64?,
        rarity: String,
    )
    /// Emitted when an edition is either closed by an admin, or the max amount of nfts have been minted
    pub event EditionClosed(id: UInt64)

    /// NFT Events
    ///
    /// Emitted when a GGNFT is minted
    pub event GGNFTMinted(id: UInt64, editionID: UInt64, serialNumber: UInt64, metadata: {String:String})
    /// Emitted when a GGNFT is burned
    pub event GGNFTBurned(id: UInt64)

    ///------------------------------------------------------------
    /// Named values
    ///------------------------------------------------------------

    /// Named Paths
    ///
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath
    pub let MinterPrivatePath: PrivatePath

    ///------------------------------------------------------------
    /// Publicly readable contract state
    ///------------------------------------------------------------

    /// Entity Counts
    ///
    pub var totalSupply: UInt64
    pub var nextSetID: UInt64
    pub var nextPlayID: UInt64
    pub var nextEditionID: UInt64

    ///------------------------------------------------------------
    /// Internal contract state
    ///------------------------------------------------------------

    /// Metadata Dictionaries
    ///
    /// This is so we can find Sets by their ids (via setByID)
    access(self) let setIDByName: {String: UInt64}
    access(self) let setByID: @{UInt64: Set}
    access(self) let playByID: @{UInt64: Play}
    access(self) let editionByID: @{UInt64: Edition}

    ///------------------------------------------------------------
    /// Play
    ///------------------------------------------------------------

    /// A public struct to access Play data
    ///
    pub struct PlayData {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        /// IPFS CID
        pub let cid: String
        /// Clip metadata
        pub let date: UFix64
        pub let game: String
        pub let streamer: String

        pub let metadata: {String: String}

        /// initializer
        ///
        init (id: UInt64) {
            let play = (&GGCore.playByID[id] as &GGCore.Play?)!
            self.id = id
            self.name = play.name
            self.description = play.description
            self.date = play.date
            self.game = play.game
            self.cid = play.cid
            self.streamer = play.streamer
            self.metadata = play.metadata
        }
    }

    /// A top level Play with a unique ID
    ///
    pub resource Play {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        /// IPFS CID
        pub let cid: String
        /// Clip metadata
        pub let date: UFix64
        pub var game: String
        pub var streamer: String

        /// Contents writable if borrowed!
        /// This is deliberate, as it allows admins to update the data.
        pub let metadata: {String: String}

        /// initializer
        ///
        init (
            name: String,
            description: String,
            game: String,
            streamer: String,
            cid: String,
            metadata: {String: String}
        ) {
            self.id = GGCore.nextPlayID
            self.name = name
            self.description = description
            self.date = getCurrentBlock().timestamp
            self.game = game
            self.streamer = streamer
            self.cid = cid
            self.metadata = metadata

            GGCore.nextPlayID = self.id + 1

            emit PlayCreated(
                id: self.id,
                name: self.name,
                description: self.description,
                date: self.date,
                game: self.game,
                streamer: self.streamer,
                cid: self.cid,
                metadata: self.metadata
            )
        }

        /// Change streamer name
        ///
        pub fun changeStreamer(_ streamer: String) {
            self.streamer = streamer

            emit PlayStreamerChanged(playID: self.id, streamer: streamer)
        }

        /// Change game name
        ///
        pub fun changeGame(_ game: String) {
            self.game = game

            emit PlayGameChanged(playID: self.id, game: game)
        }

        /// Add key-value pair to metadata
        ///
        pub fun addMetadata(key: String, _ value: String) {
            self.metadata[key] = value
        }
    }

    /// Get the publicly available data for a Play
    ///
    pub fun getPlayData(id: UInt64): GGCore.PlayData {
        pre {
            GGCore.playByID[id] != nil: "Cannot borrow play, no such id"
        }

        return GGCore.PlayData(id: id)
    }

    ///------------------------------------------------------------
    /// Set
    ///------------------------------------------------------------

    /// A public struct to access Set data
    ///
    pub struct SetData {
        pub let id: UInt64
        pub let name: String
        pub var setPlaysInEditions: {UInt64: Bool}

        /// initializer
        ///
        init (id: UInt64) {
            let set = (&GGCore.setByID[id] as &GGCore.Set?)!
            self.id = id
            self.name = set.name
            self.setPlaysInEditions = set.setPlaysInEditions
        }

        /// member function to check the setPlaysInEditions to see if this Set/Play combination already exists
        pub fun setPlayExistsInEdition(playID: UInt64): Bool {
           return self.setPlaysInEditions.containsKey(playID)
        }
    }

    /// A top level Set with a unique ID and a name
    ///
    pub resource Set {
        pub let id: UInt64
        pub let name: String
        /// Store a dictionary of all the Plays which are paired with the Set inside Editions
        /// This enforces only one Set/Play unique pair can be used for an Edition
        pub var setPlaysInEditions: {UInt64: Bool}

        /// initializer
        ///
        init (name: String) {
            pre {
                !GGCore.setIDByName.containsKey(name): "A Set with that name already exists"
            }
            self.id = GGCore.nextSetID
            self.name = name
            self.setPlaysInEditions = {}

            /// Cache the new set's name => ID
            GGCore.setIDByName[name] = self.id
            /// Increment for the nextSetID
            GGCore.nextSetID = self.id + 1

            emit SetCreated(id: self.id, name: self.name)
        }

        /// member function to insert a new Play to the setPlaysInEditions dictionary
        pub fun insertNewPlay(playID: UInt64) {
            self.setPlaysInEditions[playID] = true

            emit PlayAddedToSet(setID: self.id, playID: playID)
        }
    }

    /// Get the publicly available data for a Set
    ///
    pub fun getSetData(id: UInt64): GGCore.SetData {
        pre {
            GGCore.setByID[id] != nil: "Cannot borrow set, no such id"
        }

        return GGCore.SetData(id: id)
    }

    /// Get the publicly available data for a Set by name
    ///
    pub fun getSetDataByName(name: String): GGCore.SetData {
        pre {
            GGCore.setIDByName[name] != nil: "Cannot borrow set, no such name"
        }

        let id = GGCore.setIDByName[name]!
        return GGCore.SetData(id: id)
    }

    /// Get all set names (this will be *long*)
    ///
    pub fun getAllSetNames(): [String] {
        return GGCore.setIDByName.keys
    }

    ///------------------------------------------------------------
    /// Edition
    ///------------------------------------------------------------

    /// A public struct to access Edition data
    ///
    pub struct EditionData {
        pub let id: UInt64
        pub let setID: UInt64
        pub let playID: UInt64

        pub let name: String
        pub let rarity: String

        pub let influencerRoyalties: {String:UFix64}

        pub var maxMintSize: UInt64?
        pub var numMinted: UInt64

        /// initializer
        ///
        init (id: UInt64) {
            let edition = (&GGCore.editionByID[id] as &GGCore.Edition?)!
            self.id = id
            self.playID = edition.playID
            self.setID = edition.setID
            self.name = edition.name
            self.maxMintSize = edition.maxMintSize
            self.rarity = edition.rarity
            self.numMinted = edition.numMinted
            self.influencerRoyalties = edition.influencerRoyalties
        }

       /// member function to check if max edition size has been reached
       pub fun maxEditionMintSizeReached(): Bool {
            return self.numMinted == self.maxMintSize
        }
    }

    /// A top level Edition that contains a Set and Play
    ///
    pub resource Edition {
        pub let id: UInt64
        pub let setID: UInt64
        pub let playID: UInt64

        pub let name: String
        pub let rarity: String
        /// Null value indicates that there is unlimited minting potential for the Edition
        pub var maxMintSize: UInt64?
        /// Updates each time we mint a new nft for the Edition to keep a running total
        pub var numMinted: UInt64
        /// Mapping from influencer's name to reward percentage
        pub let influencerRoyalties: {String:UFix64}

        /// initializer
        ///
        init (
            setID: UInt64,
            playID: UInt64,
            name: String,
            maxMintSize: UInt64?,
            rarity: String,
            royalties: {String:UFix64},
        ) {
            pre {
                maxMintSize != 0: "max mint size is zero, must either be null or greater than 0"
                GGCore.setByID.containsKey(setID): "setID does not exist"
                GGCore.playByID.containsKey(playID): "playID does not exist"
                SetData(id: setID).setPlayExistsInEdition(playID: playID) != true: "set play combination already exists in an edition"
            }

            self.id = GGCore.nextEditionID
            self.setID = setID
            self.playID = playID
            self.name = name
            self.influencerRoyalties = royalties

            var royaltySum = 0.0
            for influencer in royalties.keys {
                assert(
                    GGInfluencerSystem.influencerExists(influencer),
                    message: "Invalid influencer name"
                )
                royaltySum = royaltySum + royalties[influencer]!
            }
            assert(
                royaltySum <= GGMarketFee.maxRoyaltyRate,
                message: "The sum of royalties provided is more than the max"
            )

            /// If an edition size is not set, it has unlimited minting potential
            self.maxMintSize = maxMintSize != 0 ? maxMintSize : nil

            self.rarity = rarity
            self.numMinted = 0

            GGCore.nextEditionID = GGCore.nextEditionID + 1
            GGCore.setByID[setID]?.insertNewPlay(playID: playID)

            emit EditionCreated(
                id: self.id,
                setID: self.setID,
                playID: self.playID,
                name: self.name,
                maxMintSize: self.maxMintSize,
                rarity: self.rarity,
            )
        }


        /// Close this edition so that no more GGNFTs can be minted in it
        ///
        access(contract) fun close() {
            pre {
                self.numMinted != self.maxMintSize: "max number of minted nfts has already been reached"
            }

            self.maxMintSize = self.numMinted

            emit EditionClosed(id: self.id)
        }

        /// Mint a GGNFT in this edition, with the given minting mintingDate.
        /// Note that this will panic if the max mint size has already been reached.
        ///
        pub fun mint(metadata: {String:String}): @GGCore.NFT {
            pre {
                self.numMinted != self.maxMintSize: "max number of minted nfts has been reached"
            }

            /// Create the GGNFT, filled out with our information
            let ggNFT <- create NFT(
                id: GGCore.totalSupply + 1,
                editionID: self.id,
                serialNumber: self.numMinted + 1,
                metadata: metadata,
            )
            GGCore.totalSupply = GGCore.totalSupply + 1
            /// Keep a running total (you'll notice we used this as the serial number)
            self.numMinted = self.numMinted + 1

            return <- ggNFT
        }
    }

    /// Get the publicly available data for an Edition
    ///
    pub fun getEditionData(id: UInt64): EditionData {
        pre {
            GGCore.editionByID[id] != nil: "Cannot borrow edition, no such id"
        }
        return GGCore.EditionData(id: id)
    }

    ///------------------------------------------------------------
    /// NFT
    ///------------------------------------------------------------

    /// A GG NFT
    ///
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let editionID: UInt64
        pub let serialNumber: UInt64
        pub let mintingDate: UFix64

        pub let metadata: {String: String}

        /// NFT initializer
        ///
        init(
            id: UInt64,
            editionID: UInt64,
            serialNumber: UInt64,
            metadata: {String:String}
        ) {
            pre {
                GGCore.editionByID[editionID] != nil: "no such editionID"
                EditionData(id: editionID).maxEditionMintSizeReached() != true: "max edition size already reached"
            }

            self.id = id
            self.editionID = editionID
            self.serialNumber = serialNumber
            self.mintingDate = getCurrentBlock().timestamp
            self.metadata = metadata

            emit GGNFTMinted(id: self.id, editionID: self.editionID, serialNumber: self.serialNumber, metadata: self.metadata)
        }

        pub fun name(): String {
            let edition = (&GGCore.editionByID[self.editionID] as &GGCore.Edition?)!
            let play = (&GGCore.playByID[edition.id] as &GGCore.Play?)!

            let playName = play.name
            var mintSizeString = edition.maxMintSize != nil ? "/".concat(edition.maxMintSize!.toString()) : ""

            return playName
                .concat(" #")
                .concat(self.id.toString())
                .concat(mintSizeString)
        }

        pub fun description(): String {
            let edition = (&GGCore.editionByID[self.editionID] as &GGCore.Edition?)!
            let play = (&GGCore.playByID[edition.id] as &GGCore.Play?)!
            return play.description
        }

        /// Get metadata types
        ///
        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<GGMetadata.Clip>()
            ]
        }

        /// Get metadata by type
        ///
        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name(),
                        description: self.description(),
                        thumbnail: MetadataViews.HTTPFile("")
                    )
                case Type<GGMetadata.Clip>():
                    let edition = (&GGCore.editionByID[self.editionID] as &GGCore.Edition?)!
                    let play = (&GGCore.playByID[edition.id] as &GGCore.Play?)!
                    return GGMetadata.Clip(
                        date: play.date,
                        game: play.game,
                        streamer: play.streamer
                    )
            }
            return nil
        }

        /// Destructor
        ///
        destroy() {
            emit GGNFTBurned(id: self.id)
        }
    }

    ///------------------------------------------------------------
    /// Collection
    ///------------------------------------------------------------

    /// A public collection interface that allows GGNFTs to be borrowed
    ///
    pub resource interface GGNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowGGNFT(id: UInt64): &GGCore.NFT? {
            /// If the result isn't nil, the id of the returned reference
            /// should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow GGNFT reference: The ID of the returned reference is incorrect"
            }
        }
    }

    /// An NFT Collection
    ///
    pub resource Collection:
        NonFungibleToken.Provider,
        NonFungibleToken.Receiver,
        NonFungibleToken.CollectionPublic,
        GGNFTCollectionPublic
    {
        /// dictionary of NFT conforming tokens
        /// NFT is a resource type with an UInt64 ID field
        ///
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        /// Collection initializer
        ///
        init() {
            self.ownedNFTs <- {}
        }

        /// withdraw removes an NFT from the collection and moves it to the caller
        ///
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        /// deposit takes a NFT and adds it to the collections dictionary
        /// and adds the ID to the id array
        ///
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @GGCore.NFT
            let id: UInt64 = token.id

            /// add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        /// batchDeposit takes a Collection object as an argument
        /// and deposits each contained NFT into this Collection
        ///
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {
            /// Get an array of the IDs to be deposited
            let keys = tokens.getIDs()

            /// Iterate through the keys in the collection and deposit each one
            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }

            /// Destroy the empty Collection
            destroy tokens
        }

        /// getIDs returns an array of the IDs that are in the collection
        ///
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        /// borrowNFT gets a reference to an NFT in the collection
        ///
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        /// borrowGGNFT gets a reference to an NFT in the collection
        ///
        pub fun borrowGGNFT(id: UInt64): &GGCore.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &GGCore.NFT
            } else {
                return nil
            }
        }

        /// Collection destructor
        ///
        destroy() {
            destroy self.ownedNFTs
        }
    }

    /// public function that anyone can call to create a new empty collection
    ///
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    ///------------------------------------------------------------
    /// Admin
    ///------------------------------------------------------------

    /// An interface containing the Admin function that allows minting NFTs
    ///
    pub resource interface NFTMinter {
        /// Mint a single NFT
        /// The Edition for the given ID must already exist
        ///
        pub fun mintNFT(editionID: UInt64, metadata: {String:String}): @GGCore.NFT
    }

    /// A resource that allows managing metadata and minting NFTs
    ///
    pub resource Admin: NFTMinter {

        /// Borrow a Set
        ///
        pub fun borrowSet(id: UInt64): &GGCore.Set {
            pre {
                GGCore.setByID[id] != nil: "Cannot borrow Set, no such id"
            }

            return (&GGCore.setByID[id] as &GGCore.Set?)!
        }

        /// Borrow a Play
        ///
        pub fun borrowPlay(id: UInt64): &GGCore.Play {
            pre {
                GGCore.playByID[id] != nil: "Cannot borrow Play, no such id"
            }

            return (&GGCore.playByID[id] as &GGCore.Play?)!
        }

        /// Borrow an Edition
        ///
        pub fun borrowEdition(id: UInt64): &GGCore.Edition {
            pre {
                GGCore.editionByID[id] != nil: "Cannot borrow edition, no such id"
            }

            return (&GGCore.editionByID[id] as &GGCore.Edition?)!
        }

        /// Create a Set
        ///
        pub fun createSet(name: String): UInt64 {
            /// Create and store the new set
            let set <- create GGCore.Set(
                name: name,
            )
            let setID = set.id
            GGCore.setByID[set.id] <-! set

            /// Return the new ID for convenience
            return setID
        }

        /// Create a Play
        ///
        pub fun createPlay(
            name: String,
            description: String,
            game: String,
            streamer: String,
            cid: String,
            metadata: {String: String}
        ): UInt64 {
            /// Create and store the new play
            let play <- create GGCore.Play(
                name: name,
                description: description,
                game: game,
                streamer: streamer,
                cid: cid,
                metadata: metadata,
            )
            let playID = play.id
            GGCore.playByID[play.id] <-! play

            /// Return the new ID for convenience
            return playID
        }

        /// Create an Edition
        ///
        pub fun createEdition(
            setID: UInt64,
            playID: UInt64,
            name: String,
            maxMintSize: UInt64?,
            rarity: String,
            royalties: {String:UFix64},
        ): UInt64 {
            let edition <- create Edition(
                setID: setID,
                playID: playID,
                name: name,
                maxMintSize: maxMintSize,
                rarity: rarity,
                royalties: royalties,
            )
            let editionID = edition.id
            GGCore.editionByID[edition.id] <-! edition

            return editionID
        }

        /// Close an Edition
        ///
        pub fun closeEdition(id: UInt64): UInt64 {
            let edition = (&GGCore.editionByID[id] as &GGCore.Edition?)!
            edition.close()
            return edition.id
        }

        /// Mint a single NFT
        /// The Edition for the given ID must already exist
        ///
        pub fun mintNFT(editionID: UInt64, metadata: {String:String}): @GGCore.NFT {
            pre {
                /// Make sure the edition we are creating this NFT in exists
                GGCore.editionByID.containsKey(editionID): "No such EditionID"
            }

            return <- self.borrowEdition(id: editionID).mint(metadata: metadata)
        }
    }

    ///------------------------------------------------------------
    /// Contract lifecycle
    ///------------------------------------------------------------

    /// GGCore contract initializer
    ///
    init() {
        /// Set the named paths
        self.CollectionStoragePath = /storage/GGCoreNFTCollection
        self.CollectionPublicPath = /public/GGCoreNFTCollection
        self.AdminStoragePath = /storage/GGCoreAdmin
        self.MinterPrivatePath = /private/GGCoreMinter

        /// Initialize the entity counts
        self.totalSupply = 0
        self.nextSetID = 1
        self.nextPlayID = 1
        self.nextEditionID = 1

        /// Initialize the metadata lookup dictionaries
        self.setIDByName = {}
        self.setByID <- {}
        self.playByID <- {}
        self.editionByID <- {}

        /// Create an Admin resource and save it to storage
        let admin <- create Admin()
        self.account.save(<-admin, to: self.AdminStoragePath)
        /// Link capabilites to the admin constrained to the Minter
        /// and Metadata interfaces
        self.account.link<&GGCore.Admin{GGCore.NFTMinter}>(
            self.MinterPrivatePath,
            target: self.AdminStoragePath
        )

        /// Let the world know we are here
        emit ContractInitialized()
    }
}
