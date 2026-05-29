import GGMarket from 0xGGMARKET

// This script gets the number of nfts an account has for sale

pub fun main(sellerAddress: Address): Int {

    let seller = getAccount(sellerAddress)

    let collectionRef = seller.getCapability(GGMarket.MarketPublicPath)
        .borrow<&{GGMarket.SalePublic}>()
        ?? panic("Could not borrow sale collection from public collection")

    return collectionRef.getIDs().length
}
