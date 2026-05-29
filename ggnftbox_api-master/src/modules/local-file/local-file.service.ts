import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AssetsConfig } from '../../config/config.interface'
import * as sharp from 'sharp'
import * as path from 'path'
import * as fs from 'fs'
import * as ffmpeg from 'fluent-ffmpeg'


@Injectable()
export class LocalFileService {

    private readonly assetsDir: string

    constructor(
        private readonly configService: ConfigService,
    ) {
        const assetsTemp = configService.get<AssetsConfig>('assets')?.dir
        if (assetsTemp) {
            this.assetsDir = assetsTemp
        } else {
            Logger.error('No assets dir for LocalFileService')
            throw new InternalServerErrorException()
        }
    }

    checkAndCreateDir(dir: string): boolean {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
            return true
        }
        return false
    }

    async removeFile(toFile: string): Promise<void> {
        toFile = path.join(this.assetsDir, toFile)

        if (fs.existsSync(toFile)) {
            fs.unlinkSync(toFile)
        }
    }

    /**
     * GAME
     */
    async saveGameLogo(logo: Buffer, id: string): Promise<string> {
        const additionalDir = path.join('games', 'icons')
        const filename = `${id}.svg`

        const dir = path.join(this.assetsDir, additionalDir)
        const toFile = path.join(dir, filename)

        this.checkAndCreateDir(dir)

        fs.writeFileSync(toFile, logo)

        return path.join(additionalDir, filename).split('\\').join('/')
    }

    /**
     * BOX
     */
    async saveBoxThumbnail(thumbnail: Buffer, id: string): Promise<string> {
        const additionalDir = path.join('boxes', 'thumbnails')
        const filename = `${id}.png`

        const dir = path.join(this.assetsDir, additionalDir)
        const toFile = path.join(dir, filename)

        this.checkAndCreateDir(dir)

        await sharp(thumbnail)
            .resize(450, 450)
            .toFormat('png')
            .png({ quality: 90 })
            .toFile(path.join(process.cwd(), toFile))

        return path.join(additionalDir, filename).split('\\').join('/')
    }

    async saveBoxOpenVideo(video: Buffer, id: string): Promise<string> {
        const additionalDir = path.join('boxes', 'open-videos')
        const filename = `${id}.mp4`

        const dir = path.join(this.assetsDir, additionalDir)
        const toFile = path.join(dir, filename)

        this.checkAndCreateDir(dir)

        fs.writeFileSync(toFile, video)

        return path.join(additionalDir, filename).split('\\').join('/')
    }

    async saveBoxOpenMobileVideo(video: Buffer, id: string): Promise<string> {
        const additionalDir = path.join('boxes', 'open-mobile-videos')
        const filename = `${id}.mp4`

        const dir = path.join(this.assetsDir, additionalDir)
        const toFile = path.join(dir, filename)

        this.checkAndCreateDir(dir)

        fs.writeFileSync(toFile, video)

        return path.join(additionalDir, filename).split('\\').join('/')
    }

    /**
     * USER
     */
    async saveUserAvatar(avatar: Buffer, id: string): Promise<string> {
        const additionalDir = path.join('users', 'avatars')
        const filename = `${id}.png`

        const dir = path.join(this.assetsDir, additionalDir)
        const toFile = path.join(dir, filename)

        this.checkAndCreateDir(dir)

        await sharp(avatar)
            .resize(450, 450)
            .toFormat('png')
            .png({ quality: 90 })
            .toFile(toFile)

        return path.join(additionalDir, filename).split('\\').join('/')
    }

    /**
     * MOMENT
     */
    async saveMomentPreviews(toVideoFile: string, id: string): Promise<string> {
        const additionalDir = path.join('moments', 'video-previews')

        toVideoFile = path.join(this.assetsDir, toVideoFile)

        const dir = path.join(this.assetsDir, additionalDir, id)
        const filename = `${id}.png`

        this.checkAndCreateDir(dir)

        ffmpeg(toVideoFile)
            .screenshots({
                count: 1,
                filename: filename,
                folder: dir,
                size: '50%',
            })

        return path.join(additionalDir, id, filename).split('\\').join('/')
    }

    private static prepareFilename(name: string): string {
        const sep = '_'
        name += sep + Math.floor(Date.now() / 1000).toString()
        return name.replace(/\s+/g, sep)
    }

    async saveMomentVideo(video: Buffer, id: string): Promise<string> {
        const additionalDir = path.join('moments', 'videos')
        const filename = `${id}.mp4`

        const dir = path.join(this.assetsDir, additionalDir)
        const toFile = path.join(dir, filename)

        this.checkAndCreateDir(dir)

        fs.writeFileSync(toFile, video)
        // this.saveMomentPreviews(toFile, id)

        return path.join(additionalDir, filename).split('\\').join('/')
    }

    /**
     * PLAY
     */
    async savePlayVideo(video: Buffer, name: string): Promise<string> {
        const additionalDir = path.join('plays', 'videos')

        const filename = LocalFileService.prepareFilename(name) + '.mp4'

        const dir = path.join(this.assetsDir, additionalDir)
        const toFile = path.join(dir, filename)

        this.checkAndCreateDir(dir)

        fs.writeFileSync(toFile, video)

        return path.join(additionalDir, filename).split('\\').join('/')
    }
}
