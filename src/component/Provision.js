import { useEffect, useRef, useState } from "react";
import "../css/btnImportExport.css";
import TableProvision from "./TableProvision";
import UseConfirm from "./UseConfirm";
import ExcelDB from "../excel_db.png";
import ExcelToDB from "../exceltodb2.png";
import DBToExcel from "../dbtoexcel2.png";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import jwt_decode from "jwt-decode";

const BASE_URL = 'http://localhost:8181/api/provision';

function Provision() {
    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    const [dbData, setDbData] = useState([]);

    const $fileInput = useRef();

    const [filtered, setFiltered] = useState(null);
    const [, , getConfirmationOK, ConfirmationOK] = UseConfirm();
    let filteredData = null;

    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);

    function dateFormat(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;

        return date.getFullYear() + '-' + month + '-' + day;
    }

    const getAllDataFromDB = () => {
        fetch(BASE_URL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                else {
                    return res.json();
                }
            })
            .then(json => {
                console.log(json);
                let copyDatas = [];
                for (let i = 0; i < json.count; i++) {
                    let copyData = {};
                    copyData = json.pwsProvisionDtos[i];
                    if (json.pwsProvisionDtos[i].period != null || json.pwsProvisionDtos[i].period != undefined) {
                        let day = new Date(json.pwsProvisionDtos[i].period);
                        copyData['period'] = dateFormat(day);
                    }
                    if (json.pwsProvisionDtos[i].joiningdate != null || json.pwsProvisionDtos[i].joiningdate != undefined) {
                        let day = new Date(json.pwsProvisionDtos[i].joiningdate);
                        copyData['joiningdate'] = dateFormat(day);
                    }

                    if (json.pwsProvisionDtos[i].applicationdate != null || json.pwsProvisionDtos[i].applicationdate != undefined) {
                        let day = new Date(json.pwsProvisionDtos[i].applicationdate);
                        copyData['applicationdate'] = dateFormat(day);
                    }

                    if (json.pwsProvisionDtos[i].provisiondate != null || json.pwsProvisionDtos[i].provisiondate != undefined) {
                        let day = new Date(json.pwsProvisionDtos[i].provisiondate);
                        copyData['provisiondate'] = dateFormat(day);
                    }

                    copyDatas.push(copyData);
                }
                setData(copyDatas);
                console.log('all data : ', copyDatas);
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        fetch(BASE_URL + `/menu`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        })
            .then(res => {
                if (res.status === 403) {
                    throw new Error('로그인 토큰이 만료되었습니다.\n로그인 페이지로 이동합니다.');
                  }
                   else if (!res.ok) {
                    throw new Error(res.status);
                }
                else {
                    return res.json();
                }
            })
            .then(json => {
                if (json != null) {
                let copyColumns = [];
                for (let i = 0; i < json.length; i++) {
                    let copyColumn = { accessor: '', Header: '', filter: '' };
                    copyColumn.accessor = json[i].column_name;
                    if (copyColumn.accessor === 'areainstall')
                        copyColumn.filter = 'equals';
                    copyColumn.Header = json[i].column_comment;
                    copyColumns.push(copyColumn);
                }
                setColumns(copyColumns);
                console.log('useEffect() fetch - /menu', copyColumns);
            }
            })
            .catch(err => {
              const token = localStorage.getItem('ACCESS_TOKEN');
              if (token) {
                const isExpired = isTokenExpired(token);
                if (isExpired) {
                  console.log('Expired');
                  alert(err.message);
                  window.location.href = '/login';
                } else {
                  console.log('no Expired');
                  alert(`Error message : ${err.message}\n\n서버 점검이 필요합니다.`);
                }
              }
            });

        getAllDataFromDB();

    }, []);

    const isTokenExpired = (token) => {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
      };

    const readExcel = async (e) => {
        let input = e.target;
        const file1 = e.target.files[0];
        console.log(file1);
        const ExcelJS = require("exceljs");
        const wb = new ExcelJS.Workbook();
        const reader = new FileReader();
        reader.readAsArrayBuffer(file1);

        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer).then(workbook => {
                console.log(workbook, 'workbook instance')
                workbook.eachSheet((sheet, id) => {
                    for (let c = 1; c <= sheet.getRow(1).cellCount; c++) {
                        if (columns[c - 1].Header !== sheet.getRow(1).getCell(c).toString()) {
                            getConfirmationOK('해당 파일의 포맷은 import 불가합니다. 파일을 다시 선택해주세요.');
                            return;
                        }
                    }

                    let tempDbData = [];
                    for (let r = 2; r <= sheet.rowCount; r++) {
                        let obj = {};
                        for (let c = 1; c <= sheet.getRow(1).cellCount; c++) {
                            if (columns[c - 1].accessor === 'period')
                                if (sheet.getRow(r).getCell(c).toString() !== '')
                                    obj[columns[c - 1].accessor] = new Date(sheet.getRow(r).getCell(c));
                                else
                                    obj[columns[c - 1].accessor] = null;

                            else if (columns[c - 1].accessor === 'joiningdate')
                                if (sheet.getRow(r).getCell(c).toString() !== '')
                                    obj[columns[c - 1].accessor] = new Date(sheet.getRow(r).getCell(c));
                                else
                                    obj[columns[c - 1].accessor] = null;

                            else if (columns[c - 1].accessor === 'applicationdate')
                                if (sheet.getRow(r).getCell(c).toString() !== '')
                                    obj[columns[c - 1].accessor] = new Date(sheet.getRow(r).getCell(c));
                                else
                                    obj[columns[c - 1].accessor] = null;
                            else if (columns[c - 1].accessor === 'provisiondate')
                                if (sheet.getRow(r).getCell(c).toString() !== '')
                                    obj[columns[c - 1].accessor] = new Date(sheet.getRow(r).getCell(c));
                                else
                                    obj[columns[c - 1].accessor] = null;

                            else if (sheet.getRow(r).getCell(c).toString() == '_x000d_' || sheet.getRow(r).getCell(c).toString() == '')
                                obj[columns[c - 1].accessor] = null;

                            else
                                obj[columns[c - 1].accessor] = sheet.getRow(r).getCell(c).toString();
                        }
                        tempDbData.push(obj);
                    }
                    console.log(tempDbData);

                    fetch(BASE_URL + `/import`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': 'Bearer ' + ACCESS_TOKEN
                        },
                        body: JSON.stringify(tempDbData)
                    })
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(res.status);
                            }
                            else {
                                return res.json();
                            }
                        })
                        .then(json => {
                            getAllDataFromDB();
                            getConfirmationOK(`${file1.name} 를 DB에 정상적으로 업데이트했습니다.`);
                            console.log(json);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
            })
        }
    }

    const importHandler = e => {
        $fileInput.current.click();
        setIsActive(false);
    };

    const exportHandler = e => {
        const datas = filteredData.map(item => item.values);
        console.log(datas);

        const Excel = require("exceljs");
        try {
            // 엑셀 생성
            const workbook = new Excel.Workbook();

            // 생성자
            workbook.creator = '허장철';

            // 최종 수정자
            workbook.lastModifiedBy = '허장철';

            // 생성일(현재 일자로 처리)
            workbook.created = new Date();

            // 수정일(현재 일자로 처리)
            workbook.modified = new Date();

            // addWorksheet() 함수를 사용하여 엑셀 시트를 추가한다.
            // 엑셀 시트는 순차적으로 생성된다.
            workbook.addWorksheet('PWS지급');

            // 1. getWorksheet() 함수에서 시트 명칭 전달
            const sheetOne = workbook.getWorksheet('PWS지급');

            sheetOne.columns = columns.map(item => {
                let obj = {};
                obj.header = item.Header;
                obj.key = item.accessor;
                obj.width = 20;
                // 스타일 설정
                obj.style = {
                    // Font 설정
                    font: { name: 'Arial Black', size: 10 },
                    // 정렬 설정
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'center',
                        wrapText: true
                    },

                    // Borders 설정
                    // border: {
                    //   top: {style:'thin'},
                    //   left: {style:'thin'},
                    //   bottom: {style:'thin'},
                    //   right: {style:'thin'},
                    // },
                    // Fills 설정
                    // fill: {
                    //   type: 'pattern',
                    //   fgColor: {argb: 'FFFFFF00'},
                    //   bgColor: {argb: 'FF0000FF'}
                    // }
                }
                return obj;
            });

            const borderStyle = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            datas.map((item, index) => {
                sheetOne.addRow(item);
                // 추가된 행의 컬럼 설정(헤더와 style이 다를 경우)
                for (let loop = 1; loop <= columns.length; loop++) {
                    const col = sheetOne.getRow(index + 1).getCell(loop);
                    col.border = borderStyle;
                    col.font = { name: 'Arial Black', size: 9 };
                }
            });

            for (let loop = 1; loop <= columns.length; loop++) {
                const col = sheetOne.getRow(sheetOne.rowCount).getCell(loop);
                col.border = borderStyle;
                col.font = { name: 'Arial Black', size: 9 };
            }

            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveFile(blob, 'PWS지급리스트');
            })
            setIsActive(false);
        } catch (error) {
            console.error(error);
        }

    };

    async function saveFile(blob, filename) {
        const opts = {
            types: [{
                description: 'Excel file',
                accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx'] },
            }],
            suggestedName: 'PWS지급리스트',
        };
        let handle = await window.showSaveFilePicker(opts);
        let writable = await handle.createWritable();
        await writable.write(blob);
        writable.close();

    }

    const dataWasFiltered = x => {
        filteredData = [...x];
    };

    useEffect(() => {
        // 브라우저가 종료될 때
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleBeforeUnload = () => {
        // 로컬 스토리지에서 데이터 삭제
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('LOGIN_USERNAME');
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <ConfirmationOK />
        <div className="container">
          <div ref={dropdownRef} className="menu-container">
            <button onClick={() => { setIsActive(!isActive) }} className="menu-trigger">
              <span>Excel 연동</span>
              <img
                src={ExcelDB}
                alt="ExcelDB"
                width='50px'
              />
            </button>
            <nav className={`menu ${isActive ? "active" : "inactive"}`}>
              <ul>
                <li>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <img src={ExcelToDB} alt="ExcelToDB" width='20%'/>
                    <button className="btnImport" onClick={importHandler}> Import data to DB</button>
                  </div>
                </li>
                <li>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <img src={DBToExcel} alt="DBToExcel" width='20%' />
                    <button className="btnImport" onClick={exportHandler}>Export excel from DB</button>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
            <input type="file" accept=".xls,.xlsx" onChange={readExcel} ref={$fileInput} hidden></input>
            <TableProvision columns={columns} data={data} dataWasFiltered={dataWasFiltered} />
        </>

    );
}

export default Provision;