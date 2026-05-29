/// The Influencer System stores the mappings from the influencer name of an
/// influencer to the vaults in which they'd like to receive tokens.

import FungibleToken from "./FungibleToken.cdc"


pub contract GGInfluencerSystem {

    ///------------------------------------------------------------
    /// Events
    ///------------------------------------------------------------

    /// Contract Events
    ///
    /// Emitted when the contract is created
    pub event ContractInitialized()

    /// Influencer Events
    ///
    /// Emitted when a FT-receiving capability for an influencer has been updated
    /// If address is nil, that means the capability has been removed.
    pub event CapabilityUpdated(influencer: String, ftType: Type, address: Address?)

    ///------------------------------------------------------------
    /// Named values
    ///------------------------------------------------------------

    /// Named Paths
    ///
    pub let AdminStoragePath: StoragePath

    ///------------------------------------------------------------
    /// Publicly readable contract state
    ///------------------------------------------------------------

    /// capabilities is a mapping from influencer name, to fungible token type, to
    /// the capability for a receiver for the fungible token
    pub var capabilities: {String: {String: Capability<&{FungibleToken.Receiver}>}}

    ///------------------------------------------------------------
    /// Influencer
    ///------------------------------------------------------------

    /// Check if an influencer exists in the capabilities
    ///
    pub fun influencerExists(_ influencer: String): Bool {
        if let dict = self.capabilities[influencer] {
            return dict.length != 0
        } else {
            return false
        }
    }

    /// Get the capability for depositing tokens to the influencer
    ///
    pub fun getCapability(influencer: String, ftType: Type): Capability<&{FungibleToken.Receiver}>? {
        let ftID = ftType.identifier

        if let caps = self.capabilities[influencer] {
            return caps[ftID]
        } else {
            return nil
        }
    }

    ///------------------------------------------------------------
    /// Admin
    ///------------------------------------------------------------

    /// Admin is an authorization resource that allows the contract owner
    /// to update values.
    ///
    pub resource Admin {

        /// Update the FT-receiving capability for an influencer
        ///
        pub fun setCapability(influencer: String, ftType: Type, capability: Capability<&{FungibleToken.Receiver}>?) {
            let ftID = ftType.identifier
            if let cap = capability {
                if let caps = GGInfluencerSystem.capabilities[influencer] {
                    caps.insert(key: ftID, cap)
                    GGInfluencerSystem.capabilities[influencer] = caps
                } else {
                    GGInfluencerSystem.capabilities[influencer] = {ftID: cap}
                }

                emit CapabilityUpdated(influencer: influencer, ftType: ftType, address: cap.address)
            } else {
                if let caps = GGInfluencerSystem.capabilities[influencer] {
                    caps.remove(key: ftID)
                    GGInfluencerSystem.capabilities[influencer] = caps
                }

                emit CapabilityUpdated(influencer: influencer, ftType: ftType, address: nil)
            }
        }
    }

    ///------------------------------------------------------------
    /// Contract lifecycle
    ///------------------------------------------------------------

    /// Contract initializer
    ///
    init() {
        self.capabilities = {}

        self.AdminStoragePath = /storage/GGInfluencerSystemAdmin

        /// Create an Admin resource and save it to storage
        let admin <- create Admin()
        self.account.save(<-admin, to: self.AdminStoragePath)

        emit ContractInitialized()
    }
}
