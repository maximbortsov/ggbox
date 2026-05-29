import GGInfluencerSystem from 0xGGINFLUENCERSYSTEM
import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD

// This script returns the beneficiary's capability for receiving a fungible token (FUSD)

pub fun main(influencer: String): Capability<&{FungibleToken.Receiver}>? {
    return GGInfluencerSystem.getCapability(influencer: influencer, ftType: Type<@FUSD.Vault>())
}

