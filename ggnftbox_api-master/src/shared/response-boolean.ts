import { Expose } from 'class-transformer'


export default class ResponseBoolean {
    @Expose()
    result: boolean
}
