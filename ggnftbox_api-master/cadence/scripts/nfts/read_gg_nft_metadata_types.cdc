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

