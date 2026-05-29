declare module '*.svg' {
    const content: any
    export default content
}

declare module '*.png' {
    const content: any
    export default content
}

declare module '*.jpg' {
    const content: any
    export default content
}

declare module '*.jpeg' {
    const content: any
    export default content
}

declare module '*.mp4' {
    const src: string
    export default src
}

declare module '@mui/material/styles' {
    interface TypographyVariants {
        poster: React.CSSProperties
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        poster?: React.CSSProperties
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        price: true
    }
}