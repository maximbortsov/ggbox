import FungibleToken from "./FungibleToken.cdc"


pub contract GGMarketFee {

    ///------------------------------------------------------------
    /// Events
    ///------------------------------------------------------------

    /// Contract Events
    ///
    /// Emitted when the contract is created
    pub event ContractInitialized()

    /// Beneficiary Events
    ///
    /// Emitted when a FT-receiving capability for an beneficiary has been updated
    /// If address is nil, that means the capability has been removed.
    pub event BeneficiaryCapabilityUpdated(ftType: Type, address: Address?)

    /// Emitted when the default cut percentage has been updated
    pub event BeneficiaryFeeUpdated(fee: UFix64)

    /// Seller Events
    ///
    /// Emitted when the seller fee has been updated
    pub event SellerFeeUpdated(fee: UFix64)

    /// Buyer Events
    ///
    /// Emitted when the buyer fee has been updated
    pub event BuyerFeeUpdated(fee: UFix64)

    /// Rate Events
    ///
    /// Emitted when rates has been updated
    pub event RatesUpdated(maxFeeRate: UFix64, maxRoyaltyRate: UFix64, minRewardRate: UFix64)

    ///------------------------------------------------------------
    /// Named values
    ///------------------------------------------------------------

    /// Named Paths
    ///
    pub let AdminStoragePath: StoragePath

    ///------------------------------------------------------------
    /// Publicly readable contract state
    ///------------------------------------------------------------

    /// Beneficiary capabilities
    ///
    pub var beneficiaryCapabilities: {String: Capability<&{FungibleToken.Receiver}>}

    /// Default beneficiary fee
    ///
    pub var beneficiaryFee: UFix64

    /// Seller fee [0..1)
    ///
    pub var sellerFee: UFix64

    /// Buyer fee [0..1)
    ///
    pub var buyerFee: UFix64

    /// The upper possible limit of the sum of sellerFee, buyerFee, beneficiaryFee
    ///
    pub var maxFeeRate: UFix64

    /// The upper possible limit of the sum of royalties
    ///
    pub var maxRoyaltyRate: UFix64

    /// The lower guaranteed limit of the user's reward from the sale of NFT
    ///
    pub var minRewardRate: UFix64

    ///------------------------------------------------------------
    /// Beneficiary
    ///------------------------------------------------------------

    /// Get the capability for depositing tokens to the beneficiary
    pub fun getBeneficiaryCapability(ftType: Type): Capability<&{FungibleToken.Receiver}>? {
        let ftID = ftType.identifier
        return self.beneficiaryCapabilities[ftID]
    }

    ///------------------------------------------------------------
    /// Admin
    ///------------------------------------------------------------

    /// Admin is an authorization resource that allows the contract owner
    /// to update values
    ///
    pub resource Admin {

        /// Update the FT-receiving capability for an beneficiary
        ///
        pub fun setBeneficiaryCapability(ftType: Type, capability: Capability<&{FungibleToken.Receiver}>?) {
            let ftID = ftType.identifier
            if let cap = capability {
                GGMarketFee.beneficiaryCapabilities.insert(key: ftID, cap)

                emit BeneficiaryCapabilityUpdated(ftType: ftType, address: cap.address)
            } else {
                GGMarketFee.beneficiaryCapabilities.remove(key: ftID)

                emit BeneficiaryCapabilityUpdated(ftType: ftType, address: nil)
            }
        }

        /// Update the default fee
        ///
        pub fun setBeneficiaryFee(_ fee: UFix64) {
            pre {
                fee + GGMarketFee.sellerFee + GGMarketFee.buyerFee <= GGMarketFee.maxFeeRate:
                    "The sum of fees should not be more than "
                        .concat(GGMarketFee.maxFeeRate.toString())
            }
            GGMarketFee.beneficiaryFee = fee

            emit BeneficiaryFeeUpdated(fee: fee)
        }

        /// Update the seller fee
        ///
        pub fun setSellerFee(_ fee: UFix64) {
            pre {
                fee + GGMarketFee.beneficiaryFee + GGMarketFee.buyerFee <= GGMarketFee.maxFeeRate:
                    "The sum of fees should not be more than "
                        .concat(GGMarketFee.maxFeeRate.toString())
            }
            GGMarketFee.sellerFee = fee

            emit SellerFeeUpdated(fee: fee)
        }

        /// Update the buyer fee
        ///
        pub fun setBuyerFee(_ fee: UFix64) {
            pre {
                fee + GGMarketFee.beneficiaryFee + GGMarketFee.sellerFee <= GGMarketFee.maxFeeRate:
                    "The sum of fees should not be more than "
                        .concat(GGMarketFee.maxFeeRate.toString())
            }
            GGMarketFee.buyerFee = fee

            emit BuyerFeeUpdated(fee: fee)
        }

        /// Update rates
        ///
        pub fun setRates(maxFeeRate: UFix64, maxRoyaltyRate: UFix64, minRewardRate: UFix64) {
            pre {
                maxFeeRate + maxRoyaltyRate + minRewardRate == 1.0:
                    "The sum of rates should be equal to 1.0"
                GGMarketFee.buyerFee + GGMarketFee.beneficiaryFee + GGMarketFee.sellerFee <= maxFeeRate:
                    "Invalid maxFeeRate"
            }
            GGMarketFee.maxFeeRate = maxFeeRate
            GGMarketFee.maxRoyaltyRate = maxRoyaltyRate
            GGMarketFee.minRewardRate = minRewardRate

            emit RatesUpdated(maxFeeRate: maxFeeRate, maxRoyaltyRate: maxRoyaltyRate, minRewardRate: minRewardRate)
        }
    }

    ///------------------------------------------------------------
    /// Contract lifecycle
    ///------------------------------------------------------------

    /// Contract initializer
    ///
    init() {
        self.beneficiaryCapabilities = {}
        self.beneficiaryFee = 0.05
        self.sellerFee = 0.05
        self.buyerFee = 0.0

        self.maxFeeRate = 0.15
        self.maxRoyaltyRate = 0.05
        self.minRewardRate = 0.8

        self.AdminStoragePath = /storage/GGMarketFeeAdmin

        /// Create an Admin resource and save it to storage
        let admin <- create Admin()
        self.account.save(<-admin, to: self.AdminStoragePath)

        emit ContractInitialized()
    }
}
