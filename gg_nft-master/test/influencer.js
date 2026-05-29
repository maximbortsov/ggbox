import path from 'path'
import {
    deployContractByName,
    emulator,
    executeScript,
    getAccountAddress,
    init,
    sendTransaction,
    shallPass,
    shallResolve,
    shallRevert,
} from 'flow-js-testing'


jest.setTimeout(10000)

describe('GGInfluencerSystem tests', () => {

    let addr
    let invalidAddr

    beforeEach(async () => {
        const basePath = path.resolve(__dirname, '../cadence')
        const port = 8080
        await init(basePath, { port })
        await emulator.start(port)
        await deployContractByName('FungibleToken')
        await deployContractByName('FUSD')
        await deployContractByName('GGInfluencerSystem')

        addr = await getAccountAddress('Alice')
        invalidAddr = await getAccountAddress('Bob')

        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [addr] })
    })

    afterEach(async () => {
        return emulator.stop()
    })

    test('set influencer\'s capability', async () => {
        // invalid signer
        await shallRevert(
            sendTransaction({
                name: 'admin/influencer/set_capability_fusd',
                args: ['Alice', addr],
                signers: [invalidAddr],
            }),
        )

        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/influencer/set_capability_fusd', args: ['Alice', addr] }),
        )
        console.log(tx)
    })

    test('read influencer\'s capability', async () => {
        await sendTransaction({ name: 'admin/influencer/set_capability_fusd', args: ['Alice', addr] })

        const [res] = await shallResolve(
            executeScript({ name: 'influencer/read_capability_fusd', args: ['Alice'] }),
        )
        expect(res.address).toEqual(addr)
    })
})
