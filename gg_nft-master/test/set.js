import path from 'path'
import {
    deployContractByName,
    emulator,
    executeScript,
    init,
    sendTransaction,
    shallPass,
    shallResolve,
} from 'flow-js-testing'


describe('Set tests', () => {

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

    const setArgs = [
        'Test Set',          // Name
    ]

    test('create Set', async () => {
        const [tx] = await shallPass(sendTransaction({ name: 'admin/sets/create_set', args: setArgs }))
        console.log(tx)
    })

    test('read all Set names', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'sets/read_all_set_names' }),
        )
        expect(res).toHaveLength(0)
    })

    test('read all Sets', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'sets/read_all_sets' }),
        )
        expect(res).toHaveLength(0)
    })

    test('read one Set by id', async () => {
        await sendTransaction({ name: 'admin/sets/create_set', args: setArgs })
        const [res] = await shallResolve(
            executeScript({ name: 'sets/read_set_by_id', args: [1] }),
        )
        expect(res).toMatchObject({
            id: 1,
            name: 'Test Set',
            setPlaysInEditions: {},
        })
    })

    test('read one Set by name', async () => {
        await sendTransaction({ name: 'admin/sets/create_set', args: setArgs })
        const [res] = await shallResolve(
            executeScript({ name: 'sets/read_set_by_name', args: ['Test Set'] }),
        )
        expect(res).toMatchObject({
            id: 1,
            name: 'Test Set',
            setPlaysInEditions: {},
        })
    })
})
