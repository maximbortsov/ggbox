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

describe('Play tests', () => {

    let invalidAddr

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

        invalidAddr = await getAccountAddress('Alice')
    })

    afterEach(async () => {
        return emulator.stop()
    })

    const playArgs = [
        'Test',                     // Name
        'Desc',                     // Description
        'Game 1',                   // Game
        'Streamer 1',               // Streamer
        'TEST URL',                 // URL
        { title: 'Test Title' },    // Metadata
    ]

    test('create Play', async () => {
        const [tx] = await shallPass(sendTransaction({ name: 'admin/plays/create_play', args: playArgs }))
        console.log(tx)

        // invalid signer
        await shallRevert(sendTransaction({ name: 'admin/plays/create_play', args: playArgs, signers: [invalidAddr] }))
    })

    test('read all Plays', async () => {
        const [res] = await shallResolve(executeScript({ name: 'plays/read_all_plays' }))
        expect(res).toHaveLength(0)
    })

    test('read one Play', async () => {
        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })

        const [res] = await shallResolve(
            executeScript({ name: 'plays/read_play_by_id', args: [1] }),
        )
        expect(res).toMatchObject({
            id: 1,
            name: 'Test',
            description: 'Desc',
            game: 'Game 1',
            streamer: 'Streamer 1',
            url: 'TEST URL',
            metadata: { title: 'Test Title' },
        })
    })

    test('change streamer of Play', async () => {
        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })

        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/plays/change_streamer_of_play', args: [1, 'Streamer 1.1'] }),
        )
        console.log(tx)

        const [res] = await shallResolve(
            executeScript({ name: 'plays/read_play_by_id', args: [1] }),
        )
        expect(res.streamer).toEqual('Streamer 1.1')

        // invalid signer
        await shallRevert(
            sendTransaction({
                name: 'admin/plays/change_streamer_of_play',
                args: [1, 'Streamer 1.1'],
                signers: [invalidAddr],
            }),
        )
    })

    test('change game of Play', async () => {
        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })

        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/plays/change_game_of_play', args: [1, 'Game 1.1'] }),
        )
        console.log(tx)

        const [res] = await shallResolve(
            executeScript({ name: 'plays/read_play_by_id', args: [1] }),
        )
        expect(res.game).toEqual('Game 1.1')

        // invalid signer
        await shallRevert(
            sendTransaction({
                name: 'admin/plays/change_game_of_play',
                args: [1, 'Game 1.1'],
                signers: [invalidAddr],
            }),
        )
    })

    test.skip('change additional metadata of Play', async () => {
        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })

        const [tx1] = await shallPass(
            sendTransaction({ name: 'admin/plays/add_metadata_to_play', args: [1, { test: 'Test' }] }),
        )
        console.log(tx1)

        const [res1] = await shallResolve(
            executeScript({ name: 'plays/read_play_by_id', args: [1] }),
        )
        expect(res1.metadata).toMatchObject({ title: 'Test Title', test: 'Test' })

        const [tx2] = await shallPass(
            sendTransaction({ name: 'admin/plays/add_metadata_to_play', args: [1, { test: null }] }),
        )
        console.log(tx2)

        const [res2] = await shallResolve(
            executeScript({ name: 'plays/read_play_by_id', args: [1] }),
        )
        expect(res2.metadata).toMatchObject({ title: 'Test Title' })

        // invalid signer
        await shallRevert(
            sendTransaction({
                name: 'admin/plays/add_metadata_to_play',
                args: [1, { testNew: 'Test New' }],
                signers: [invalidAddr],
            }),
        )
    })
})
