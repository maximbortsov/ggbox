import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common'
import GraffleHookBody from './graffle-hook-body'
import { PlayService } from '../play/play.service'
import { SetService } from '../set/set.service'
import { EditionService } from '../edition/edition.service'
import { NftService } from '../nft/nft.service'
import { LotService } from '../lot/lot.service'
import { ConfigService } from '@nestjs/config'
import { FlowConfig } from '../../config/config.interface'
import * as fcl from '@onflow/fcl'
import { GraffleHmacGuard } from './graffle-hmac.guard'
import { plainToInstance } from 'class-transformer'
import { ApiExcludeController } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'


@SkipThrottle()
@ApiExcludeController()
@Controller('graffle-receiver')
export class GraffleReceiverController {

    private readonly contractAddress: string

    constructor(
        private readonly playService: PlayService,
        private readonly setService: SetService,
        private readonly editionService: EditionService,
        private readonly nftService: NftService,
        private readonly lotService: LotService,
        configService: ConfigService,
    ) {
        this.contractAddress = fcl.sansPrefix(configService.getOrThrow<FlowConfig>('flow').admin.address)
    }

    @Post()
    @UseGuards(GraffleHmacGuard)
    async receive(@Body() responseBuffer: Buffer): Promise<void> {
        const response = plainToInstance(GraffleHookBody, JSON.parse(responseBuffer.toString()))

        console.log('GRAFFLE: ', response)
        const data = response.blockEventData

        const txId = response.flowTransactionId

        switch (response.flowEventId) {
            // ===========
            // PLAY
            // ===========
            //
            // Play Created
            case `A.${this.contractAddress}.GGCore.PlayCreated`: {
                await this.playService.createPlay(
                    data['name'],
                    data['description'],
                    data['cid'],
                    data['metadata'],
                    response.eventDate,
                    String(data['id']),
                    response.flowTransactionId,
                    data['game'],
                    data['streamer'],
                )
                break
            }
            //
            // Play Streamer Changed
            case `A.${this.contractAddress}.GGCore.PlayStreamerChanged`: {
                await this.playService.updatePlayStreamer(
                    String(data['id']),
                    data['streamer'],
                )
                break
            }
            //
            // Play Game Changed
            case `A.${this.contractAddress}.GGCore.PlayGameChanged`: {
                await this.playService.updatePlayGame(
                    String(data['id']),
                    data['game'],
                )
                break
            }

            // ===========
            // SET
            // ===========
            //
            // Set Created
            case `A.${this.contractAddress}.GGCore.SetCreated`: {
                await this.setService.createSet(
                    data['name'],
                    response.eventDate,
                    String(data['id']),
                    response.flowTransactionId,
                )
                break
            }
            //
            // Play Added to Set
            case `A.${this.contractAddress}.GGCore.PlayAddedToSet`: {
                await this.setService.addPlayToSet(
                    String(data['setID']),
                    String(data['playID']),
                )
                break
            }

            // ===========
            // EDITION
            // ===========
            //
            // Edition Created
            case `A.${this.contractAddress}.GGCore.EditionCreated`: {
                const maxSize = data['maxMintSize'] ? String(data['maxMintSize']) : undefined
                await this.editionService.createEdition(
                    data['name'],
                    data['rarity'],
                    response.eventDate,
                    String(data['id']),
                    String(data['setID']),
                    String(data['playID']),
                    response.flowTransactionId,
                    maxSize,
                )
                break
            }
            //
            // Edition Closed
            case `A.${this.contractAddress}.GGCore.EditionClosed`: {
                await this.editionService.closeEdition(
                    String(data['id']),
                )
                break
            }

            // ===========
            // NFT
            // ===========
            //
            // NFT Created
            case `A.${this.contractAddress}.GGCore.GGNFTMinted`: {
                await this.nftService.createNft(
                    String(data['id']),
                    String(data['editionID']),
                    String(data['serialNumber']),
                    response.eventDate,
                    data['metadata'],
                    response.flowTransactionId,
                )
                break
            }
            //
            // NFT Deposited
            case `A.${this.contractAddress}.GGCore.Deposit`: {
                // Ignore if the tx was with these events: NFTListed, NFTWithdrawn
                // Ignore NFTListed since the owner of the nft does not change at the event
                // Ignore NFTWithdrawn since the owner of the nft does not change at the event
                const listedEvents = await this.getEvents(txId, `A.${this.contractAddress}.GGMarket.NFTListed`)
                const withdrawnEvents = await this.getEvents(txId, `A.${this.contractAddress}.GGMarket.NFTWithdrawn`)
                const mintedEvents = await this.getEvents(txId, `A.${this.contractAddress}.GGCore.GGNFTMinted`)
                if (listedEvents.length || withdrawnEvents.length || mintedEvents.length) {
                    break
                }
                await this.nftService.attachOwner(
                    String(data['id']),
                    String(data['to']),
                )
                break
            }
            //
            // NFT Withdrawn
            case `A.${this.contractAddress}.GGCore.Withdraw`: {
                // Ignore if the tx was with these events: NFTListed, NFTWithdrawn
                // Ignore NFTListed since the owner of the nft does not change at the event
                // Ignore NFTWithdrawn since the owner of the nft does not change at the event
                const listedEvents = await this.getEvents(txId, `A.${this.contractAddress}.GGMarket.NFTListed`)
                const withdrawnEvents = await this.getEvents(txId, `A.${this.contractAddress}.GGMarket.NFTWithdrawn`)
                if (listedEvents.length || withdrawnEvents.length) {
                    break
                }
                await this.nftService.detachOwner(
                    String(data['id']),
                    String(data['from']),
                )
                break
            }

            // ===========
            // LOT
            // ===========
            //
            // Lot Created
            case `A.${this.contractAddress}.GGMarket.NFTListed`: {
                await this.lotService.createLot(
                    String(data['id']),
                    data['price'],
                    data['seller'],
                    response.eventDate,
                    response.flowTransactionId,
                )
                break
            }
            //
            // Lot Price Changed
            case `A.${this.contractAddress}.GGMarket.NFTPriceChanged`: {
                await this.lotService.updateLotPrice(
                    String(data['id']),
                    String(data['newPrice']),
                    data['seller'],
                    response.eventDate,
                )
                break
            }
            //
            // Lot Cancelled
            case `A.${this.contractAddress}.GGMarket.NFTWithdrawn`: {
                // Ignore if the tx was with these events: NFTPurchased
                // Ignore NFTPurchased since NFTWithdrawn only for lot cancellation
                const purchasedEvents = await this.getEvents(txId, `A.${this.contractAddress}.GGMarket.NFTPurchased`)
                if (purchasedEvents.length) {
                    break
                }
                await this.lotService.deleteLot(
                    String(data['id']),
                    data['owner'],
                )
                break
            }
            //
            // Lot Purchased
            case `A.${this.contractAddress}.GGMarket.NFTPurchased`: {
                const depositEvents = await this.getEvents(txId, `A.${this.contractAddress}.GGCore.Deposit`, (e) => e.data.id == String(data['id']))
                if (depositEvents.length == 0) {
                    throw new InternalServerErrorException('Required deposit event was not found')
                }
                // Get buyer address from GGCore.Deposit event
                const buyer = depositEvents[0].data.to
                await this.lotService.updateLotToPurchased(
                    String(data['id']),
                    String(data['price']),
                    buyer,
                    data['seller'],
                    response.eventDate,
                    response.flowTransactionId,
                )
                break
            }

            // ===========
            // DEFAULT
            // ===========
            //
            default: {
                // Throw error if the event is not handled
                throw new BadRequestException(`Unknown event: ${response.flowEventId}`)
            }
        }
    }

    private async getEvents(txId: string, event?: string, extraFilter?: (any) => boolean): Promise<any[]> {
        const tx = await fcl.tx(txId).onceSealed()
        let events: any[] = tx.events.filter((e) => e.type == event)
        if (extraFilter) {
            events = events.filter(extraFilter)
        }
        console.log('GET EVENTS', event, events)
        return events
    }

}
