import GGMarket from 0x61da1a7a40700bf4

// This script gets nfts an account has for sale

pub fun main(sellerAddress: Address): [UInt64] {

    let seller = getAccount(sellerAddress)

    let collectionRef = seller.getCapability(GGMarket.MarketPublicPath)
        .borrow<&{GGMarket.SalePublic}>()
        ?? panic("Could not borrow sale collection from public collection")

    return collectionRef.getIDs()
}
