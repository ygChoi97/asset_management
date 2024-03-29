import { createRef, useEffect, useRef, useState } from "react";
import "../css/btnImportExport.css";
import UseConfirm from "./UseConfirm";
import ExcelDB from "../excel_db.png";
import ExcelToDB from "../exceltodb2.png";
import DBToExcel from "../dbtoexcel2.png";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import jwt_decode from "jwt-decode";
import { DateRangeColumnFilter, dateBetweenFilterFn, exclusionFilterFn } from "./Filter";
import { useLocation, useNavigate } from "react-router-dom";
import TableHarddisk from "./TableHarddisk";
import { API_BASE_URL } from "../config/host-config";

const BASE_URL = `${API_BASE_URL}/api/harddisk`;

function Harddisk({ account }) {
    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [refresh, setRefresh] = useState(false);

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [areas, setAreas] = useState([]);

    const $fileInput = useRef();

    const [, , getConfirmationOK, ConfirmationOK] = UseConfirm();
    let filteredData = null;

    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);

    function dateFormat(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;

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
                    if (res.status === 404)
                        getConfirmationOK(`${res.status}Error - DB 테이블의 데이터가 존재하지 않습니다.`)
                    else
                        getConfirmationOK(`${res.status}Error - DB 테이블의 데이터를 가져올 수 없습니다.`)
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
                    copyData = json.hardDiskDtos[i];
                    for(const key in json.hardDiskDtos[i]) {                  
                        if(key.includes('date') && json.hardDiskDtos[i][key]!=null) {
                            let day = new Date(json.hardDiskDtos[i][key]);
                            copyData[key] = dateFormat(day);
                        }
                    }    

                    if (json.hardDiskDtos[i].ssd_500gb === 0)
                        copyData['ssd_500gb'] = null;           
                    if (json.hardDiskDtos[i].sata_1tb === 0)
                        copyData['sata_1tb'] = null;           
                    if (json.hardDiskDtos[i].m2_512gb === 0)
                        copyData['m2_512gb'] = null;           
                    if (json.hardDiskDtos[i].sata_2tb === 0)
                        copyData['sata_2tb'] = null;                    
                    
                    copyDatas.push(copyData);
                }
                setData(copyDatas);

                let result1 = [];
                copyDatas.map((item, i) => {
                    result1.push(item.classification);
                })
                let result2 = [...new Set(result1)];
                let result3 = [];
                result2.map((item, i) => {
                    if (item != null)
                        result3.push(
                            <option key={i + "_"} value={item}>{item}</option>
                        )
                });
                setClassifications(result3);

                result1 = [];
                result2 = [];
                result3 = [];

                copyDatas.map((item, i) => {
                    result1.push(item.area);
                })
                result2 = [...new Set(result1)];
                result2.map((item, i) => {
                    if (item != null)
                        result3.push(
                            <option key={i + "_"} value={item}>{item}</option>
                        )
                });
                setAreas(result3);    

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
                        const ref = createRef();
                        let copyColumn = { accessor: '', Header: '',ref: ref, Filter: '', filter: '' };
                        copyColumn.accessor = json[i].column_name;
                        if (copyColumn.accessor === 'classification' || copyColumn.accessor === 'area')
                            copyColumn.filter = 'equals';
                        if (copyColumn.accessor.includes('date')) {
                            copyColumn.Filter = DateRangeColumnFilter;
                            copyColumn.filter = dateBetweenFilterFn;
                        }
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
                        localStorage.removeItem('ACCESS_TOKEN');
                        localStorage.removeItem('LOGIN_USERNAME');
                        navigate('/login', { state: { previousPath: pathname } });
                    } else {
                        console.log('no Expired');
                        getConfirmationOK(`Error message : ${err.message}\n\n서버 점검이 필요합니다.`);
                    }
                }
            });

        getAllDataFromDB();

    }, [refresh]);

    const doRefresh = () => {
        setRefresh(!refresh);
    }

    const setFilterHeadquarters = (headquartersOption) => {
        let copyColumns = [...columns];
        console.log(headquartersOption);
        copyColumns.forEach(el => {
            if (el.accessor === 'headquarters') {
                if (headquartersOption === '1')
                    el.filter = exclusionFilterFn
                else
                    el.filter = ''
                console.log(el)
                setColumns(copyColumns);
                return false;
            }
        })
    }

    const isTokenExpired = (token) => {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    };

    const readExcel = async (e) => {
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
                    if(id > 1) return;
                    for (let c = 1; c <= sheet.getRow(1).cellCount; c++) {
                        let strDB = columns[c - 1].Header;
                        strDB = strDB.replace(/\n/g, "");
                        strDB = strDB.replace(/\s*/g, "");
                        let strExcel = sheet.getRow(1).getCell(c).toString();
                        strExcel = strExcel.replace(/\n/g, "");
                        strExcel = strExcel.replace(/\s*/g, "");
                        if (!strExcel.includes(strDB)) {
                            getConfirmationOK(`해당 파일의 포맷은 import 불가합니다. 파일을 다시 선택해주세요. 1행${c}열 불일치 (${strDB}:${strExcel})`);
                            return;
                        }
                    }

                    let tempDbData = [];
                    for (let r = 2; r <= sheet.rowCount; r++) {
                        let isEmpty = { idasset: false };
                        let obj = {};

                        for (let c = 1; c <= sheet.getRow(1).cellCount; c++) {

                            let str = sheet.getRow(r).getCell(c).toString();
                            str = str.replace(/\n/g, ""); // 개행문자 제거
                            str = str.trim();             // 양쪽 공백 제거

                            if (columns[c - 1].accessor === 'id' && str === '') {
                                getConfirmationOK(`실패 : 선택한 엑셀파일의 ${r}번째 행의 번호가 빈칸입니다.\n import를 취소합니다.`);
                                return;
                            }

                            if (columns[c - 1].accessor === 'idasset' && str === '') isEmpty.idasset = true;

                            if (isEmpty.idasset) {
                                getConfirmationOK(`실패 : 선택한 엑셀파일의 ${r}번째 행의 자산관리번호가 빈칸입니다.\n import를 취소합니다.`);
                                return;
                            }
                            if (columns[c - 1].accessor.includes('date')) {
                                if (str !== '')
                                    obj[columns[c - 1].accessor] = new Date(sheet.getRow(r).getCell(c));
                                else
                                    obj[columns[c - 1].accessor] = null;
                            }     
                            else if (columns[c - 1].accessor === 'ssd_500gb') {
                                if(Number(str) === 0)
                                    obj[columns[c - 1].accessor] = null;
                                else
                                    obj[columns[c - 1].accessor] = str;
                            }
                            else if (columns[c - 1].accessor === 'sata_1tb') {
                                if(Number(str) === 0)
                                    obj[columns[c - 1].accessor] = null;
                                else
                                    obj[columns[c - 1].accessor] = str;
                            }
                            else if (columns[c - 1].accessor === 'm2_512gb') {
                                if(Number(str) === 0)
                                    obj[columns[c - 1].accessor] = null;
                                else
                                    obj[columns[c - 1].accessor] = str;
                            }
                            else if (columns[c - 1].accessor === 'sata_2tb') {
                                if(Number(str) === 0)
                                    obj[columns[c - 1].accessor] = null;
                                else
                                    obj[columns[c - 1].accessor] = str;                             
                            }
                            else if (str === '_x000d_' || str === '')
                                obj[columns[c - 1].accessor] = null;

                            else
                                obj[columns[c - 1].accessor] = str;
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
                            getConfirmationOK(`DB 업데이트 실패 \n ${error}`);
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

        const currentDate = new Date();
        //오늘날짜를 YYYY-MM-DD 로 선언하여 파일이름에 붙이기 위해서.
        const currentDayFormat = `_${currentDate.getFullYear()}년${currentDate.getMonth() + 1}월${currentDate.getDate()}일${currentDate.getHours()}시${currentDate.getMinutes()}분${currentDate.getSeconds()}초`;

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
                    font: { name: '맑은 고딕', size: 9 },
                    // 정렬 설정
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'center',
                        wrapText: true
                    },
                }
                return obj;
            });

            const borderStyle = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            const fillStyle = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E4DCD3' },
                bgColor: { argb: 'E4DCD3' }
            };

            datas.map((item, index) => {
                sheetOne.addRow(item);
                // 추가된 행의 컬럼 설정(헤더와 style이 다를 경우)
                for (let loop = 1; loop <= columns.length; loop++) {
                    const col = sheetOne.getRow(index + 1).getCell(loop);
                    col.border = borderStyle;
                    if (index === 0) col.fill = fillStyle;
                }
            });

            for (let loop = 1; loop <= columns.length; loop++) {
                const col = sheetOne.getRow(sheetOne.rowCount).getCell(loop);
                col.border = borderStyle;
            }

            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveFile(blob, `하드디스크사용현황리스트${currentDayFormat}`);
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
            suggestedName: filename,
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
        localStorage.removeItem('SEARCHTERM_HARDDISK');
    };
    console.log(account);
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
                                {account.role === 'admin' ?
                                    <li>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                            <img src={ExcelToDB} alt="ExcelToDB" width='20%' />
                                            <button className="btnImport" onClick={importHandler}> Import data to DB</button>
                                        </div>
                                    </li> :
                                    <li>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                            <img src={ExcelToDB} alt="ExcelToDB" width='20%' />
                                            <button className="btnImportDisabled" onClick={importHandler} disabled={true}> Import data to DB</button>
                                        </div>
                                    </li>}
                                <li>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <img src={DBToExcel} alt="DBToExcel" width='20%' />
                                        <button className="btnImport" onClick={exportHandler}>Export data from DB</button>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <input type="file" accept=".xls,.xlsx" onChange={readExcel}
                onClick={(event) => {
                    event.target.value = null
                }} ref={$fileInput} hidden></input>
            <TableHarddisk columns={columns} minCellWidth={50} data={data} classifications={classifications} areas={areas} dataWasFiltered={dataWasFiltered} doRefresh={doRefresh} account={account} />
        </>

    );
}

export default Harddisk;