import path from 'path'
import { deployContractByName, emulator, getContractAddress, getServiceAddress, init, shallPass } from 'flow-js-testing'


jest.setTimeout(10000)

describe('deploying all contracts', () => {

    beforeEach(async () => {
        const basePath = path.resolve(__dirname, '../cadence')
        const port = 8080
        await init(basePath, { port })
        await emulator.start(port, true)
    })

    afterEach(async () => {
        await emulator.stop()
    })

    test('NonFungibleToken contract deploy', async () => {
        const name = 'NonFungibleToken'

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('FungibleToken contract deploy', async () => {
        const name = 'FungibleToken'

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('MetadataViews contract deploy', async () => {
        const name = 'MetadataViews'

        await deployContractByName('FungibleToken')
        await deployContractByName('NonFungibleToken')

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('FUSD contract deploy', async () => {
        const name = 'FUSD'

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('GGMetadata contract deploy', async () => {
        const name = 'GGMetadata'

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('GGMarketFee contract deploy', async () => {
        const name = 'GGMarketFee'

        await deployContractByName('FungibleToken')

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('GGInfluencerSystem contract deploy', async () => {
        const name = 'GGInfluencerSystem'

        await deployContractByName('FungibleToken')

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('GGCore contract deploy', async () => {
        const name = 'GGCore'

        await deployContractByName('NonFungibleToken')
        await deployContractByName('MetadataViews')
        await deployContractByName('GGMetadata')
        await deployContractByName('GGMarketFee')
        await deployContractByName('GGInfluencerSystem')

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })

    test('GGMarket contract deploy', async () => {
        const name = 'GGMarket'

        await deployContractByName('FungibleToken')
        await deployContractByName('FUSD')
        await deployContractByName('NonFungibleToken')
        await deployContractByName('MetadataViews')
        await deployContractByName('GGMetadata')
        await deployContractByName('GGMarketFee')
        await deployContractByName('GGInfluencerSystem')
        await deployContractByName('GGCore')

        await shallPass(deployContractByName(name))

        const address = await getContractAddress(name)
        const serviceAccount = await getServiceAddress()
        expect(address).toBe(serviceAccount)
    })
})
