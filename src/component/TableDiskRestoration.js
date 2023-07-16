import { useEffect, useState } from "react";
import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./Filter";
import { SearchDiskRestoration } from "./Search";
import "../css/tableDiskRestoration.css";
import "../css/foot.css";
import ContentListCommon from "./ContentListCommon";

function TableDiskRestoration({ columns, data, dataWasFiltered, setFilterHeadquarters, doRefresh, account }) {

    const [id, setId] = useState('');

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
    } = useTable({ columns, data, initialState: { /* hiddenColumns: ['id'], */ pageIndex: 0, pageSize: 100 }, defaultColumn: { Filter: DefaultFilterForColumn }, }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const { pageIndex, pageSize } = state;

    const searchs = columns.map((col) => {
        return col.Header + "";
    });

    useEffect(() => {
        dataWasFiltered(rows);
        console.log("렌더링 완료?")
    }, [rows, dataWasFiltered]);

    useEffect(() => {
        // 데이터 업데이트 및 렌더링 완료 시점을 처리하는 작업
        console.log('테이블 데이터 렌더링 완료');

        // document.getElementById('submitPwsBtn').click();
    }, []);

    const handleRowClick = (event, values) => {
        if (values.id !== null && values.id !== '') {
            console.log(values)
            setId(values.id);
        }
        else {
            alert('해당 디스크복구지원 정보가 조회되지 않았습니다. \n예상치 못한 오류입니다.');
        }
    };

    const doClose = () => {
        setId('');
    }

    console.log('DiskRestoration Table 랜더링');
    return (
        <>
            <ContentListCommon id={id} doRefresh={doRefresh} doClose={doClose} url='/api/diskrestoration' account={account} />
            {/* <Search onSubmit={setGlobalFilter} /> */}
            <SearchDiskRestoration column1={'headquarters'} column2={'team'} column3={'requestor'} column4={'idasset'} column5={'area'}  onSubmit={setFilter} setFilterHeadquarters={setFilterHeadquarters} />
            {/* {searchs} */}
            <div style={{ width: '100%', height: `calc(100vh - 250px)`, overflow: 'auto' }}>
                <table className="diskrestoration-table" {...getTableProps()} >
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
                                        {/*  <div>
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
                            if (page.length === row.index + 1) {
                                // console.log("렌더링 완료 ", page.length)
                            }
                            // 해당 페이지 렌더링 완료하면
                            /* if(page.length === row.index+1 && submit === null) {
                                console.log(row.index)
                                // isSubmit = true;
                                setSubmit(true);
                                // document.getElementById('submitPwsBtn').click();                                   
                            } */
                            return (
                                <tr onClick={(event) => handleRowClick(event, row.values)} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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

export default TableDiskRestoration;