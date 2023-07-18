import { useEffect, useState } from "react";
import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./Filter";
import { SearchPwsDisposal } from "./Search";
import "../css/tablePws.css";
import "../css/foot.css";
import ContentListCommon from "./ContentListCommon";

function TableDisposal({ columns, data, dataWasFiltered, setFilterHeadquarters, doRefresh, account }) {

    const [idasset, setIdasset] = useState('');

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        page,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        state,
        gotoPage,
        pageCount,
        setPageSize,
        visibleColumns,
        prepareRow,
        setGlobalFilter,
        preGlobalFilteredRows,
        // setFilter is the key!!!
        setFilter,
    } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 100 }, defaultColumn: { Filter: DefaultFilterForColumn }, }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const { pageIndex, pageSize } = state;

    const searchs = columns.map((col) => {
        return col.Header + "";
    });

    useEffect(() => { dataWasFiltered(rows); }, [rows, dataWasFiltered]);

    const handleRowClick = (event, values) => {
        console.log('event : ', values);
        if (values.idasset !== null && values.idasset !== '') {
            setIdasset(values.idasset);
        }
        else {
            alert('해당 PWS정보가 조회되지 않았습니다. \n예상치 못한 오류입니다.');
        }
    };

    const doClose = () => {
        setIdasset('');
    }

    console.log('Pws Disposal Table 랜더링');
    return (
        <>
            <ContentListCommon idasset={idasset} doRefresh={doRefresh} doClose={doClose} url='/api/pws' account={account} />
            {/* <Search onSubmit={setGlobalFilter} /> */}
            <SearchPwsDisposal column1={'headquarters'} column2={'department'} column3={'model'} column4={'uptake'} column5={'userid'} column6={'idasset'} column7={'sn'} column8={'area'} column9={'username'} column10={'introductiondate'} column11={'company'} onSubmit={setFilter} setFilterHeadquarters={setFilterHeadquarters} />
            {/* {searchs} */}
            <div style={{ width: '100vw', height: `calc(100vh - 250px)`, overflow: 'auto' }}>
                <table className="pws-table" {...getTableProps()}>
                    <thead>
                        {/* <tr>            
                        <th
                            colSpan={visibleColumns.length}
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Rendering Global Filter 
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        </th>
                    </tr> */}
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? '⬇'
                                                    : '⬆'
                                                : '⇳'}
                                        </span>
                                        {/* Rendering Default Column Filter */}
                                        {/* <div>
                                        {column.canFilter ? column.render("Filter")
                                            : null}
                                    </div> */}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr onClick={(event) => handleRowClick(event, row.values)} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td title={cell.value} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem' }}>
                <button className="btnPagePwsSE" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>
                <button className="btnPagePws" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Previous
                </button>
                <button className="btnPagePws" onClick={() => nextPage()} disabled={!canNextPage}>
                    Next
                </button>
                <button className="btnPagePwsSE" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </button>
                <span style={{ margin: '0 1rem' }}>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <span style={{ marginLeft: '5px' }}>
                    Go to page:{" "}
                    <input
                        type="number"
                        min='1'
                        max={pageCount}
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(pageNumber);
                        }}
                        style={{ width: "50px", height: '1.5rem', marginRight: '5px' }}
                    />
                </span>{" "}
                <select className="selectPageItem"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 30, 50, 100, data.length].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            페이지당 {pageSize}
                        </option>
                    ))}
                </select>
                <span style={{ marginLeft: '1rem' }}>{rows.length} rows</span>
            </div>
        </>
    );
}

export default TableDisposal;