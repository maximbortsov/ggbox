/**
    This contract is mostly copied from the MarketEternal contract but with
    modifications
*/

import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import GGCore from "./GGCore.cdc"
import GGMarketFee from "./GGMarketFee.cdc"
import GGInfluencerSystem from "./GGInfluencerSystem.cdc"

pub contract GGMarket {

    ///------------------------------------------------------------
    /// Events
    ///------------------------------------------------------------

    /// Contract Events
    ///
    pub event ContractInitialized()

    /// NFT Events
    ///
    /// emitted when a GGNFT is listed for sale
    pub event NFTListed(id: UInt64, price: UFix64, seller: Address?)
    /// emitted when the price of a listed ggnft has changed
    pub event NFTPriceChanged(id: UInt64, newPrice: UFix64, seller: Address?)
    /// emitted when a token is purchased from the market
    pub event NFTPurchased(id: UInt64, price: UFix64, seller: Address?)
    /// emitted when a ggnft has been withdrawn from the sale
    pub event NFTWithdrawn(id: UInt64, owner: Address?)

    /// Cut Events
    ///
    /// emitted when an influencer has received a cut
    pub event CutReceived(address: Address, ftType: Type, amount: UFix64)

    ///------------------------------------------------------------
    /// Named values
    ///------------------------------------------------------------

    /// Named Paths
    ///
    pub let MarketStoragePath: StoragePath
    pub let MarketPublicPath: PublicPath

    ///------------------------------------------------------------
    /// Sale Cut
    ///------------------------------------------------------------

    /// SaleCut
    /// A struct representing a recipient that must be sent a certain amount
    /// of the payment when a token is sold.
    ///
    pub struct SaleCut {
        /// The receiver for the payment.
        /// Note that we do not store an address to find the Vault that this represents,
        /// as the link or resource that we fetch in this way may be manipulated,
        /// so to find the address that a cut goes to you must get this struct and then
        /// call receiver.borrow()!.owner.address on it.
        /// This can be done efficiently in a script.
        pub let receiver: Capability<&{FungibleToken.Receiver}>

        /// The amount of the payment FungibleToken that will be paid to the receiver.
        pub let amount: UFix64

        /// initializer
        ///
        init(receiver: Capability<&{FungibleToken.Receiver}>, amount: UFix64) {
            self.receiver = receiver
            self.amount = amount
        }
    }

    ///------------------------------------------------------------
    /// Listing Details
    ///------------------------------------------------------------

    /// ListingDetails
    /// A struct containing a Listing's data.
    ///
    pub struct ListingDetails {
        /// The Type of the NonFungibleToken.NFT that is being listed.
        pub let nftType: Type
        /// The ID of the NFT within that type.
        pub let nftID: UInt64
        /// The amount that must be paid in the specified FungibleToken.
        pub let salePrice: UFix64
        /// This specifies the division of payment between recipients.
        pub let saleCuts: [SaleCut]

        /// initializer
        ///
        init (
            nftType: Type,
            nftID: UInt64,
            saleCuts: [SaleCut],
        ) {
            self.nftType = nftType
            self.nftID = nftID

            /// Store the cuts
            assert(saleCuts.length > 0, message: "Listing must have at least one payment cut recipient")
            self.saleCuts = saleCuts

            /// Calculate the total price from the cuts
            var salePrice = 0.0
            /// Perform initial check on capabilities, and calculate sale price from cut amounts.
            for cut in self.saleCuts {
                /// Make sure we can borrow the receiver.
                /// We will check this again when the token is sold.
                cut.receiver.borrow() ?? panic("Cannot borrow receiver")
                /// Add the cut amount to the total price
                salePrice = salePrice + cut.amount
            }
            assert(salePrice > 0.0, message: "Listing must have non-zero price")

            /// Store the calculated sale price
            self.salePrice = salePrice
        }
    }

    ///------------------------------------------------------------
    /// Sale Collection
    ///------------------------------------------------------------

    /// SalePublic
    ///
    /// The interface that a user can publish a capability to their sale
    /// to allow others to access their sale
    pub resource interface SalePublic {
        pub fun purchase(tokenID: UInt64, buyTokens: @FungibleToken.Vault): @GGCore.NFT {
            post {
                result.id == tokenID: "The ID of the withdrawn token must be the same as the requested ID"
            }
        }
        pub fun getPrice(tokenID: UInt64): UFix64?
        pub fun getIDs(): [UInt64]
        pub fun borrowGGNFT(id: UInt64): &GGCore.NFT? {
            /// If the result isn't nil, the id of the returned reference
            /// should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow GGNFT reference: The ID of the returned reference is incorrect"
            }
        }
    }

    /// SaleCollection
    ///
    /// This is the main resource that token sellers will store in their account
    /// to manage the NFTs that they are selling. The SaleCollection
    /// holds a GGCore Collection resource to store the nfts that are for sale.
    /// The SaleCollection also keeps track of the price of each token.
    ///
    pub resource SaleCollection: SalePublic {

        /// A collection of the ggnfts that the user has for sale
        ///
        access(self) var forSale: @GGCore.Collection

        /// Mapping from tokenID to listing details
        ///
        access(self) var details: {UInt64:ListingDetails}

        /// The fungible token vault of the seller
        /// for transfering token received from purchases
        ///
        access(self) var ownerCapability: Capability<&{FungibleToken.Receiver}>

        /// The fungible token that should be used to transact with this
        /// sale collection.
        ///
        pub var ftType: Type

        /// SaleCollection initializer
        ///
        init (ftType: Type, ownerCapability: Capability<&{FungibleToken.Receiver}>) {
            pre {
                ownerCapability.check(): "Invalid owner's capability"
            }
            assert(
                ownerCapability.borrow()!.isInstance(ftType),
                message: "Invalid FT type of owner's capability"
            )

            /// create an empty collection to store the nfts that are for sale
            self.forSale <- GGCore.createEmptyCollection() as! @GGCore.Collection
            self.ownerCapability = ownerCapability
            /// prices are initially empty because there are no nfts for sale
            self.details = {}
            self.ftType = ftType
        }

        /// listForSale lists an NFT for sale in this sale collection
        /// at the specified price
        ///
        pub fun listForSale(token: @GGCore.NFT, price: UFix64) {
            pre {
                price > 0.0: "Price must be greater than 0.0"
            }

            /// Get the ID of the token
            let id = token.id

            var saleCuts: [SaleCut] = self.getSaleCuts(price: price, tokenRef: &token as &GGCore.NFT)

            /// Create details and store it
            self.details[id] = ListingDetails(
                nftType: token.getType(),
                nftID: id,
                saleCuts: saleCuts
            )

            /// Get sale price
            let salePrice = self.details[id]!.salePrice

            /// Deposit the token into the sale collection
            self.forSale.deposit(token: <-token)

            emit NFTListed(id: id, price: salePrice, seller: self.owner?.address)
        }

        /// Withdraw removes a nft that was listed for sale
        /// and clears its price
        ///
        pub fun withdraw(tokenID: UInt64): @GGCore.NFT {

            /// Remove and return the token.
            /// Will revert if the token doesn't exist
            let token <- self.forSale.withdraw(withdrawID: tokenID) as! @GGCore.NFT

            /// Remove details from the prices dictionary
            self.details.remove(key: tokenID)

            /// Emit the event for withdrawing a nft from the Sale
            emit NFTWithdrawn(id: token.id, owner: self.owner?.address)

            /// Return the withdrawn token
            return <-token
        }

        /// purchase lets a user send tokens to purchase an NFT that is for sale
        /// the purchased NFT is returned to the transaction context that called it
        ///
        pub fun purchase(tokenID: UInt64, buyTokens: @FungibleToken.Vault): @GGCore.NFT {
            pre {
                self.forSale.ownedNFTs[tokenID] != nil && self.details[tokenID] != nil:
                    "No token matching this ID for sale"
                buyTokens.balance == (self.getPrice(tokenID: tokenID) ?? UFix64(0)):
                    "Incorrect sum of payment tokens"
            }
            assert(buyTokens.isInstance(self.ftType), message: "Payment vault is not requested fungible token")

            /// Read details, sale cuts, price
            let details = self.details[tokenID]!
            /// Return the purchased token
            let nft <- self.withdraw(tokenID: tokenID)

            /// Transfer sale cuts
            for cut in details.saleCuts {
                let ref = cut.receiver.borrow()
                    ?? panic("Cannot find a token receiver")
                ref.deposit(from: <-buyTokens.withdraw(amount: cut.amount))
                emit CutReceived(address: cut.receiver.address, ftType: self.ftType, amount: cut.amount)
            }

            destroy buyTokens

            emit NFTPurchased(id: tokenID, price: details.salePrice, seller: self.owner?.address)
            return <-nft
        }

        /// Private function for sale cuts creation
        ///
        access(self) fun getSaleCuts(price: UFix64, tokenRef: &GGCore.NFT): [SaleCut] {

            let edition = GGCore.getEditionData(id: tokenRef.editionID)
            let royalties = edition.influencerRoyalties

            var saleCuts: [SaleCut] = []

            /// Add influencer's royalties
            for influencer in royalties.keys {
                let royaltyRate = royalties[influencer]!
                if (royaltyRate > 0.0) {
                    let receiver = GGInfluencerSystem.getCapability(influencer: influencer, ftType: self.ftType)
                        ?? panic("Cannot find the influencer in the influencer system")
                    saleCuts.append(
                        SaleCut(
                            receiver: receiver,
                            amount: price * royaltyRate
                        )
                    )
                }
            }

            let beneficiary = GGMarketFee.getBeneficiaryCapability(ftType: self.ftType)
                ?? panic("Cannot find the FT type in beneficiary's capabilities")

            /// Add beneficiary's fee
            if (GGMarketFee.beneficiaryFee > 0.0) {
                saleCuts.append(
                    SaleCut(
                        receiver: beneficiary,
                        amount: price * GGMarketFee.beneficiaryFee
                    )
                )
            }
            /// Add buyer's fee
            if (GGMarketFee.buyerFee > 0.0) {
                saleCuts.append(
                    SaleCut(
                        receiver: beneficiary,
                        amount: price * GGMarketFee.buyerFee
                    )
                )
            }

            /// Add seller's fee
            if (GGMarketFee.sellerFee > 0.0) {
                saleCuts.append(
                    SaleCut(
                        receiver: beneficiary,
                        amount: price * GGMarketFee.sellerFee
                    )
                )
            }

            /// Add owner's cut
            saleCuts.append(
                SaleCut(
                    receiver: self.ownerCapability,
                    amount: price
                )
            )

            return saleCuts
        }

        /// changePrice changes the price of a token that is currently for sale
        ///
        pub fun changePrice(tokenID: UInt64, newPrice: UFix64) {
            pre {
                self.details[tokenID] != nil: "The token is not for sale"
                newPrice > 0.0: "Price must be greater than 0.0"
            }
            /// Get token
            let token <- self.forSale.withdraw(withdrawID: tokenID) as! @GGCore.NFT
            /// Create sale cuts
            let saleCuts = self.getSaleCuts(price: newPrice, tokenRef: &token as &GGCore.NFT)
            /// Read token type
            let nftType = token.getType()
            /// Return token to the sale collection
            self.forSale.deposit(token: <-token)

            self.details[tokenID] = ListingDetails(
                nftType: nftType,
                nftID: tokenID,
                saleCuts: saleCuts
            )

            /// Get sale price
            let salePrice = self.details[tokenID]!.salePrice

            emit NFTPriceChanged(id: tokenID, newPrice: salePrice, seller: self.owner?.address)
        }

        /// changeOwnerReceiver updates the capability for the sellers fungible token Vault
        ///
        pub fun changeOwnerReceiver(_ newOwnerCapability: Capability<&{FungibleToken.Receiver}>) {
            pre {
                newOwnerCapability.check(): "Owner's Receiver Capability is invalid!"
            }
            self.ownerCapability = newOwnerCapability
        }

        /// getPrice returns the price of a specific token in the sale
        ///
        pub fun getPrice(tokenID: UInt64): UFix64? {
            return self.details[tokenID]?.salePrice
        }

        /// getIDs returns an array of token IDs that are for sale
        ///
        pub fun getIDs(): [UInt64] {
            return self.forSale.getIDs()
        }

        /// borrowGGNFT returns a borrowed reference to a nft in the collection
        /// so that the caller can read data from it
        ///
        pub fun borrowGGNFT(id: UInt64): &GGCore.NFT? {
            let ref = self.forSale.borrowGGNFT(id: id)
            return ref
        }

        /// If the sale collection is destroyed,
        /// destroy the tokens that are for sale inside of it
        ///
        destroy() {
            destroy self.forSale
        }
    }

    /// createCollection returns a new collection resource to the caller
    ///
    pub fun createSaleCollection(ftType: Type, ownerCapability: Capability<&{FungibleToken.Receiver}>): @SaleCollection {
        return <- create SaleCollection(ftType: ftType, ownerCapability: ownerCapability)
    }

    ///------------------------------------------------------------
    /// Contract lifecycle
    ///------------------------------------------------------------

    /// GGMarket contract initializer
    ///
    init() {
        /// Set the named paths
        self.MarketStoragePath = /storage/GGMarketSaleCollection
        self.MarketPublicPath = /public/GGMarketSaleCollection

        /// Let the world know we are here
        emit ContractInitialized()
    }
}
