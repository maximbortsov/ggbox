import FungibleToken from 0xFUNGIBLETOKEN
import GGInfluencerSystem from 0xGGINFLUENCERSYSTEM
import FUSD from 0xFUSD

// This transaction sets an influencer's capability for receiving a fungible token (FUSD)

transaction(influencer: String, address: Address) {
    let admin: &GGInfluencerSystem.Admin

    prepare(signer: AuthAccount) {
        self.admin = signer.borrow<&GGInfluencerSystem.Admin>(from: GGInfluencerSystem.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGMarketFee Admin capability")
    }

    execute {
        let account = getAccount(address)
        let cap = account.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)

        self.admin.setCapability(influencer: influencer, ftType: Type<@FUSD.Vault>(), capability: cap)
    }
}
