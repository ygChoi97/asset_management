import { useEffect, useRef } from "react";
import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./Filter";
import { Search, Search2 } from "./Search";
import "./styles.css";

function Table({ columns, data, dataWasFiltered }) {
    
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
    } = useTable({ columns, data, initialState: { pageIndex: 0 }, defaultColumn: { Filter: DefaultFilterForColumn }, }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const { pageIndex, pageSize } = state;

    const searchs = columns.map((col) => {
        return col.Header + "";
    });
    
    useEffect(() => { dataWasFiltered(rows);}, [rows, dataWasFiltered]);

   
    console.log('Table 랜더링');
    return (
        <>
            {/* <Search onSubmit={setGlobalFilter} /> */}
            <Search2 column1={'department'} column2={'model'} column3={'uptake'} column4={'userid'} column5={'idasset'} column6={'area'} column7={'username'} column8={'sn'} onSubmit={setFilter}/>
            {/* {searchs} */}
            <table className="styled-table" {...getTableProps()}>
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
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.3em' }}>
                <button className="btnPageSE" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>
                <button className="btnPage" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Previous
                </button>
                <button className="btnPage" onClick={() => nextPage()} disabled={!canNextPage}>
                    Next
                </button>
                <button className="btnPageSE" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </button>
                <span>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <span style={{ marginLeft: '5px' }}>
                    | Go to page:{" "}
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
                        style={{ width: "50px", height: '20px', marginRight: '5px' }}
                    />
                </span>{" "}
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 25, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            페이지당 {pageSize}
                        </option>
                    ))}
                </select>
                <span style={{marginLeft: '1rem'}}>{rows.length} rows</span>
            </div>
        </>
    );
}

export default Table;