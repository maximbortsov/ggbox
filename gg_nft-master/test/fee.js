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

describe('GGMarketFee tests', () => {

    let addr

    beforeEach(async () => {
        const basePath = path.resolve(__dirname, '../cadence')
        const port = 8080
        await init(basePath, { port })
        await emulator.start(port)
        await deployContractByName('FungibleToken')
        await deployContractByName('FUSD')
        await deployContractByName('GGMarketFee')

        addr = await getAccountAddress('Alice')
        await sendTransaction({ name: 'fusd/setup_fusd_account', signers: [addr] })
    })

    afterEach(async () => {
        return emulator.stop()
    })

    test('read beneficiary\'s fee', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'fee/read_beneficiary_fee' }),
        )
        expect(parseFloat(res)).toBe(0.05)
    })

    test('read seller\'s fee', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'fee/read_seller_fee' }),
        )
        expect(parseFloat(res)).toBe(0.05)
    })

    test('read buyer\'s fee', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'fee/read_buyer_fee' }),
        )
        expect(parseFloat(res)).toBe(0.0)
    })

    test('read maxFeeRate', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'fee/read_max_fee_rate' }),
        )
        expect(parseFloat(res)).toBe(0.15)
    })

    test('read maxRoyaltyRate', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'fee/read_max_royalty_rate' }),
        )
        expect(parseFloat(res)).toBe(0.05)
    })

    test('read minRewardRate', async () => {
        const [res] = await shallResolve(
            executeScript({ name: 'fee/read_min_reward_rate' }),
        )
        expect(parseFloat(res)).toBe(0.8)
    })

    test('set beneficiary\'s capability', async () => {
        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/fee/set_beneficiary_capability_fusd', args: [addr] }),
        )
        console.log(tx)
    })

    test('read beneficiary\'s capability', async () => {
        await sendTransaction({ name: 'admin/fee/set_beneficiary_capability_fusd', args: [addr] })

        const [res] = await shallResolve(
            executeScript({ name: 'fee/read_beneficiary_capability_fusd' }),
        )
        expect(res.address).toEqual(addr)
    })

    test('set beneficiary\'s fee', async () => {
        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/fee/set_beneficiary_fee', args: [0.04] }),
        )
        console.log(tx)

        // invalid fee value (over maxFeeRate)
        await shallRevert(
            sendTransaction({ name: 'admin/fee/set_beneficiary_fee', args: [0.4] }),
        )
    })

    test('set seller\'s fee', async () => {
        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/fee/set_seller_fee', args: [0.04] }),
        )
        console.log(tx)

        // invalid fee value (over maxFeeRate)
        await shallRevert(
            sendTransaction({ name: 'admin/fee/set_seller_fee', args: [0.4] }),
        )
    })

    test('set buyer\'s fee', async () => {
        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/fee/set_buyer_fee', args: [0.05] }),
        )
        console.log(tx)

        // invalid fee value (over maxFeeRate)
        await shallRevert(
            sendTransaction({ name: 'admin/fee/set_buyer_fee', args: [0.5] }),
        )
    })

    test('set rates', async () => {
        const [tx] = await shallPass(
            sendTransaction({ name: 'admin/fee/set_rates', args: [0.1, 0.1, 0.8] }),
        )
        console.log(tx)

        const [res] = await executeScript({ name: 'fee/read_max_fee_rate' })
        expect(parseFloat(res)).toBe(0.1)

        await shallRevert(
            sendTransaction({ name: 'admin/fee/set_rates', args: [0.05, 0.15, 0.8] }),
        )
        await shallRevert(
            sendTransaction({ name: 'admin/fee/set_rates', args: [0.1, 0.1, 0.5] }),
        )
        await shallRevert(
            sendTransaction({ name: 'admin/fee/set_rates', args: [0.1, 0.1, 0.9] }),
        )
    })
})
