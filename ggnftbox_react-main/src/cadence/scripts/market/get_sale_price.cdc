import GGMarket from 0xGGMARKET

// This script gets the price of a nft in an account's sale collection
// by looking up its unique ID.

pub fun main(sellerAddress: Address, tokenID: UInt64): UFix64 {

    let seller = getAccount(sellerAddress)

    let collectionRef = seller.getCapability(GGMarket.MarketPublicPath).borrow<&{GGMarket.SalePublic}>()
        ?? panic("Could not borrow sale collection from public collection")

    return collectionRef.getPrice(tokenID: tokenID)!
}
