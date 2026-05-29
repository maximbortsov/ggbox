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
} from 'flow-js-testing'


jest.setTimeout(10000)

describe('new users test', () => {

    beforeEach(async () => {
        const basePath = path.resolve(__dirname, '../cadence')
        const port = 8080
        await init(basePath, { port })
        await emulator.start(port)
        await deployContractByName('NonFungibleToken')
        await deployContractByName('MetadataViews')
        await deployContractByName('GGMetadata')
        await deployContractByName('GGMarketFee')
        await deployContractByName('GGInfluencerSystem')
        await deployContractByName('GGCore')
    })

    afterEach(async () => {
        return emulator.stop()
    })

    test('setup account', async () => {
        const [tx] = await shallPass(sendTransaction({ name: 'setup_gg_account' }))
        console.log(tx)
    })

    test('check account is setup', async () => {
        const addr = await getAccountAddress('Alice')
        const [res1] = await shallResolve(
            executeScript({ name: 'user/account_is_gg_setup', args: [addr] }),
        )
        expect(res1).toBeFalsy()
        await sendTransaction({ name: 'setup_gg_account', signers: [addr] })
        const [res2] = await shallResolve(
            executeScript({ name: 'user/account_is_gg_setup', args: [addr] }),
        )
        expect(res2).toBeTruthy()
    })
})
