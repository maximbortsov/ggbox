export const ReadCollectionNftIds =
    `
import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// This script returns an array of all the NFT IDs in an account's collection.

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(GGCore.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs()
}
`

export const ReadCollectionNftLength =
    `
import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// This script returns the size of an account's GGCore collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(GGCore.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs().length
}
`

export const ReadGgNftMetadataTypes =
    `
import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// This script returns all types of Play.
//
pub fun main(address: Address, id: UInt64): [Type] {

    let account = getAccount(address)

    let collectionRef = account.getCapability(GGCore.CollectionPublicPath)
        .borrow<&{GGCore.GGNFTCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    let nft = collectionRef.borrowGGNFT(id: id)!

    // Get the basic display information for this NFT
    let views = nft.getViews()
    return views
}
`

export const ReadGgNftProperties =
    `
import NonFungibleToken from 0xNFTADDRESS
import MetadataViews from 0xMETADATAVIEWS
import GGMetadata from 0xGGMETADATA
import GGCore from 0xGGCORE

// This script returns the size of an account's GGCore collection.

pub struct NFT {
    pub let editionID: UInt64
    pub let serialNumber: UInt64
    pub let mintingDate: UFix64
    pub let owner: Address
    // Display metadata
    pub let name: String
    pub let description: String
    // Clip metadata
    pub let game: String
    pub let streamer: String
    pub let clipDate: UFix64

    init(
        editionID: UInt64,
        serialNumber: UInt64,
        mintingDate: UFix64,
        owner: Address,
        name: String,
        description: String,
        game: String,
        streamer: String,
        clipDate: UFix64,
    ) {
        self.editionID = editionID
        self.serialNumber = serialNumber
        self.mintingDate = mintingDate
        self.owner = owner
        self.name = name
        self.description = description
        self.game = game
        self.streamer = streamer
        self.clipDate = clipDate
    }
}

pub fun main(address: Address, id: UInt64): NFT {
    let account = getAccount(address)

    let collectionRef = account.getCapability(GGCore.CollectionPublicPath)
        .borrow<&{GGCore.GGNFTCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    let nft = collectionRef.borrowGGNFT(id: id)
        ?? panic("Couldn't borrow ggNFT")

    let viewDisplay = nft.resolveView(Type<MetadataViews.Display>())!
    let display = viewDisplay as! MetadataViews.Display

    let viewClip = nft.resolveView(Type<GGMetadata.Clip>())!
    let clip = viewClip as! GGMetadata.Clip

    let owner: Address = nft.owner!.address!

    return NFT(
        editionID: nft.editionID,
        serialNumber: nft.serialNumber,
        mintingDate: nft.mintingDate,
        owner: owner,
        name: display.name,
        description: display.description,
        game: clip.game,
        streamer: clip.streamer,
        clipDate: clip.date,
   )
}
`

export const ReadGgNftSupply =
    `
import GGCore from 0xGGCORE

// This scripts returns the number of GGCore currently in existence.

pub fun main(): UInt64 {
    return GGCore.totalSupply
}
`
