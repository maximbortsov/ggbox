import path from 'path'
import {
    deployContractByName,
    emulator,
    executeScript,
    getAccountAddress,
    getServiceAddress,
    init,
    sendTransaction,
    shallPass,
    shallResolve,
    shallRevert,
} from 'flow-js-testing'


jest.setTimeout(20000)

describe('transfer test', () => {

    let nftArgs
    let addr1
    let addr2

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

        addr1 = await getServiceAddress()
        addr2 = await getAccountAddress('Alice')
        nftArgs = [addr1, 1]

        await sendTransaction({ name: 'setup_gg_account', signers: [addr1] })
        await sendTransaction({ name: 'setup_gg_account', signers: [addr2] })
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [addr2] })
        await sendTransaction({ name: 'admin/influencer/set_capability_fusd', args: ['Alice', addr2] })

        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })
        await sendTransaction({ name: 'admin/sets/create_set', args: setArgs })
        await sendTransaction({ name: 'admin/editions/create_edition', args: editionArgs })
        await sendTransaction({ name: 'admin/nfts/mint_nft', args: [addr1, 1, {}] })
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
    const setArgs = [
        'Test Set',                 // Name
    ]
    const editionArgs = [
        1,                          // Set ID
        1,                          // Play ID
        'Edition One',              // Name
        2,                          // Max mint size
        'Test Rarity',              // Rarity
        { 'Alice': '0.05' },        // Royalties
    ]

    test('transfer nft from A to B', async () => {

        const [res1] = await shallResolve(
            executeScript({ name: 'nfts/read_gg_nft_properties', args: [addr1, 1] }),
        )
        expect(res1.owner).toBe(addr1)

        // invalid nft id
        await shallRevert(sendTransaction({ name: 'nfts/transfer_nft', args: [addr2, 2] }))
        // invalid signer
        await shallRevert(sendTransaction({ name: 'nfts/transfer_nft', args: [addr2, 1], signers: [addr2] }))

        const [tx] = await shallPass(
            sendTransaction({ name: 'nfts/transfer_nft', args: [addr2, 1], signers: [addr1] }),
        )
        console.log(tx)

        const [res2] = await shallResolve(
            executeScript({ name: 'nfts/read_gg_nft_properties', args: [addr2, 1] }),
        )
        expect(res2.owner).toBe(addr2)
    })
})
