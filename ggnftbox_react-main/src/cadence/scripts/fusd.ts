export const GetFUSDBalance =
    `import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)

    let vaultRef = account.getCapability(/public/fusdBalance)!
        .borrow<&FUSD.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}`

export const CheckFUSDVaultSetup =
    `
import FungibleToken from 0xFUNGIBLETOKEN
import FUSD from 0xFUSD

pub fun main(address: Address): Bool {
    let account = getAccount(address)

    let receiverRef = account.getCapability(/public/fusdReceiver)!
        .borrow<&FUSD.Vault{FungibleToken.Receiver}>()
        ?? nil

    let balanceRef = account.getCapability(/public/fusdBalance)!
        .borrow<&FUSD.Vault{FungibleToken.Balance}>()
        ?? nil

    return (receiverRef != nil) && (balanceRef != nil)
}
`