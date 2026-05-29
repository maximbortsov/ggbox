import { IsDate, IsDefined, IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator'
import { Type } from 'class-transformer'
import { CompareWith } from '../../../shared/decorators/validation/compare-with.decorator'
import { IsPrice } from '../../../shared/decorators/validation/is-price.decorator'
import { IsAfter } from '../../../shared/decorators/validation/is-after.decorator'


export class CreateBoxDataDto {

    @IsString()
    @MinLength(6)
    @MaxLength(256)
    name: string

    @IsDefined()
    @IsInt()
    @Min(1)
    size: number

    @IsDefined()
    @IsInt()
    @Min(1)
    total: number

    @IsDefined()
    @IsPrice()
    price: number

    @IsString()
    @MinLength(10)
    @MaxLength(256)
    desc: string

    @Type(() => Date)
    @IsDate()
    @IsAfter()
    startSaleAt: Date

    @Type(() => Date)
    @IsDate()
    @CompareWith('gt', 'startSaleAt', false)
    endSaleAt: Date
}
