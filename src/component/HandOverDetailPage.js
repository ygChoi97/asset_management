import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/host-config";
import "../css/handOverDetailPage.css";
import SubTable from "./SubTable";
import UseConfirm from "./UseConfirm";

export default function HandOverDetailPage({ data, columns, columns2, doRefresh, rf, doClose }) {
    const BASE_URL = `${API_BASE_URL}/api/handoverequipment`;
    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');
    const [, , getConfirmationOK, ConfirmationOK] = UseConfirm();
    const [isOpen, setIsOpen] = useState(false);
    const [data2, setData2] = useState([]);

    function dateFormat(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;

        return date.getFullYear() + '-' + month + '-' + day;
    }

    useEffect(() => {
        if (Object.keys(data[0]).length !== 0) {
            console.log(BASE_URL + `/eqlist/${data[0].writer}/${data[0].department}/${data[0].provisiondate}`)
            fetch(BASE_URL + `/eqlist/${data[0].writer}/${data[0].department}/${data[0].provisiondate}`, {
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
                    console.log('json : ', json);
                    let copyDatas = [];
                    for (let i = 0; i < json.count; i++) {
                        let copyData = {};
                        copyData = json.handOverEquiqmentDtos[i];
                        for (const key in json.handOverEquiqmentDtos[i]) {
                            if (key.includes('date') && json.handOverEquiqmentDtos[i][key] != null) {
                                let day = new Date(json.handOverEquiqmentDtos[i][key]);
                                copyData[key] = dateFormat(day);
                            }
                        }
                        copyDatas.push(copyData);
                    }
                    setData2(copyDatas);
                    console.log(copyDatas)
                })
                .catch((error) => {
                    console.log('error: ' + error);
                    getConfirmationOK(`조회 실패(${error})`);
                })
            setIsOpen(true);
            //     setData()
        }
    }, [data, rf]);

    const onClickCloseHanler = (e) => {
        setIsOpen(!isOpen);
        doClose();  // writer 초기화
    };

    const exportHandler = e => {
        const currentDate = new Date();
        //오늘날짜를 YYYY-MM-DD 로 선언하여 파일이름에 붙이기 위해서.
        const currentDayFormat = `_${currentDate.getFullYear()}년${currentDate.getMonth() + 1}월${currentDate.getDate()}일${currentDate.getHours()}시${currentDate.getMinutes()}분${currentDate.getSeconds()}초`;
 
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
            workbook.addWorksheet('PWS 장비 인수 인계 확인서');

            

            // 1. getWorksheet() 함수에서 시트 명칭 전달
            const worksheet = workbook.getWorksheet(1);

            const borderStyleDefualt = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            const createOuterBorder = (worksheet, start = {row: 1, col: 1}, end = {row: 1, col: 1}, borderWidth = 'medium') => {

                const borderStyle = {
                    style: borderWidth
                };
                for (let i = start.row; i <= end.row; i++) {
                    const leftBorderCell = worksheet.getCell(i, start.col);
                    const rightBorderCell = worksheet.getCell(i, end.col);
                    leftBorderCell.border = {
                        ...leftBorderCell.border,
                        left: borderStyle
                    };
                    rightBorderCell.border = {
                        ...rightBorderCell.border,
                        right: borderStyle
                    };
                }
            
                for (let i = start.col; i <= end.col; i++) {
                    const topBorderCell = worksheet.getCell(start.row, i);
                    const bottomBorderCell = worksheet.getCell(end.row, i);
                    topBorderCell.border = {
                        ...topBorderCell.border,
                        top: borderStyle
                    };
                    bottomBorderCell.border = {
                        ...bottomBorderCell.border,
                        bottom: borderStyle
                    };
                }
            };

            worksheet.columns = [  
                { width: 0.31 }, { width: 3.75 }, { width: 8.5 }, { width: 8.38 }, { width: 10.63 }, { width: 10.63 }, { width: 11.75 }, { width: 5.75 }
                , { width: 8.38 }, { width: 5.75 }, { width: 5.75 }, { width: 5.75 }, { width: 5.75 }, { width: 4.88 }, { width: 12 }, { width: 16 }
              ];  

            worksheet.mergeCells('B1:P1');
            worksheet.getCell('B1').value = 'PWS 장비 인수/인계 확인서';
            worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getRow(1).height = 45.75;
            worksheet.getCell('B1').font ={ name: '맑은 고딕', size: 20, bold: true };
            
            worksheet.mergeCells('B2:B3');
            worksheet.mergeCells('C2:C3');
            worksheet.mergeCells('D2:D3');
            worksheet.mergeCells('E2:F3');
            worksheet.mergeCells('G2:G3');
            worksheet.mergeCells('H2:J3');
            worksheet.mergeCells('K2:M3');
            worksheet.mergeCells('O2:P2');
            worksheet.mergeCells('O3:P3');
            
            worksheet.mergeCells('C4:F4');
            worksheet.mergeCells('H4:J4');
            worksheet.mergeCells('K4:N4');
            worksheet.mergeCells('O4:P4');

            worksheet.mergeCells('B5:P5');

            worksheet.getRow(4).height = 30.75;
            
            worksheet.getCell('B2').value = columns[0].Header;
            worksheet.getCell('D2').value = columns[1].Header; 
            worksheet.getCell('G2').value = columns[2].Header;   
            worksheet.getCell('K2').value = '연락처';  
            worksheet.getCell('N2').value = columns[3].Header; 
            worksheet.getCell('N3').value = columns[4].Header;
            worksheet.getCell('B4').value = columns[5].Header;
            worksheet.getCell('G4').value = columns[6].Header;
            worksheet.getCell('K4').value = columns[7].Header;  
            
            ['B2', 'D2', 'G2', 'K2', 'N2', 'N3', 'B4', 'G4', 'K4'].map(key => {
                worksheet.getCell(key).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D0CECE' },
                    bgColor: { argb: 'D0CECE' },
                };
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11, bold: true };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
                worksheet.getCell(key).border = borderStyleDefualt;
            });

            createOuterBorder(worksheet, ({ row: 1, col: 2 }), ({ row: 1, col: 16 }));
            createOuterBorder(worksheet, ({ row: 2, col: 2 }), ({ row: 4, col: 16 }));
            createOuterBorder(worksheet, ({ row: 5, col: 2 }), ({ row: 5, col: 16 }));

            worksheet.getRow(6).height = 30.75;

            worksheet.mergeCells('O6:P6');
            for(let i=0; i<13; i++)
                worksheet.getRow(6).getCell(i+2).value = columns2[i].Header;
                worksheet.getRow(6).getCell(15).value = '비고';
            ['B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', 'K6', 'L6', 'M6', 'N6', 'O6' ].map(key => {
                    worksheet.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D0CECE' },
                        bgColor: { argb: 'D0CECE' },
                    };
                    worksheet.getCell(key).font = { name: '맑은 고딕', size: 10, bold: true };
                    worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                    worksheet.getCell(key).border = borderStyleDefualt;
                });
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveFile(blob, `PWS 장비 인수/인계 확인서 리스트${currentDayFormat}`);
            })

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

    return (
        <div className={isOpen ? "show-page" : "hide-page"}>
            <span style={{fontSize: '2rem', fontWeight: '600', margin: '10px'}}>PWS 장비 인수/인계 확인서</span>
            <SubTable columns={columns} data={data} />

            <div style={{width: '100%', overflow: 'auto', margin: '20px 0'}}>
                <SubTable columns={columns2} data={data2}/>
            </div>
            <div style={{display: 'flex'}}>
                <Button variant="contained" color="success" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} onClick={exportHandler}>Export</Button>
                <Button variant="contained" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} onClick={onClickCloseHanler}>close</Button>
            </div>
        </div>
    );
}