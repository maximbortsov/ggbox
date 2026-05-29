import config from './config'
import * as fcl from '@onflow/fcl'


const flowConfig = config().flow
const address = fcl.withPrefix(flowConfig.admin.address)

export const testnetFclConfig = {
    'flow.network': 'testnet',
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
    'app.detail.key': 'GGNFTBOX',
    '0xGGCORE': address,
    '0xGGMARKETFEE': address,
    '0xGGMARKET': address,
    '0xGGMETADATA': address,
    '0xGGINFLUENCERSYSTEM': address,
    '0xFUNGIBLETOKEN': '0x9a0766d93b6608b7',
    '0xNFTADDRESS': '0x631e88ae7f1d7c20',
    '0xFUSD': '0xe223d8a629e49c68',
    '0xMETADATAVIEWS': '0x631e88ae7f1d7c20',
}

export const emulatorFclConfig = {
    'flow.network': 'emulator',
    'accessNode.api': 'http://localhost:8888',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
    'app.detail.key': 'GGNFTBOX',
    '0xGGCORE': '0xf8d6e0586b0a20c7',
    '0xGGMARKETFEE': '0xf8d6e0586b0a20c7',
    '0xGGMARKET': '0xf8d6e0586b0a20c7',
    '0xGGMETADATA': '0xf8d6e0586b0a20c7',
    '0xGGINFLUENCERSYSTEM': '0xf8d6e0586b0a20c7',
    '0xFUNGIBLETOKEN': '0xee82856bf20e2aa6',
    '0xNFTADDRESS': '0xf8d6e0586b0a20c7',
    '0xFUSD': '0xf8d6e0586b0a20c7',
    '0xMETADATAVIEWS': '0xf8d6e0586b0a20c7',
}
