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

