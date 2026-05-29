import GGMarketFee from 0xGGMARKETFEE
import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD

// This script returns the beneficiary's capability for receiving a fungible token (FUSD)

pub fun main(): Capability<&{FungibleToken.Receiver}>? {
    return GGMarketFee.getBeneficiaryCapability(ftType: Type<@FUSD.Vault>())
}

