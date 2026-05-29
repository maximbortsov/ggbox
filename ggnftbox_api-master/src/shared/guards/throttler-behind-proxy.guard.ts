import { ThrottlerGuard } from '@nestjs/throttler'
import { Injectable } from '@nestjs/common'
import { getClientIp, Request } from 'request-ip'


@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, unknown>): string {
        return getClientIp(req as unknown as Request) ?? 'null-ip'
    }
}
