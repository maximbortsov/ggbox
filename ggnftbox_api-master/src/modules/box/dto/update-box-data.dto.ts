import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'
import { Type } from 'class-transformer'
import { CompareWith } from '../../../shared/decorators/validation/compare-with.decorator'
import { IsPrice } from '../../../shared/decorators/validation/is-price.decorator'
import { IsAfter } from '../../../shared/decorators/validation/is-after.decorator'


export class UpdateBoxDataDto {

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(256)
    name?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    size?: number

    @IsOptional()
    @IsInt()
    @Min(1)
    total?: number

    @IsOptional()
    @IsPrice()
    price?: number

    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(256)
    desc?: string

    @Type(() => Date)
    @IsOptional()
    @IsAfter()
    startSaleAt?: Date

    @Type(() => Date)
    @IsOptional()
    @CompareWith('gt', 'startSaleAt', false)
    endSaleAt?: Date
}
