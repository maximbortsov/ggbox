import React, { FC, useEffect, useState } from 'react'
import { Box, IconButton, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid'
import stores from '../../stores/Stores'
import { observer } from 'mobx-react-lite'
import LinkIcon from '@mui/icons-material/Link'
import { Lot } from '../../entities/Lot'
import { prettyDateTime } from '../../utils/date'


const bigScreenColumns: GridColDef[] = [
    {
        field: 'serialNumber',
        headerName: '#',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'seller',
        headerName: 'Seller',
        flex: 5,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'buyer',
        headerName: 'Buyer',
        flex: 5,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'date',
        headerName: 'Date',
        type: 'string',
        flex: 5,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        flex: 4,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
        renderCell: (params): string => `${params.value as number} ${stores.marketplace.pickedCurrency} `,
    },
    {
        field: 'flowScanUrl',
        headerName: '',
        type: 'number',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: (params): JSX.Element => (
            <IconButton
                onClick={(): void => {
                    window.open('https://testnet.flowscan.org/transaction/' + params.value)
                }}
            >
                <LinkIcon sx={{ color: '#554ADA' }}/>
            </IconButton>
        ),
    },
]

const smallScreenColumns: GridColDef[] = [
    {
        field: 'serialNumber',
        headerName: '#',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'seller',
        headerName: 'Seller',
        flex: 10,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'buyer',
        headerName: 'Buyer',
        flex: 10,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        flex: 3,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
        renderCell: (params: GridRenderCellParams): string => `${params.value as string} ${stores.marketplace.pickedCurrency}`,
    },
]


interface FormattedLot {
    id: string
    serialNumber: string
    seller: string
    buyer: string
    price: string
    date: string
    flowScanUrl: string
}


const PlayHistory: FC<{ lots: Lot[] }> = ({ lots }) => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const [formattedLots, setFormattedLots] = useState<FormattedLot[]>([])

    useEffect(() => {
        const temp: FormattedLot[] = []
        for (const lot of lots) {
            temp.push({
                id: lot.id,
                serialNumber: lot.nft?.serialNumber ?? '-1',
                seller: lot.seller?.username ?? 'anonymous',
                buyer: lot.buyer?.username ?? 'anonymous',
                price: lot.price.toFixed(2),
                date: prettyDateTime(lot.soldAt as Date),
                flowScanUrl: lot.purchaseTransactionID ?? '-',
            })
        }
        setFormattedLots(temp)
    }, [lots])

    return (
        <Box
            width={'100%'}
            height={'100%'}
        >
            <DataGrid
                autoHeight
                columns={isMobile ? smallScreenColumns : bigScreenColumns}
                rows={formattedLots}
                rowHeight={48}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableColumnMenu
                disableColumnFilter
                disableSelectionOnClick
                components={{
                    NoRowsOverlay: () =>
                        <Stack height={'100%'} alignItems={'center'} justifyContent={'center'}>
                            <Typography
                                variant={'body1'}
                            >
                                No one has bought this moment yet.
                            </Typography>
                            <Typography
                                mt={1}
                                variant={'body2'}
                            >
                                {`Click 'Select and buy' and become first!`}
                            </Typography>
                        </Stack>,
                }}
                sx={{
                    border: 'none',
                    '& .MuiIconButton-root': {
                        color: 'white',
                    },
                    '& .MuiIconButton-root.Mui-disabled': {
                        color: 'white',
                    },
                    '& .MuiTablePagination-select': {
                        color: 'white',
                    },
                    '& .MuiSelect-icon': {
                        color: 'white',
                    },
                    '.MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-columnSeparator--sideRight': {
                        visibility: 'hidden',
                    },
                }}
            />
        </Box>
    )
}

export default observer(PlayHistory)