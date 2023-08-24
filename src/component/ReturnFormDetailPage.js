import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/host-config";
import "../css/handOverDetailPage.css";
import SubTable from "./SubTable";
import UseConfirm from "./UseConfirm";

export default function ReturnFormDetailPage({ data, columns, columns2, doRefresh, rf, doClose }) {
    const BASE_URL = `${API_BASE_URL}/api/return_equipment`;
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
            console.log(BASE_URL + `/eqlist/${data[0].writer}/${data[0].department}/${data[0].returndate}`)
            fetch(BASE_URL + `/eqlist/${data[0].writer}/${data[0].department}/${data[0].returndate}`, {
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
                        copyData = json.returnEquiqmentDtos[i];
                        for (const key in json.returnEquiqmentDtos[i]) {
                            if (key.includes('date') && json.returnEquiqmentDtos[i][key] != null) {
                                let day = new Date(json.returnEquiqmentDtos[i][key]);
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
            workbook.addWorksheet('반납 PWS 장비 인수인계 확인서');

            

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

            const adjustColWidth = 0.62;
            worksheet.columns = [
                { width: 0.31 + adjustColWidth - 0.38}, 
                { width: 3.75 + adjustColWidth  },      // 번호
                { width: 5.75 + adjustColWidth  },      // 사번
                { width: 8.38 + adjustColWidth  },      // 사용자
                { width: 8.38 + adjustColWidth  },      // 직위
                { width: 8.38 + adjustColWidth  },      // 퇴직일
                { width: 8.38 + adjustColWidth  },      // 자산번호
                { width: 8.38 + adjustColWidth  },      // 관리번호
                { width: 8.38 + adjustColWidth  },      // S/N
                { width: 8.38 + adjustColWidth  },      // 모델명
                { width: 8.38 + adjustColWidth  },      // 사무실위치
                { width: 8.38 + adjustColWidth  },      // 모니터
                { width: 8.38 + adjustColWidth  },      // 키보드
                { width: 8.38 + adjustColWidth  },      // 마우스
                { width: 8.38 + adjustColWidth  },      // 보안스티커/헤드셋
                { width: 4.88 + adjustColWidth  },      // 캠/헤드셋
                { width: 6 + adjustColWidth  },         // 비고          
                { width: 16 + adjustColWidth  }         // 비고
            ];  

            worksheet.mergeCells('B1:R1');
            worksheet.getCell('B1').value = '반납 PWS 장비 인수/인계 확인서';
            worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getRow(1).height = 45.75;
            worksheet.getCell('B1').font ={ name: '맑은 고딕', size: 20, bold: true };
            
            worksheet.mergeCells('B2:C3');  // 지역
            worksheet.mergeCells('D2:E3');  // 지역(value)
            worksheet.mergeCells('F2:G3');  // 부서명
            worksheet.mergeCells('H2:K3');  // 부서명(value)
            worksheet.mergeCells('L2:L3');  // 작성자
            worksheet.mergeCells('M2:O3');  // 작성자(value)
            worksheet.mergeCells('P2:P3');  // 연락처
            
            worksheet.mergeCells('B4:C4');  // 반납일자
            worksheet.mergeCells('D4:E4');  // 반납일자(value)
            worksheet.mergeCells('F4:G4');  // 자산담당자
            worksheet.mergeCells('M4:O4');  // SAP승인(value)
            worksheet.mergeCells('P4:Q4');  // 수량

            worksheet.mergeCells('B5:R5');
            worksheet.getCell('B5').value = '※ SAP 자산인계 요청 번호 : ';
            worksheet.getRow(4).height = 30.75;
            worksheet.getRow(5).height = 24;
            worksheet.getCell('B5').alignment = { horizontal: 'left', vertical: 'middle' };

            worksheet.getCell('B2').value = columns[0].Header;  // 지역
            worksheet.getCell('F2').value = columns[1].Header;  // 부서명
            worksheet.getCell('L2').value = columns[2].Header;  // 작성자 
            worksheet.getCell('P2').value = '연락처';           // 연락처
            worksheet.getCell('Q2').value = columns[3].Header;  // 내선
            worksheet.getCell('Q3').value = columns[4].Header;  // HP
            worksheet.getCell('B4').value = columns[5].Header;  // 반납일자
            worksheet.getCell('F4').value = '자산담당자';        // 자산담당자
            worksheet.getCell('H4').value = columns[6].Header;  // 사번
            worksheet.getCell('J4').value = columns[7].Header;  // 성명
            worksheet.getCell('L4').value = columns[8].Header;  // SAP승인
            worksheet.getCell('P4').value = columns[9].Header;  // 수량
            ['B2', 'F2', 'L2', 'P2', 'Q2', 'Q3', 'B4', 'F4', 'H4', 'J4', 'L4', 'P4'].map(key => {
                if (key !== 'H4' && key !== 'J4') {
                    worksheet.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D0CECE' },
                        bgColor: { argb: 'D0CECE' },
                    };
                    worksheet.getCell(key).font = { name: '맑은 고딕', size: 11, bold: true };
                }
                else
                    worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            worksheet.getRow(6).height = 30.75;

            worksheet.mergeCells('Q6:R6');
            for(let i=0; i<columns2.length; i++)
                worksheet.getRow(6).getCell(i+2).value = columns2[i].Header;

            ['B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', 'K6', 'L6', 'M6', 'N6', 'O6', 'P6', 'Q6', 'R6' ].map(key => {
                    worksheet.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D0CECE' },
                        bgColor: { argb: 'D0CECE' },
                    };
                    worksheet.getCell(key).font = { name: '맑은 고딕', size: 10, bold: true };
                    worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                });

            worksheet.getCell('D2').value = data[0].area;
            worksheet.getCell('H2').value = data[0].department;
            worksheet.getCell('M2').value = data[0].writer;
            worksheet.getCell('R2').value = data[0].extension;
            worksheet.getCell('R3').value = data[0].hp;
            worksheet.getCell('D4').value = data[0].returndate;
            worksheet.getCell('I4').value = data[0].id;
            worksheet.getCell('K4').value = data[0].name;
            worksheet.getCell('M4').value = data[0].sapapproval;
            worksheet.getCell('R4').value = data[0].quantity;

            ['D2', 'H2', 'M2', 'R2', 'R3', 'D4', 'I4', 'K4', 'M4', 'R4'].map(key => {
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            }); 
            /* ['R2', 'R3', 'I4', 'K4'].map(key => {
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { vertical: 'middle' };
            });  */
            console.log(data2)
            const keys = Object.keys(data2[0]);
            console.log(keys)
            for(let r=0; r<data2.length; r++)
            for(let i=0; i<keys.length; i++) {
                if(keys[i] === 'department' || keys[i] === 'writer' || keys[i] === 'returndate') continue;
                if(keys[i] === 'note') 
                    worksheet.mergeCells(7+r, i+2, 7+r, i+3);
                worksheet.getRow(7+r).getCell(i+2).value = data2[r][keys[i]];
            }
                
            for (let r = 1; r <= 56; r++)
                for (let c = 2; c <= 18; c++)
                    worksheet.getRow(r).getCell(c).border = borderStyleDefualt;
            
            for(let num=data2.length+1; num <= 50; num++) {
                worksheet.getRow(6+num).getCell(2).value = num;      
                worksheet.mergeCells(6+num, 17, 6+num, 18);
            }

            for(let r=7; r<=56; r++) {
                worksheet.getRow(r).height = 16;
                worksheet.getRow(r).getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                for(let c=3; c<=11; c++)
                    worksheet.getRow(r).getCell(c).alignment = { vertical: 'middle' };
                for(let c=12; c<=18; c++)
                    worksheet.getRow(r).getCell(c).alignment = { horizontal: 'center', vertical: 'middle' };           
            }

            createOuterBorder(worksheet, ({ row: 1, col: 2 }), ({ row: 1, col: 18 }));
            createOuterBorder(worksheet, ({ row: 2, col: 2 }), ({ row: 4, col: 18 }));
            createOuterBorder(worksheet, ({ row: 5, col: 2 }), ({ row: 5, col: 18 }));
            createOuterBorder(worksheet, ({ row: 6, col: 2 }), ({ row: 6, col: 18 }));
            createOuterBorder(worksheet, ({ row: 1, col: 2 }), ({ row: 56, col: 18 }));

            worksheet.mergeCells('B60:R60');
            worksheet.getRow(60).height = 27;
            worksheet.getCell('B60').value = '※ 상기 전산비품의 기업비밀 보안을 점검 후 장비를 인수/인계 하였음을 확인합니다.';
            worksheet.getCell('B60').font = { name: '맑은 고딕', size: 14, bold: true };
            worksheet.getCell('B60').alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.mergeCells('B61:K61');
            worksheet.getCell('B61').value = '인계부서';
            
            worksheet.mergeCells('L61:O61');
            worksheet.getCell('L61').value = '인수부서';

            worksheet.mergeCells('P61:R61');
            worksheet.getCell('P61').value = '통제부서';

            worksheet.mergeCells('B62:D62');
            worksheet.getCell('B62').value = '부서명';

            worksheet.mergeCells('B63:D63');
            worksheet.getCell('B63').value = '담당자';

            worksheet.mergeCells('P62:Q63');
            worksheet.getCell('P62').value = '부서명';

            worksheet.mergeCells('E62:K62');
            worksheet.mergeCells('L62:O62');
            worksheet.mergeCells('E63:K63');
            worksheet.getCell('E63').value = '(인)';
            worksheet.mergeCells('L63:O63');
            worksheet.getCell('L63').value = '(인)';
            worksheet.mergeCells('R62:R63');

            ['B61', 'L61', 'P61', 'B62', 'B63', 'P62'].map(key => {
                worksheet.getCell(key).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D0CECE' },
                    bgColor: { argb: 'D0CECE' },
                };
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11, bold: true };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            ['E62', 'L62', 'R62'].map(key => {
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            ['E63', 'L63'].map(key => {
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { horizontal: 'right', vertical: 'middle' };
            });

            for(let r=61; r<=63; r++)
                for(let c=2; c<=18; c++)
                    worksheet.getRow(r).getCell(c).border = borderStyleDefualt;

            createOuterBorder(worksheet, ({ row: 61, col: 2 }), ({ row: 63, col: 18 }));

            workbook.xlsx.writeBuffer().then((data1) => {
                const blob = new Blob([data1], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveFile(blob, `반납 PWS 장비 인수/인계 확인서(${data[0].department}_${data[0].writer}_${data[0].returndate})`);
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
    console.log(data2)
    return (
        <div className={isOpen ? "show-page" : "hide-page"}>
            <span style={{fontSize: '2rem', fontWeight: '600', margin: '10px'}}>반납 PWS 장비 인수/인계 확인서</span>
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