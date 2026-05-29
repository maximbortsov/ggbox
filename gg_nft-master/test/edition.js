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


jest.setTimeout(15000)

describe('Edition tests', () => {

    let invalidAddr

    const playArgs = [
        'Test',                     // Name
        'Desc',                     // Description
        'Game 1',                   // Game
        'Streamer 1',               // Streamer
        'TEST URL',                 // URL
        { title: 'Test Title' },    // Metadata
    ]
    const setArgs = [
        'Test Set',                 // Name
    ]

    beforeEach(async () => {
        const basePath = path.resolve(__dirname, '../cadence')
        const port = 8080
        await init(basePath, { port })
        await emulator.start(port)
        await deployContractByName('FungibleToken')
        await deployContractByName('FUSD')
        await deployContractByName('NonFungibleToken')
        await deployContractByName('MetadataViews')
        await deployContractByName('GGMetadata')
        await deployContractByName('GGMarketFee')
        await deployContractByName('GGInfluencerSystem')
        await deployContractByName('GGCore')

        const addr = await getAccountAddress('Alice')
        invalidAddr = await getAccountAddress('Bob')

        // setup influencer
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [addr] })
        await sendTransaction({ name: 'admin/influencer/set_capability_fusd', args: ['Alice', addr] })
        // create play and set
        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })
        await sendTransaction({ name: 'admin/sets/create_set', args: setArgs })
    })

    afterEach(async () => {
        return emulator.stop()
    })

    const editionArgs = [
        1,                          // Set ID
        1,                          // Play ID
        'Edition One',              // Name
        2,                          // Max mint size
        'Test Rarity',              // Rarity
        { 'Alice': '0.05' },        // Royalties
    ]

    test('create Edition', async () => {
        // invalid signer
        await shallRevert(sendTransaction({
            name: 'admin/editions/create_edition',
            args: editionArgs,
            signers: [invalidAddr],
        }))
        // invalid influencer royalty
        await shallRevert(
            sendTransaction({
                name: 'admin/editions/create_edition',
                args: [1, 1, 'Ed 1', 2, 'Rare', { 'Alice': '1.0' }],
            }),
        )
        // invalid influencer name
        await shallRevert(
            sendTransaction({
                name: 'admin/editions/create_edition',
                args: [1, 1, 'Ed 1', 2, 'Rare', { 'NoAlice': '0.05' }],
            }),
        )

        // valid
        const [tx] = await shallPass(sendTransaction({ name: 'admin/editions/create_edition', args: editionArgs }))
        console.log(tx)
    })

    test('close Edition', async () => {
        await sendTransaction({ name: 'admin/editions/create_edition', args: editionArgs })

        // invalid signer
        await shallRevert(sendTransaction({ name: 'admin/editions/close_edition', args: [1], signers: [invalidAddr] }))
        // invalid edition id
        await shallRevert(sendTransaction({ name: 'admin/editions/close_edition', args: [2] }))

        const [tx] = await shallPass(sendTransaction({ name: 'admin/editions/close_edition', args: [1] }))
        console.log(tx)

        // invalid edition id (this edition has already been closed)
        await shallRevert(sendTransaction({ name: 'admin/editions/close_edition', args: [1] }))
    })

    test('read all Editions', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'editions/read_all_editions' }),
        )
        expect(res).toHaveLength(0)
    })

    test('read one Edition by id', async () => {
        await sendTransaction({ name: 'admin/editions/create_edition', args: editionArgs })
        const [res] = await shallResolve(
            executeScript({ name: 'editions/read_edition_by_id', args: [1] }),
        )
        expect(res).toMatchObject({
            id: 1,
            setID: 1,
            playID: 1,
            name: 'Edition One',
            rarity: 'Test Rarity',
            influencerRoyalties: { Alice: '0.05000000' },
            maxMintSize: 2,
            numMinted: 0,
        })
    })
})
