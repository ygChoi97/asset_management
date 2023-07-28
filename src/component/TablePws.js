import { useCallback, useEffect, useRef, useState } from "react";
import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./Filter";
import { SearchPws } from "./Search";
import "../css/tableLayout.css";
import "../css/foot.css";
import ContentListCommon from "./ContentListCommon";

function TablePws({ columns, minCellWidth, data, classifications, models, uptakes, areas, companys ,dataWasFiltered, /* setFilterHeadquarters, */ doRefresh, account }) {

    const [idasset, setIdasset] = useState('');
    const [tableHeight, setTableHeight] = useState("auto");
    const [activeIndex, setActiveIndex] = useState(null);
    const tableElement = useRef(null);
    const tableContainerElement = useRef(null);
    const numColumns = columns.length;
    // 스크롤바 x position - 화면 밖 영역 column 너비계산 적용하기 위함
    useEffect(() => {
        setTableHeight(tableElement.current.offsetHeight);
    }, []);

    const mouseDown = (index) => {
        setActiveIndex(index);
    };

    const mouseMove = useCallback(
        (e) => {
            const gridColumns = columns.map((col, i) => {
                if (i === activeIndex) {
                    //const width = e.clientX - col.ref.current.offsetLeft;
                    const width = e.clientX + tableContainerElement.current.scrollLeft - col.ref.current.offsetLeft;
                    if (width >= minCellWidth) {
                        return `${width}px`;
                    }
                }
                return `${col.ref.current.offsetWidth}px`;
            });

            tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
                " "
            )}`;
        },
        [activeIndex, columns, minCellWidth]
    );

    const removeListeners = useCallback(() => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", removeListeners);
    }, [mouseMove]);

    const mouseUp = useCallback(() => {
        setActiveIndex(null);
        removeListeners();
    }, [setActiveIndex, removeListeners]);

    useEffect(() => {
        if (activeIndex !== null) {
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
        }
        return () => {
            removeListeners();
        };
    }, [activeIndex, mouseMove, mouseUp, removeListeners]);

    const resetTableCells = () => {
        tableElement.current.style.gridTemplateColumns = `repeat(${numColumns}, minmax(50px, auto))`;
    };

    const styleTable = {
        gridTemplateColumns: `repeat(${numColumns}, minmax(50px, auto))`,
        width: '180%',
    }

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

    console.log('Pws Table 랜더링');
    return (
        <>
            <ContentListCommon idasset={idasset} doRefresh={doRefresh} doClose={doClose} url='/api/pws' account={account} />
            {/* <Search onSubmit={setGlobalFilter} /> */}
            <SearchPws column1={'classification'} column2={'headquarters'} column3={'department'} column4={'model'} column5={'uptake'} column6={'userid'} column7={'idasset'} column8={'sn'} column9={'area'} column10={'username'} column11={'introductiondate'} column12={'company'} classifications={classifications} models={models} uptakes={uptakes} areas={areas} companys={companys} onSubmit={setFilter} /* setFilterHeadquarters={setFilterHeadquarters} */ />
            {/* {searchs} */}
            <div style={{ width: '100%', height: `calc(100vh - 287px)`, overflow: 'hidden' }}>
                <div ref={tableContainerElement} style={{ width: '100%', height: `calc(100vh - 287px)`, overflowX: 'auto' }}>
                    <table className="return-table" style={styleTable} ref={tableElement} {...getTableProps()} >
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
                                {headerGroup.headers.map((column, i) => (
                                    <th ref={column.ref} key={`column.accessor(${i})`}
                                    {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    <span>
                                        {column.render("Header")}
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? '🔽'
                                                : '🔼'
                                            : ''}
                                    </span>
                                    <div
                                        style={{ height: tableHeight }}
                                        onMouseDown={() => mouseDown(i)}
                                        className={`resize-handle ${activeIndex === i ? "active" : "idle"}`}
                                    />
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
                                        <td title={cell.value} {...cell.getCellProps()}>
                                        <span>{cell.render("Cell")}</span>
                                    </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>
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
                <button className="btnPagePws" style={{ margin: '0 30px' }} onClick={resetTableCells}>Layout Reset</button>
            </div>
        </>
    );
}

export default TablePws;