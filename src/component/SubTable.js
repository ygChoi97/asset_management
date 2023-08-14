import React from "react";
import { useTable } from "react-table";
import "../css/subTable.css";

function SubTable({ columns, data }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    const numColumns = columns.length;
    console.log('MainTable : ', columns)
    console.log('MainTable : ', data)

    const styleTable = {
        gridTemplateColumns: `repeat(${numColumns}, minmax(50px, auto))`,
        width: '100%'
    }

    return (
        <table className="sub-table" style={styleTable} {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td title={cell.value} {...cell.getCellProps()}><span>{cell.render("Cell")}</span></td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default SubTable;