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

describe('NFT tests', () => {

    let nftArgs
    let addr
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
    const editionArgs = [
        1,                          // Set ID
        1,                          // Play ID
        'Edition One',              // Name
        2,                          // Max mint size
        'Test Rarity',              // Rarity
        { 'Alice': '0.05' },        // Royalties
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

        addr = await getAccountAddress('Alice')
        invalidAddr = await getAccountAddress('Bob')
        nftArgs = [addr, 1, { 'Test': 'Test' }]

        await sendTransaction({ name: 'setup_gg_account', signers: [addr] })
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [addr] })
        await sendTransaction({ name: 'admin/influencer/set_capability_fusd', args: ['Alice', addr] })

        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })
        await sendTransaction({ name: 'admin/sets/create_set', args: setArgs })
        await sendTransaction({ name: 'admin/editions/create_edition', args: editionArgs })
    })

    afterEach(async () => {
        return emulator.stop()
    })

    test('mint NFT', async () => {
        const [tx] = await shallPass(sendTransaction({ name: 'admin/nfts/mint_nft', args: nftArgs }))
        console.log(tx)

        // invalid signer (non-admin)
        await shallRevert(
            sendTransaction({ name: 'admin/nfts/mint_nft', args: nftArgs, signers: [invalidAddr] }),
        )
        // invalid edition id
        await shallRevert(
            sendTransaction({ name: 'admin/nfts/mint_nft', args: [addr, 2] }),
        )
    })

    test('mint NFT multi', async () => {
        const [tx] = await shallPass(sendTransaction({
            name: 'admin/nfts/mint_nfts_multi',
            args: [addr, [1], [2], [{ 'Tes1': 'Tes1' }]],
        }))
        console.log(tx)
    })

    test('burn NFT', async () => {
        await sendTransaction({ name: 'admin/nfts/mint_nft', args: nftArgs })

        const [tx] = await shallPass(
            sendTransaction({ name: 'nfts/burn_nft', args: [1], signers: [addr] }),
        )
        console.log(tx)

        // invalid nft id (nft has already been burned)
        await shallRevert(sendTransaction({ name: 'nfts/burn_nft', args: [1], signers: [addr] }))
        // invalid nft id
        await shallRevert(sendTransaction({ name: 'nfts/burn_nft', args: [2], signers: [addr] }))
        // invalid signer
        await shallRevert(sendTransaction({ name: 'nfts/burn_nft', args: [1], signers: [invalidAddr] }))
    })

    test('check max size of Edition via minting NFT multi', async () => {
        const [tx] = await shallRevert(sendTransaction({
            name: 'admin/nfts/mint_nfts_multi',
            args: [addr, [1], [3]],
        }))
        console.log(tx)
    })

    test('read all NFTs in collection', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'nfts/read_collection_nft_ids', args: [addr] }),
        )
        expect(res).toHaveLength(0)
    })

    test('read length of collection', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'nfts/read_collection_nft_length', args: [addr] }),
        )
        expect(res).toEqual(0)
    })

    test('read properties of NFT properties by id', async () => {
        await sendTransaction({ name: 'admin/nfts/mint_nft', args: nftArgs })

        const [res] = await shallResolve(
            executeScript({ name: 'nfts/read_gg_nft_properties', args: [addr, 1] }),
        )
        expect(res).toMatchObject({
            editionID: 1,
            serialNumber: 1,
            owner: addr,
            name: 'Test #1/2',
            description: 'Desc',
            game: 'Game 1',
            streamer: 'Streamer 1',
            metadata: { 'Test': 'Test' },
        })

        // invalid nft id
        await shallRevert(executeScript({ name: 'nfts/read_gg_nft_properties', args: [addr, 2] }))
    })

    test('read total nft supply', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'nfts/read_gg_nft_supply' }),
        )
        expect(res).toEqual(0)
    })

    test('read metadata views of nft', async () => {
        await sendTransaction({ name: 'admin/nfts/mint_nft', args: nftArgs })

        const [res] = await shallResolve(
            executeScript({ name: 'nfts/read_gg_nft_metadata_types', args: [addr, 1] }),
        )
        expect(res).toHaveLength(2)
    })
})
