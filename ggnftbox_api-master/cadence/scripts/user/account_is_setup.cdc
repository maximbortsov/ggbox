import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// Check to see if an account looks like it has been set up to hold GGCore NFTs.

pub fun main(address: Address): Bool {
    return getAccount(address)
        .getCapability<&{NonFungibleToken.CollectionPublic,GGCore.GGNFTCollectionPublic}>(GGCore.CollectionPublicPath)
        .check()
}

