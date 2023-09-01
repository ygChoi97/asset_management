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
import TableHandOver from "./TableHandOver";
import { API_BASE_URL } from "../config/host-config";

const BASE_URL = `${API_BASE_URL}/api/handover`;
const BASE_URL2 = `${API_BASE_URL}/api/handoverequipment`;

function HandOver({ account }) {
    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [refresh, setRefresh] = useState(false);

    const [columns, setColumns] = useState([]);
    const [columns2, setColumns2] = useState([]);
    const [data, setData] = useState([]);
    
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
                    copyData = json.handOverDtos[i];
                    for (const key in json.handOverDtos[i]) {
                        if (key.includes('date') && json.handOverDtos[i][key] != null) {
                            let day = new Date(json.handOverDtos[i][key]);
                            copyData[key] = dateFormat(day);
                        }
                    }

                    if (json.handOverDtos[i].quantity === 0)
                        copyData['quantity'] = null;           

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
                        const ref = createRef();
                        let copyColumn = { accessor: '', Header: '', ref: ref, Filter: '', filter: '' };
                        copyColumn.accessor = json[i].column_name;
                        if (copyColumn.accessor === 'area')
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

        fetch(BASE_URL2 + `/menu`, {
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
                        let copyColumn = { accessor: '', Header: '' };
                        copyColumn.accessor = json[i].column_name;
                        copyColumn.Header = json[i].column_comment;
                        // foreign key 제외
                        // if(copyColumn.accessor !== 'applicant_team' && copyColumn.accessor !== 'applicant')
                            copyColumns.push(copyColumn);
                    }
                    setColumns2(copyColumns);
                    console.log('useEffect() fetch - /menu2', copyColumns);
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
        // getAllDataFromDB2();

    }, [refresh]);

    const doRefresh = () => {
        setRefresh(!refresh);
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
                    if (id > 1) return;
                    
                    let strExcel = sheet.getRow(1).getCell(1).toString();
                    strExcel = strExcel.replace(/\n/g, "");
                    strExcel = strExcel.replace(/\s*/g, "");
                    if (strExcel.toUpperCase() !== 'PWS장비신청서') {
                        getConfirmationOK(`해당 파일의 포맷은 import 불가합니다. (A1셀 : PWS 장비 신청서 가 아님) 파일을 다시 선택해주세요.`);
                        return;
                    }
                    console.log(columns2)
                    const columnsTitle = 6;
                    for (let c = 1; c <= columns2.length - 3; c++) {
                        let strDB = columns2[c - 1].Header;
                        strDB = strDB.replace(/\n/g, "");
                        strDB = strDB.replace(/\s*/g, "");
                        let strExcel = sheet.getRow(columnsTitle).getCell(c).toString();
                        strExcel = strExcel.replace(/\n/g, "");
                        strExcel = strExcel.replace(/\s*/g, "");
                        if (!strExcel.includes(strDB)) {
                            getConfirmationOK(`해당 파일의 포맷은 import 불가합니다. 파일을 다시 선택해주세요. ${columnsTitle}행${c}열 불일치 (${strDB}:${strExcel})`);
                            return;
                        }
                    }

                    let tempDbData = [];
                    let tempDbData2 = [];
                    let obj = {};
                    // let obj2 = {};
                    let str = sheet.getRow(4).getCell(1).toString();    // '- 팀명 : OOO,  신청자 : OOO'
                    str = str.replace(/\n/g, ""); // 개행문자 제거
                    str = str.trim();             // 양쪽 공백 제거
                    str = str.replace(/\s*/g, "");
                    console.log(str)
                    if (!str.includes('팀명:') || !str.includes('신청자:')) {
                        
                        getConfirmationOK(`실패 : 선택한 엑셀파일의 A4셀의 값이 '팀명 :' 또는 '신청자 :' 가 없습니다.\n import를 취소합니다.`);
                        return;
                    }

                    const index_team = str.indexOf('팀명:');
                    const index_applicant = str.indexOf('신청자:');

                    const strTeam = str.substring(index_team, index_applicant-1);
                    const arrTeam = strTeam.split(':', 2);
                    if(arrTeam[1].length <= 1) {
                        getConfirmationOK(`실패 : A4셀의 팀명을 읽을 수 없습니다.\n import를 취소합니다.`);
                        return;
                    }

                    const strApplicant = str.substring(index_applicant);
                    const arrApplicant = strApplicant.split(':', 2);
                    if(arrApplicant[1].length <= 1) {
                        getConfirmationOK(`실패 : A4셀의 신청자를 읽을 수 없습니다.\n import를 취소합니다.`);
                        return;
                    }

                    console.log(strTeam)
                    console.log(arrTeam)
                    console.log(strApplicant)
                    console.log(arrApplicant)
                    console.log(columns2)
                    // obj[columns2[columns2.length - 2].accessor] = arrTeam[1];         // applicant_team  
                    // obj[columns2[columns2.length - 1].accessor] = arrApplicant[1];    // applicant
                    
                    

                    for (let r = 7; r <= 6 + sheet.rowCount; r++) {
                        let obj2 = {};
                        obj2[columns2[columns2.length - 3].accessor] = (r-6).toString();  // 번호(num)
                        obj2[columns2[columns2.length - 2].accessor] = arrTeam[1];         // 신청자팀(applicant_team  )
                        obj2[columns2[columns2.length - 1].accessor] = arrApplicant[1];    // 신청자(applicant)
                        
                        if(sheet.getRow(r).getCell(1).toString() === '') break;
                        for (let c = 1; c <= columns2.length - 3; c++) {

                            let str = sheet.getRow(r).getCell(c).toString();
                            str = str.replace(/\n/g, ""); // 개행문자 제거
                            str = str.trim();             // 양쪽 공백 제거

                            if (str === '' && columns2[c - 1].accessor !== 'mouse_type' && columns2[c-2].accessor !== 'mouse_direction') {  // 마우스타입, 마우스구분 빈칸 허용
                                const strHeader = columns2[c - 1].Header;
                                const lastChar = strHeader.charCodeAt(strHeader.length-1);
                                console.log(`${strHeader} - ${lastChar} : ${parseInt(((lastChar - 44032) % (21 * 28)) % 28)}`)
                                if(parseInt(((lastChar - 44032) % (21 * 28)) % 28) <= 0)
                                    getConfirmationOK(`실패 : 선택한 엑셀파일의 ${r}번째 행의 '${columns2[c - 1].Header}'가 빈칸입니다. import를 취소합니다.`);
                                else
                                    getConfirmationOK(`실패 : 선택한 엑셀파일의 ${r}번째 행의 '${columns2[c - 1].Header}'이 빈칸입니다. import를 취소합니다.`);
                                return;
                            }

                            if (columns2[c - 1].accessor.includes('date')) {
                                if (str !== '')
                                    obj2[columns2[c - 1].accessor] = new Date(sheet.getRow(r).getCell(c));
                                else
                                    obj2[columns2[c - 1].accessor] = null;
                            }
                            else if (str === '_x000d_' || str === '')
                                obj2[columns2[c - 1].accessor] = null;

                            else
                                obj2[columns2[c - 1].accessor] = str;
                        }

                        tempDbData2.push(obj2);

                        
                    }

                    for(let i=0; i<columns.length; i++) {
                        for(let j=0; j<columns2.length; j++)
                            if(columns[i].accessor === columns2[j].accessor) {
                                obj[columns[i].accessor] = tempDbData2[0][columns2[j].accessor];
                                console.log(obj[columns[i].accessor])
                                break;
                            }
                    }

                    tempDbData.push(obj);
                    console.log(tempDbData[0]);
                    console.log(tempDbData2);

                    fetch(BASE_URL + `/import`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': 'Bearer ' + ACCESS_TOKEN
                        },
                        body: JSON.stringify(tempDbData[0])
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
                            // getConfirmationOK(`${file1.name} 를 DB에 정상적으로 업데이트했습니다.`);
                            console.log(json);

                            fetch(BASE_URL2 + `/import`, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json',
                                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                                },
                                body: JSON.stringify(tempDbData2)
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
                                    // getAllDataFromDB2();
                                    getConfirmationOK(`${file1.name} 를 DB에 정상적으로 업데이트했습니다.`);
                                    // doRefresh();
                                    console.log(json);
                                })
                                .catch(error => {
                                    console.log(error);
                                    getConfirmationOK(`DB 업데이트 실패 \n ${error}`);
                                });
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
                saveFile(blob, `PWS 장비 인수/인계 확인서 리스트${currentDayFormat}`);
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
        localStorage.removeItem('SEARCHTERM_HANDOVER');
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
                                {/* <li>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <img src={DBToExcel} alt="DBToExcel" width='20%' />
                                        <button className="btnImport" onClick={exportHandler}>Export data from DB</button>
                                    </div>
                                </li> */}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <input type="file" accept=".xls,.xlsx" onChange={readExcel}
                onClick={(event) => {
                    event.target.value = null
                }} ref={$fileInput} hidden></input>
            <TableHandOver columns={columns} columns2={columns2} minCellWidth={50} data={data} dataWasFiltered={dataWasFiltered} doRefresh={doRefresh} rf={refresh} account={account} />
        </>

    );
}

export default HandOver;