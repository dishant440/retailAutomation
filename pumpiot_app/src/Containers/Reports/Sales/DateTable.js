import React from 'react';
// import { renderToString } from "react-dom/server";
import {usePagination, useSortBy, useTable, useTableState} from "react-table";
import {
    Button,
    Icon,
    Label,
    Table as UiTable,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import _ from 'lodash';

const Rs = '\u20B9';

const DateTable = ({data, activeFilters}) => {
    const tableState = useTableState({pageIndex: 0});

    // const filterIcon = renderToString();

    const columns = [{
        Header: ' ',
        columns: [
            {Header: "Date", accessor: "formattedDate", sortType: 'basic'},
            {Header: "Time", accessor: "formattedTime", sortType: 'basic'},
            {Header: "Transaction Id", accessor: "id"},
            {Header: "Shift", accessor: "shift_id", sortType: 'basic'},
            {Header: "ATG Reading", accessor: "atg_reading"},
            {
                Header: 'Fuel Type',
                accessor: "product",
                sortType: 'basic'
            },
            {Header: "Pump Test (L)", accessor: "pumpTest"},
            {Header: `Own Use (${Rs})`, accessor: "ownUseAmt"},
            {Header: "Own Use (L)", accessor: "ownUse"},
            {Header: "Sale Qty (L)", accessor: "netSalesQty"},
            {Header: `Selling Price (${Rs})`, accessor: "sellingPrice"},
            {Header: `Sales Amt (${Rs})`, accessor: "totalSales"},
            {Header: "MOP", accessor: "mop", sortType: 'basic'}
        ],
    }];

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: [{pageIndex}],
    } = useTable(
        {
            columns,
            data,
            state: tableState
        },
        useSortBy,
        usePagination
    );

    React.useEffect(() => {
        // Set page size
        setPageSize(20);

    }, []);


    const formatCell = (cell) => {
        if (cell.column.id === 'formattedDate') {
            return <Label>{cell.render('Cell')}</Label>;
        } else if (cell.column.id === 'product') {
            return _.capitalize(cell.value);
        } else {
            return cell.render('Cell');
        }
    };

    // Render the UI for your table
    return (
        <>
            <UiTable {...getTableProps()}>
                <TableHeader>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableHeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.Header === "Shift" && activeFilters && activeFilters.shift && <Icon name={'filter'} color={'green'} size={'small'}/>}
                                    {column.Header === "Fuel Type" && activeFilters && activeFilters.fuel && <Icon name={'filter'} color={'green'} size={'small'}/>}
                                    {column.Header === "MOP" && activeFilters && activeFilters.mop && <Icon name={'filter'} color={'green'} size={'small'}/>}
                                    {column.Header === "Own Use (₹)" && activeFilters && activeFilters.own_use && <Icon name={'filter'} color={'green'} size={'small'}/>}
                                    {column.Header === "Own Use (L)" && activeFilters && activeFilters.own_use && <Icon name={'filter'} color={'green'} size={'small'}/>}
                                    {column.Header === "Pump Test (L)" && activeFilters && activeFilters.pump_test && <Icon name={'filter'} color={'green'} size={'small'}/>}
                                    {column.render('Header')}
                                    <span>{column.isSorted ? (column.isSortedDesc ? <Icon name={'arrow down'}/> :
                                        <Icon name={'arrow up'}/>) : ''}</span>
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {page.map(
                        (row, i) =>
                            prepareRow(row) || (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <TableCell {...cell.getCellProps()}>
                                                {formatCell(cell)}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                    )}
                </TableBody>
            </UiTable>
            <div className="pagination">
                <span>Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{' | '}</span>
                <Button size={'tiny'} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </Button>
                {' '}
                <Button size={'tiny'} onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </Button>
                {' '}
                <Button size={'tiny'} onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </Button>
                {' '}
                <Button size={'tiny'} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </Button>
            </div>
        </>
    )
};

export default DateTable