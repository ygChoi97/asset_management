import React, { useEffect, useRef, useState } from "react";
import "../css/btnImportExport.css";
import "../css/dropdownmenu.css"
import TablePws from "./TablePws";
import UseConfirm from "./UseConfirm";
import ExcelDB from "../excel_db.png";
import ExcelToDB from "../exceltodb2.png";
import DBToExcel from "../dbtoexcel2.png";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import jwt_decode from "jwt-decode";
import { DateRangeColumnFilter, dateBetweenFilterFn } from "./Filter";

const BASE_URL = 'http://localhost:8181/api/pws';

function Pws() {
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
        let copyDatas = [];
        for (let i = 0; i < json.count; i++) {
          //console.log(json.pwsDtos[i]);
          let copyData = {};
          copyData = json.pwsDtos[i];
          if (json.pwsDtos[i].introductiondate != null || json.pwsDtos[i].introductiondate != undefined) {
            let day = new Date(json.pwsDtos[i].introductiondate);
            copyData['introductiondate'] = dateFormat(day);
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
        console.log(res);

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
            if (json[i].column_name === 'id') continue; // 메뉴에서 인덱스 제외
            let copyColumn = { accessor: '', Header: '', Filter: '', filter: '' };
            copyColumn.accessor = json[i].column_name;
            if (copyColumn.accessor === 'uptake' || copyColumn.accessor === 'area')
              copyColumn.filter = 'equals';   // select 타입은 equals 필터 적용
            if (copyColumn.accessor === 'introductiondate') {
              copyColumn.Filter = DateRangeColumnFilter;  // 날짜 구간 필터 적용
              copyColumn.filter = dateBetweenFilterFn;
            }
            copyColumn.Header = json[i].column_comment; // 메뉴명
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
            let isEmpty = {idasset: false, sn: false};
            let obj = {};
            for (let c = 1; c <= sheet.getRow(1).cellCount; c++) {
              
              let str = sheet.getRow(r).getCell(c).toString();
              str = str.replace(/\n/g, ""); // 개행문자 제거
              str = str.trim();             // 양쪽 공백 제거

              if(columns[c - 1].accessor === 'idasset' && str == '') isEmpty.idasset = true;
              if(columns[c - 1].accessor === 'sn' && str == '') isEmpty.sn = true;
              if(isEmpty.idasset & isEmpty.sn) {
                getConfirmationOK(`실패 : 선택한 엑셀파일의 ${r}번째 행의 자산관리번호와 S/N가 둘다 빈칸입니다.\n import를 취소합니다.`);
                return;
              }

              if (columns[c - 1].accessor === 'introductiondate') {
                if (str !== '') {
                  obj[columns[c - 1].accessor] = new Date(sheet.getRow(r).getCell(c));
                }
                else
                  obj[columns[c - 1].accessor] = null;
              }
              else if (str == '_x000d_' || str == '')
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
              getConfirmationOK(`${file1.name} 를 DB에 정상적으로 업데이트했습니다.`)
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
    const currentDayFormat = `_${currentDate.getFullYear()}년${currentDate.getMonth()+1}월${currentDate.getDate()}일${currentDate.getHours()}시${currentDate.getMinutes()}분${currentDate.getSeconds()}초`;

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
      workbook.addWorksheet('PWS현황');

      // 1. getWorksheet() 함수에서 시트 명칭 전달
      const sheetOne = workbook.getWorksheet('PWS현황');

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
          col.font = { name: '맑은 고딕', size: 9 };
        }
      });

      for (let loop = 1; loop <= columns.length; loop++) {
        const col = sheetOne.getRow(sheetOne.rowCount).getCell(loop);
        col.border = borderStyle;
        col.font = { name: '맑은 고딕', size: 9 };
      }

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveFile(blob, `PWS현황리스트${currentDayFormat}`);
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
                    <img src={ExcelToDB} alt="ExcelToDB" width='20%' />
                    <button className="btnImport" onClick={importHandler}> Import data to DB</button>
                  </div>
                </li>
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
          onClick={(event)=> { 
               event.target.value = null
          }} ref={$fileInput} hidden></input>
      <TablePws columns={columns} data={data} dataWasFiltered={dataWasFiltered} />

    </>


  );
}

export default Pws;