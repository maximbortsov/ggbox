import GGMarket from 0xGGMARKET

// Check that the account has a SaleCollection for putting up for sale GGNFTs

pub fun main(address: Address): Bool {
    return getAccount(address)
        .getCapability<&{GGMarket.SalePublic}>(GGMarket.MarketPublicPath)
        .check()
}

