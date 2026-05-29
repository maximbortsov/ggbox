import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD
import NonFungibleToken from 0xNFTADDRESS
import GGCore from 0xGGCORE

// Check to see if an account looks like it has been set up to hold GGCore NFTs and FUSD.

pub fun main(address: Address): Bool {
    let fusd = getAccount(address)
         .getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance)
         .check()
    let ggCore = getAccount(address)
         .getCapability<&{NonFungibleToken.CollectionPublic,GGCore.GGNFTCollectionPublic}>(GGCore.CollectionPublicPath)
         .check()
    return fusd && ggCore
}

