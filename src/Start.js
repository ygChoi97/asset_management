import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./start.css";
import faker from "faker";
import Table from "./Table";

faker.seed(100);
faker.locale = 'ar';

const BASE_URL = 'http://localhost:8181/api/pws';

function Start() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const [dbData, setDbData] = useState([]);

  const $fileInput = useRef();

  const [filtered, setFiltered] = useState(null);
  
  let filteredData = null;
  /* const columns = useMemo(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "email",
        Header: "Email",
      },
      {
        accessor: "phone",
        Header: "Phone",
      },
    ],
    []
  ); */

  /* const data = useMemo(
    () =>
      Array(1000)
        .fill()
        .map(() => ({
          name: faker.name.lastName() + faker.name.firstName(),
          email: faker.address.cityName(),
          phone: faker.phone.phoneNumber(),
        })),
    []
  ); */

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

  useEffect(() => {
    fetch(BASE_URL + `/menu`)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        else {
          return res.json();
        }
      })
      .then(json => {
        
        let copyColumns = [];
        for (let i = 0; i < json.length; i++) {
          let copyColumn = { accessor: '', Header: '' };
          copyColumn.accessor = json[i].column_name;
          copyColumn.Header = json[i].column_comment;
          copyColumns.push(copyColumn);
        }
        setColumns(copyColumns);
        console.log('useEffect() fetch - /menu', copyColumns);
      });

    fetch(BASE_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        else {
          return res.json();
        }
      })
      .then(json => {
        let copyDatas = [...data];
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

        //setLoading(false);
        //setContents(json.pwsDtos);
        // console.log(copyContents[0]);
        // console.log(copyContents[json.count-1]);
        console.log('all data : ', copyDatas);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

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
          for(let c=1; c<=sheet.getRow(1).cellCount; c++) {
            if(columns[c-1].Header !== sheet.getRow(1).getCell(c).toString()) {
              console.log('You had selected wrong excel file.');
              return;
            }
          }

          let tempDbData = [];
          for(let r=2; r<=sheet.rowCount; r++ ) {
            let obj = {};
            for(let c=1; c<=sheet.getRow(1).cellCount; c++) {
              if(columns[c-1].accessor === 'introductiondate')
                if(sheet.getRow(r).getCell(c).toString() !== '') {
                  obj[columns[c-1].accessor] = new Date(sheet.getRow(r).getCell(c));
                }
                else
                  obj[columns[c-1].accessor] = null;
                
              else if(sheet.getRow(r).getCell(c).toString() == '_x000d_' || sheet.getRow(r).getCell(c).toString() == '')
                obj[columns[c-1].accessor] = null;
              else
                obj[columns[c-1].accessor] = sheet.getRow(r).getCell(c).toString();              
            }
            tempDbData.push(obj);
          }
          console.log(tempDbData);
          //setDbData(tempDbData);
          
          fetch(BASE_URL  + `/import`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
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
              console.log(json);
            })
            .catch(error => {
              console.log(error);
            });
        })
      })
    }
  }

  /* useEffect(() => {
    fetch(BASE_URL  + `/import`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(dbData)
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
      })
      .catch(error => {
        console.log(error);
      });
  }, [dbData]); */

  const importHandler = e => {
    // const $fileInput = document.getElementById('profileImg');
    $fileInput.current.click();
  };

  const exportHandler = e => {
    const datas = filteredData.map(item=>item.values);
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
      workbook.addWorksheet('pws list');

      // 1. getWorksheet() 함수에서 시트 명칭 전달
      const sheetOne = workbook.getWorksheet('pws list');

      sheetOne.columns = columns.map(item=> {
        let obj ={};
        obj.header = item.Header;
        obj.key = item.accessor;
        obj.width = 20;
        // 스타일 설정
        obj.style = {
          // Font 설정
          font: {name: 'Arial Black', size: 10},
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
      
      datas.map((item, index)=> {
        sheetOne.addRow(item);
      // 추가된 행의 컬럼 설정(헤더와 style이 다를 경우)
      for(let loop = 1; loop <= columns.length; loop++) {
        const col = sheetOne.getRow(index + 1).getCell(loop);
        col.border = borderStyle;
        col.font = {name: 'Arial Black', size: 9};
      }
      });

      for(let loop = 1; loop <= columns.length; loop++) {
        const col = sheetOne.getRow(sheetOne.rowCount).getCell(loop);
        col.border = borderStyle;
        col.font = {name: 'Arial Black', size: 9};
      }

      

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        const url = window.URL.createObjectURL(blob);
        console.log(url);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `테스트.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      })

    } catch (error) {
      console.error(error);
    }

  };
  
  // const dataWasFiltered = x => setFiltered(x);
  
  const dataWasFiltered = x => {
    filteredData = [...x];
  };

  //const dataWasFiltered = useCallback((x) => setFiltered(x), [filtered]);
  // useEffect(()=>{dataWasFiltered();},[dataWasFiltered]);

  return (
    <>
      <button className="btnImport" onClick={importHandler}>Import data to DB</button>
      <button className="btnImport" onClick={exportHandler}>Export excel from DB</button>
      <input type="file" accept=".xls,.xlsx" onChange={readExcel} ref={$fileInput} hidden></input>
      <Table columns={columns} data={data} dataWasFiltered = { dataWasFiltered }/>
    </>
  );
}

export default Start;