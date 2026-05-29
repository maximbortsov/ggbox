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


jest.setTimeout(25000)

describe('GGMarket tests', () => {

    const cut = (num, digits = 8) => parseFloat(num.toFixed(digits))

    let serviceAddr
    let sellerAddr
    let buyerAddr
    let streamerAddr

    const sellerFee = 0.05
    const buyerFee = 0.04
    const beneficiaryFee = 0.06
    const influencerFee = 0.03

    const fusdBalance = 100

    const price1 = 10
    const price2 = 12
    const priceStr1 = price1.toString()
    const priceStr2 = price2.toString()

    const salePrice1 = cut(price1 * (1 + sellerFee + buyerFee + beneficiaryFee + influencerFee))
    const salePrice2 = cut(price2 / price1 * salePrice1)

    const beneficiaryShare = cut(price1 * beneficiaryFee)
    const sellerShare = cut(price1 * sellerFee)
    const buyerShare = cut(price1 * buyerFee)
    const influencerShare = cut(price1 * influencerFee)

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
        { 'John': influencerFee.toString() },        // Royalties
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
        await deployContractByName('GGMarket')

        serviceAddr = await getServiceAddress()
        sellerAddr = await getAccountAddress('Alice')
        buyerAddr = await getAccountAddress('Bob')
        streamerAddr = await getAccountAddress('John')

        // set fees
        await sendTransaction({
            name: 'admin/fee/set_rates',
            args: [
                (sellerFee + beneficiaryFee + buyerFee).toString(),
                (2 * influencerFee).toString(),
                (1 - (sellerFee + beneficiaryFee + buyerFee + 2 * influencerFee)).toString(),
            ],
        })
        await sendTransaction({ name: 'admin/fee/set_buyer_fee', args: [buyerFee.toString()] })
        await sendTransaction({ name: 'admin/fee/set_seller_fee', args: [sellerFee.toString()] })
        await sendTransaction({ name: 'admin/fee/set_beneficiary_fee', args: [beneficiaryFee.toString()] })

        // create nft collections
        await sendTransaction({ name: 'setup_gg_account', signers: [sellerAddr] })
        await sendTransaction({ name: 'setup_gg_account', signers: [buyerAddr] })
        // create sale collections
        await sendTransaction({ name: 'setup_gg_account', signers: [sellerAddr] })
        // create FUSD vaults
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [serviceAddr] })
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [sellerAddr] })
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [buyerAddr] })
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [streamerAddr] })
        // mint FUSD
        await sendTransaction({ name: 'fusd/setup_fusd_minter', signers: [serviceAddr] })
        await sendTransaction({ name: 'fusd/deposit_fusd_minter', args: [serviceAddr], signers: [serviceAddr] })
        await sendTransaction({ name: 'fusd/mint_fusd', args: [fusdBalance, buyerAddr] })
        await sendTransaction({ name: 'fusd/mint_fusd', args: [fusdBalance, sellerAddr] })
        // set beneficiary capability
        await sendTransaction({ name: 'admin/fee/set_beneficiary_capability_fusd', args: [serviceAddr] })
        // set influencer capability (streamer)
        await sendTransaction({ name: 'admin/influencer/set_capability_fusd', args: ['John', streamerAddr] })
        // mint nft
        await sendTransaction({ name: 'admin/plays/create_play', args: playArgs })
        await sendTransaction({ name: 'admin/sets/create_set', args: setArgs })
        await sendTransaction({ name: 'admin/editions/create_edition', args: editionArgs })
        await sendTransaction({ name: 'admin/nfts/mint_nft', args: [sellerAddr, 1, {}] })
        await sendTransaction({ name: 'admin/nfts/mint_nft', args: [sellerAddr, 1, {}] })
    })

    afterEach(async () => {
        return emulator.stop()
    })

    test('create sale collection', async () => {
        const [tx] = await shallPass(
            sendTransaction({ name: 'market/create_sale_collection_fusd', signers: [sellerAddr] }),
        )
        console.log(tx)
    })

    test('get sale len', async () => {
        await sendTransaction({ name: 'market/create_sale_collection_fusd', signers: [sellerAddr] })

        const [res] = await shallResolve(
            executeScript({ name: 'market/get_sale_len', args: [sellerAddr] }),
        )
        expect(res).toBe(0)
    })

    test('start sale', async () => {
        await sendTransaction({ name: 'market/create_sale_collection_fusd', signers: [sellerAddr] })

        // invalid price
        await shallRevert(sendTransaction({ name: 'market/start_sale', args: [1, '0'], signers: [sellerAddr] }))
        // invalid nft id
        await shallRevert(sendTransaction({
            name: 'market/start_sale',
            args: [99, priceStr1],
            signers: [sellerAddr],
        }))
        // invalid signer
        await shallRevert(sendTransaction({
            name: 'market/start_sale',
            args: [1, priceStr1],
            signers: [buyerAddr],
        }))

        const [tx] = await shallPass(
            sendTransaction({ name: 'market/start_sale', args: [1, priceStr1], signers: [sellerAddr] }),
        )
        console.log(tx)

        const [res] = await shallResolve(
            executeScript({ name: 'market/get_sale_price', args: [sellerAddr, 1] }),
        )
        expect(parseFloat(res)).toBe(salePrice1)

        // invalid nft id (this nft is already being sold)
        await shallRevert(sendTransaction({
            name: 'market/start_sale',
            args: [1, priceStr1],
            signers: [sellerAddr],
        }))
    })

    test('create sale collection and start sale', async () => {
        // invalid price
        await shallRevert(
            sendTransaction({ name: 'market/create_start_sale_fusd', args: [1, '0'], signers: [sellerAddr] }),
        )
        // invalid nft id
        await shallRevert(
            sendTransaction({
                name: 'market/create_start_sale_fusd',
                args: [99, priceStr1],
                signers: [sellerAddr],
            }),
        )
        // invalid signer
        await shallRevert(
            sendTransaction({ name: 'market/create_start_sale_fusd', args: [1, priceStr1], signers: [buyerAddr] }),
        )

        const [tx1] = await shallPass(
            sendTransaction({
                name: 'market/create_start_sale_fusd',
                args: [1, priceStr1],
                signers: [sellerAddr],
            }),
        )
        console.log(tx1)

        const [tx2] = await shallPass(
            sendTransaction({
                name: 'market/create_start_sale_fusd',
                args: [2, priceStr1],
                signers: [sellerAddr],
            }),
        )
        console.log(tx2)

        const [res] = await executeScript({ name: 'market/get_sale_price', args: [sellerAddr, 1] })
        expect(parseFloat(res)).toBe(salePrice1)

        // invalid nft id (this nft is already being sold)
        await shallRevert(
            sendTransaction({
                name: 'market/create_start_sale_fusd',
                args: [1, priceStr1],
                signers: [sellerAddr],
            }),
        )
    })

    test('stop sale', async () => {
        await sendTransaction({
            name: 'market/create_start_sale_fusd',
            args: [1, priceStr1],
            signers: [sellerAddr],
        })

        // invalid nft id
        await shallRevert(sendTransaction({ name: 'market/stop_sale', args: [99], signers: [sellerAddr] }))
        // invalid signer
        await shallRevert(sendTransaction({ name: 'market/stop_sale', args: [1], signers: [buyerAddr] }))

        const [tx] = await shallPass(
            sendTransaction({ name: 'market/stop_sale', args: [1], signers: [sellerAddr] }),
        )
        console.log(tx)

        // invalid nft id (this nft has already been withdrawn)
        await shallRevert(sendTransaction({ name: 'market/stop_sale', args: [1], signers: [sellerAddr] }))
    })

    test('change price', async () => {
        await sendTransaction({
            name: 'market/create_start_sale_fusd',
            args: [1, priceStr1],
            signers: [sellerAddr],
        })

        // invalid price
        await shallRevert(sendTransaction({ name: 'market/change_price', args: [1, '0'], signers: [sellerAddr] }))
        // invalid nft id
        await shallRevert(sendTransaction({
            name: 'market/change_price',
            args: [2, priceStr2],
            signers: [sellerAddr],
        }))
        // invalid signer
        await shallRevert(sendTransaction({
            name: 'market/change_price',
            args: [1, priceStr2],
            signers: [buyerAddr],
        }))

        const [tx] = await shallPass(
            sendTransaction({ name: 'market/change_price', args: [1, priceStr2], signers: [sellerAddr] }),
        )
        console.log(tx)
        const [res] = await shallResolve(
            executeScript({ name: 'market/get_sale_price', args: [sellerAddr, 1] }),
        )
        expect(parseFloat(res)).toBe(salePrice2)
    })

    test('purchase nft', async () => {
        await sendTransaction({
            name: 'market/create_start_sale_fusd',
            args: [1, priceStr1],
            signers: [sellerAddr],
        })

        // invalid nft id
        await shallRevert(
            sendTransaction({
                name: 'market/purchase_nft_fusd',
                args: [sellerAddr, 2, salePrice1.toString()],
                signers: [buyerAddr],
            }),
        )
        // invalid seller
        await shallRevert(
            sendTransaction({
                name: 'market/purchase_nft_fusd',
                args: [buyerAddr, 1, salePrice1.toString()],
                signers: [buyerAddr],
            }),
        )
        // invalid price
        await shallRevert(
            sendTransaction({
                name: 'market/purchase_nft_fusd',
                args: [buyerAddr, 1, (price1 - 2).toString()],
                signers: [buyerAddr],
            }),
        )

        // valid tx
        const [tx] = await shallPass(
            sendTransaction({
                name: 'market/purchase_nft_fusd',
                args: [sellerAddr, 1, salePrice1.toString()],
                signers: [buyerAddr],
            }),
        )
        console.log(tx)

        // check balances
        const [sellerBalance] = await executeScript({ name: 'fusd/get_balance', args: [sellerAddr] })
        expect(parseFloat(sellerBalance)).toBe(fusdBalance + price1)
        const [buyerBalance] = await executeScript({ name: 'fusd/get_balance', args: [buyerAddr] })
        expect(parseFloat(buyerBalance)).toBe(fusdBalance - salePrice1)
        const [beneficiaryBalance] = await executeScript({ name: 'fusd/get_balance', args: [serviceAddr] })
        expect(parseFloat(beneficiaryBalance)).toBe(buyerShare + sellerShare + beneficiaryShare)
        const [influencerBalance] = await executeScript({ name: 'fusd/get_balance', args: [streamerAddr] })
        expect(parseFloat(influencerBalance)).toBe(influencerShare)

        // check sale stop
        await shallRevert(
            executeScript({ name: 'market/get_sale_price', args: [sellerAddr, 1] }),
        )

        // invalid nft id (nft has already purchased)
        await shallRevert(
            sendTransaction({
                name: 'market/purchase_nft_fusd',
                args: [sellerAddr, 1, salePrice1.toString()],
                signers: [buyerAddr],
            }),
        )
    })
})
