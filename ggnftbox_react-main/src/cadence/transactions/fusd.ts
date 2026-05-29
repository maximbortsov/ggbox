export const SetupFUSDAccount =
    `
import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD

// This transaction configures an account to hold FUSD Vault.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {

            // save FUSD vault to the account
            signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

            // create a public capability for the receiver
            signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
                    /public/fusdReceiver,
                    target: /storage/fusdVault
            )

            // create a public capability for the receiver
            signer.link<&FUSD.Vault{FungibleToken.Balance}>(
                    /public/fusdBalance,
                    target: /storage/fusdVault
            )
        }
    }
}
`