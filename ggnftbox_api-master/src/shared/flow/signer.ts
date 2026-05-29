// Thanks to MaxStalker, Jacob Tucker, etc

import { SHA3 } from 'sha3'
import { ec as EC } from 'elliptic'
import * as fcl from '@onflow/fcl'


const ec = new EC('p256')

const hashMsgHex = (msgHex: string) => {
    const sha = new SHA3(256)
    sha.update(Buffer.from(msgHex, 'hex'))
    return sha.digest()
}

export const signWithKey = (privateKey: string, msgHex: string): string => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'))
    const sig = key.sign(hashMsgHex(msgHex))
    const n = 32
    const r = sig.r.toArrayLike(Buffer, 'be', n)
    const s = sig.s.toArrayLike(Buffer, 'be', n)
    return Buffer.concat([r, s]).toString('hex')
}

export const signer = (accountAddress: string, pkey: string) => async (account: any): Promise<any> => {
    const keyId = 0

    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        // tempIds are more of an advanced topic, for 99% of the times when you know the address and keyId you will want it to be a unique string per that address and keyId
        tempId: `${accountAddress}-${keyId}`,
        // the address of the signatory, currently it needs to be without a prefix right now
        addr: fcl.sansPrefix(accountAddress),
        // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        keyId: Number(keyId),
        signingFunction: async (signable: any): Promise<any> => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            const signature = signWithKey(pkey, signable.message)
            return {
                // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                addr: fcl.withPrefix(accountAddress),
                // needs to be the same as account.keyId, once again make sure its a number and not a string
                keyId: Number(keyId),
                // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
                signature,
            }
        },
    }
}

let KEY_ID_ITERABLE = 0
export const proposer = (accountAddress: string, pkey: string, maxKeyIx: number) => async (account: any): Promise<any> => {
    if (KEY_ID_ITERABLE >= maxKeyIx) {
        KEY_ID_ITERABLE = 0
    } else {
        KEY_ID_ITERABLE++
    }
    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        tempId: `${accountAddress}-${KEY_ID_ITERABLE}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
        addr: fcl.sansPrefix(accountAddress), // the address of the signatory, currently it needs to be without a prefix right now
        keyId: Number(KEY_ID_ITERABLE), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        signingFunction: async (signable: any): Promise<any> => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            const signature = signWithKey(pkey, signable.message)
            return {
                // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                addr: fcl.withPrefix(accountAddress),
                // needs to be the same as account.keyId, once again make sure its a number and not a string
                keyId: Number(KEY_ID_ITERABLE),
                // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
                signature,
            }
        },
    }
}
