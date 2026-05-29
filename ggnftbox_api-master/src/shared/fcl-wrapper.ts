import * as fcl from '@onflow/fcl'
import readCodeTx from './flow/read-code-tx'
import { emulatorFclConfig, testnetFclConfig } from '../config/fcl'
import { proposer, signer } from './flow/signer'
import config from '../config/config'


const flowConfig = config().flow
switch (flowConfig.chain) {
    case 'testnet': {
        fcl.config(testnetFclConfig)
        break
    }
    case 'emulator': {
        fcl.config(emulatorFclConfig)
        break
    }
    case 'mainnet': {
        throw new Error('MAINNET NO SUPPORT')
    }
    default: {
        throw new Error('No chain provider')
    }
}
fcl.currentUser = signer(flowConfig.admin.address, flowConfig.admin.privateKey)

const p = proposer(flowConfig.admin.address, flowConfig.admin.privateKey, flowConfig.admin.maxPubKeyIx)

export async function sendFlowTx(data: { pathTx: string; args?: (arg, t) => any[] }): Promise<any> {
    console.log(flowConfig)
    console.log(fcl.config)

    const txId = await fcl.mutate({
        cadence: readCodeTx(data.pathTx),
        args: data.args,
        proposer: p,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: flowConfig.limit,
    })
    return fcl.tx(txId).onceSealed()
}
