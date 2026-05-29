import React from 'react'
import { Box, Grid, Typography } from '@mui/material'


export interface AboutUsArticleProps {
    title: string
    text: string[]
    image?: string
    isImageLeft?: boolean
    widthImage?: number
    imageComponent?: React.ReactElement
}


const AboutUsArticle: React.FC<AboutUsArticleProps> = ({ title, text, image, isImageLeft, widthImage = 6, imageComponent }) => (
    <Grid
        container
        mb={18}
        direction={isImageLeft ? 'row-reverse' : 'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        style={{
            display: 'flex',
            width: '100%',
        }}
    >
        <Grid
            item
            xs={12}
            md={(12 - widthImage)}
            mb={2}
        >
            <Typography
                fontWeight={'bold'}
                fontSize={'28px'}
                mb={3}
                textAlign={!isImageLeft ? 'left' : 'right'}
                variant={'body2'}
            >
                {title}
            </Typography>
            {
                text.map((value) => (
                    <Typography
                        variant={'body1'}
                        fontSize={'20px'}
                        textAlign={!isImageLeft ? 'left' : 'right'}
                        mb={1}
                        key={`${value}`}
                    >
                        {value}
                    </Typography>
                ))
            }
        </Grid>
        <Grid item xs={12} md={widthImage}>
            {imageComponent ?
                imageComponent
                :
                <Box style={{ display: 'flex' }} width={'60%'} ml={!isImageLeft ? 'auto' : 'none'}>
                    <img
                        width={'100%'}
                        src={image}
                        alt={'articleImage'}
                    />
                </Box>}
        </Grid>
    </Grid>
)

export default AboutUsArticle
