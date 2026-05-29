import FungibleToken from 0xFUNGIBLETOKEN
import GGMarketFee from 0xGGMARKETFEE
import FUSD from 0xFUSD

// This transaction sets an beneficiary's capability for receiving a fungible token (FUSD)

transaction(address: Address) {
    let admin: &GGMarketFee.Admin

    prepare(signer: AuthAccount) {
        self.admin = signer.borrow<&GGMarketFee.Admin>(from: GGMarketFee.AdminStoragePath)
            ?? panic("Could not borrow a reference to the GGMarketFee Admin capability")
    }

    execute {
        let account = getAccount(address)
        let cap = account.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)

        self.admin.setBeneficiaryCapability(ftType: Type<@FUSD.Vault>(), capability: cap)
    }
}
