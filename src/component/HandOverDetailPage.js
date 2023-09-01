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
    const [columns3, setColumns3] = useState([]);   // 출력 안함

    function dateFormat(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;

        return date.getFullYear() + '-' + month + '-' + day;
    }

    useEffect(() => {
        if (Object.keys(data[0]).length !== 0) {
            console.log(BASE_URL + `/eqlist/${data[0].applicant_team}/${data[0].applicant}/${data[0].applicant_date}`)
            fetch(BASE_URL + `/eqlist/${data[0].applicant_team}/${data[0].applicant}/${data[0].applicant_date}`, {
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
            
            // 번호, 팀명, 신청자 제외 (출력 안함)
            columns2 = columns2.filter(element => element.accessor !== 'num' && element.accessor !== 'applicant_team' && element.accessor !== 'applicant');
            setColumns3(columns2);   
        }
    }, [data, rf]);

    const onClickCloseHanler = (e) => {
        setIsOpen(!isOpen);
        doClose();  // 신청자 초기화
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
            workbook.addWorksheet('PWS 장비 인수인계 확인서');

            

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
                { width: 0.31 + adjustColWidth - 0.38}, { width: 3.75 + adjustColWidth  }, { width: 8.5 + adjustColWidth  }, { width: 8.38 + adjustColWidth  }, { width: 10.63 + adjustColWidth  }, { width: 10.63 + adjustColWidth  }, { width: 11.75 + adjustColWidth  }, { width: 5.75 + adjustColWidth  }
                , { width: 8.38 + adjustColWidth  }, { width: 5.75 + adjustColWidth  }, { width: 5.75 + adjustColWidth  }, { width: 5.75 + adjustColWidth  }, { width: 5.75 + adjustColWidth  }, { width: 4.88 + adjustColWidth  }, { width: 13.75 + adjustColWidth  }, { width: 16 + adjustColWidth  }
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
            worksheet.mergeCells('H2:K3');
            worksheet.mergeCells('L2:M3');
            worksheet.mergeCells('O2:P2');
            worksheet.mergeCells('O3:P3');
            
            worksheet.mergeCells('C4:F4');
            worksheet.mergeCells('H4:K4');
            worksheet.mergeCells('L4:N4');
            worksheet.mergeCells('O4:P4');

            worksheet.mergeCells('B5:P5');

            worksheet.getRow(4).height = 30.75;
            worksheet.getRow(5).height = 15;

            worksheet.getCell('B2').value = '지역';         // 지역
            worksheet.getCell('D2').value = '부서명';       // 부서명
            worksheet.getCell('G2').value = '작성자';       // 작성자 
            worksheet.getCell('L2').value = '연락처';       // 연락처
            worksheet.getCell('N2').value = '내선';         // 내선
            worksheet.getCell('N3').value = 'HP';           // HP
            worksheet.getCell('B4').value = '사유';         // 사유
            worksheet.getCell('C4').value = 'PWS 장비 지급';// 사유 value
            worksheet.getCell('G4').value = '지급일자';     // 지급일자
            worksheet.getCell('L4').value = '수량';         // 수량
            worksheet.getCell('O4').value = data2.length;   // 수량 value
            
            ['B2', 'D2', 'G2', 'L2', 'N2', 'N3', 'B4', 'G4', 'L4'].map(key => {
                worksheet.getCell(key).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D0CECE' },
                    bgColor: { argb: 'D0CECE' },
                };
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11, bold: true };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            worksheet.getRow(6).height = 30.75;

            worksheet.mergeCells('O6:P6');
            // for (let i = 0; i < 13; i++)
            //     worksheet.getRow(6).getCell(i + 2).value = columns2[i].Header;

            worksheet.getRow(6).getCell(2).value = '번호';
            worksheet.getRow(6).getCell(3).value = '사용자';
            worksheet.getRow(6).getCell(4).value = '사번';
            worksheet.getRow(6).getCell(5).value = '자산번호';
            worksheet.getRow(6).getCell(6).value = '관리번호';
            worksheet.getRow(6).getCell(7).value = 'S/N';
            worksheet.getRow(6).getCell(8).value = '모델명';
            worksheet.getRow(6).getCell(9).value = `사무실위치(동 층)`;
            worksheet.getRow(6).getCell(10).value = `모니터1`;
            worksheet.getRow(6).getCell(11).value = `모니터2`;
            worksheet.getRow(6).getCell(12).value = `키보드`;
            worksheet.getRow(6).getCell(13).value = `마우스`;
            worksheet.getRow(6).getCell(14).value = `헤드셋/캠`;
            worksheet.getRow(6).getCell(15).value = '지급관련 정보 및 전달사항';
            ['B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', 'K6', 'L6', 'M6', 'N6', 'O6' ].map(key => {
                    worksheet.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D0CECE' },
                        bgColor: { argb: 'D0CECE' },
                    };
                    worksheet.getCell(key).font = { name: '맑은 고딕', size: 10, bold: true };
                    worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                });
            
            worksheet.getRow(7).getCell(15).value = '장비신청자';
            worksheet.getRow(8).getCell(15).value = '장비신청자 연락처';
            worksheet.getRow(9).getCell(15).value = '전산담당자';
            worksheet.getRow(10).getCell(15).value = '전산담당자 연락처';
            worksheet.getRow(11).getCell(15).value = '실사용자';
            worksheet.getRow(12).getCell(15).value = '실사용자 연락처';
            worksheet.getRow(13).getCell(15).value = 'OS 설치 여부';
            worksheet.getRow(14).getCell(15).value = '메모리 증설';
            worksheet.getRow(15).getCell(15).value = '디스크 추가1';
            worksheet.getRow(16).getCell(15).value = '디스크 추가2';
            worksheet.getRow(17).getCell(15).value = '보관위치';

            for(let r=7; r<=17; r++) {    
                worksheet.getRow(r).getCell(15).font = { name: '맑은 고딕', size: 9, bold: true };
                worksheet.getRow(r).getCell(15).alignment = { vertical: 'middle', wrapText: true };
            }

            ['C2', 'E2', 'H2', 'O2', 'O3', 'C4', 'H4', 'O4'].map(key => {
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            }); 

            for (let r = 0; r < data2.length; r++) {
                // worksheet.getRow(7 + r).getCell(2).value = data2[r]['num'];         // 번호
                worksheet.getRow(7 + r).getCell(2).value = r+1;                     // 번호
                worksheet.getRow(7 + r).getCell(3).value = data2[r]['user'];        // 사용자
                worksheet.getRow(7 + r).getCell(4).value = data2[r]['id'];          // 사번
                worksheet.getRow(7 + r).getCell(9).value = data2[r]['location'];    // 사무실위치
                worksheet.getRow(7 + r).getCell(12).value = data2[r]['keyboard'];   // 키보드
                if (data2[r]['mouse_type'] || data2[r]['mouse_direction'])          // 마우스
                    worksheet.getRow(7 + r).getCell(13).value = 'O';
                else
                    worksheet.getRow(7 + r).getCell(13).value = 'X';
                worksheet.getRow(7 + r).getCell(14).value = `${data2[r]['headset']}/${data2[r]['webcam']}`; // 헤드셋/캠
            }

            worksheet.getRow(7).getCell(16).value = data[0]['applicant'];
            worksheet.getRow(9).getCell(16).value = data[0]['it_admin_name'];
            worksheet.getRow(10).getCell(16).value = data[0]['it_admin_phone'];
            for(let r=7; r<=17; r++) {
                worksheet.getRow(r).getCell(16).font = { name: '맑은 고딕', size: 9, bold: true };
                worksheet.getRow(r).getCell(16).alignment = { vertical: 'middle', wrapText: true };
            }
                
                for(let r=1; r<=56; r++)
                    for(let c=2; c<=16; c++)
                        worksheet.getRow(r).getCell(c).border = borderStyleDefualt;
            
            for(let num=data2.length+1; num <= 50; num++)
                worksheet.getRow(6+num).getCell(2).value = num;      

            for(let r=7; r<=56; r++) {
                worksheet.getRow(r).height = 16;
                worksheet.getRow(r).getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                for(let c=3; c<=9; c++)
                    worksheet.getRow(r).getCell(c).alignment = { vertical: 'middle' };
                for(let c=10; c<=14; c++)
                    worksheet.getRow(r).getCell(c).alignment = { horizontal: 'center', vertical: 'middle' };           
            }

            createOuterBorder(worksheet, ({ row: 1, col: 2 }), ({ row: 1, col: 16 }));
            createOuterBorder(worksheet, ({ row: 2, col: 2 }), ({ row: 4, col: 16 }));
            createOuterBorder(worksheet, ({ row: 5, col: 2 }), ({ row: 5, col: 16 }));
            createOuterBorder(worksheet, ({ row: 6, col: 2 }), ({ row: 6, col: 16 }));
            createOuterBorder(worksheet, ({ row: 1, col: 2 }), ({ row: 56, col: 16 }));

            worksheet.mergeCells('B58:P58');
            worksheet.getRow(58).height = 27;
            worksheet.getCell('B58').value = '※ 상기 전산비품의 기업비밀 보안을 점검 후 장비를 인수/인계 하였음을 확인합니다.';
            worksheet.getCell('B58').font = { name: '맑은 고딕', size: 14, bold: true };
            worksheet.getCell('B58').alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.mergeCells('B59:F59');
            worksheet.getCell('B59').value = '인계부서';
            
            worksheet.mergeCells('G59:K59');
            worksheet.getCell('G59').value = '인수부서';

            worksheet.mergeCells('L59:P59');
            worksheet.getCell('L59').value = '통제부서';

            worksheet.mergeCells('B60:C60');
            worksheet.getCell('B60').value = '부서명';

            worksheet.mergeCells('B61:C61');
            worksheet.getCell('B61').value = '담당자';

            worksheet.mergeCells('L60:M61');
            worksheet.getCell('L60').value = '부서명';

            worksheet.mergeCells('D60:F60');
            worksheet.mergeCells('G60:K60');
            worksheet.getCell('G60').value = data[0]['applicant_team'];    // 장비신청팀
            worksheet.mergeCells('D61:F61');
            worksheet.getCell('D61').value = '(인)';
            worksheet.mergeCells('G61:K61');
            worksheet.getCell('G61').value = '(인)';
            worksheet.mergeCells('N60:P61');

            ['B59', 'G59', 'L59', 'B60', 'B61', 'L60'].map(key => {
                worksheet.getCell(key).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D0CECE' },
                    bgColor: { argb: 'D0CECE' },
                };
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11, bold: true };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            ['D60', 'G60', 'N60'].map(key => {
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            ['D61', 'G61'].map(key => {
                worksheet.getCell(key).font = { name: '맑은 고딕', size: 11 };
                worksheet.getCell(key).alignment = { horizontal: 'right', vertical: 'middle' };
            });

            for(let r=59; r<=61; r++)
                for(let c=2; c<=16; c++)
                    worksheet.getRow(r).getCell(c).border = borderStyleDefualt;

            createOuterBorder(worksheet, ({ row: 59, col: 2 }), ({ row: 61, col: 16 }));

            workbook.xlsx.writeBuffer().then((data1) => {
                const blob = new Blob([data1], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveFile(blob, `PWS장비인수인계_확인서_지급(${data[0].applicant_team}_${data[0].applicant}_${data[0].applicant_date})`);
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
    
    console.log(data)
    console.log(data2)
    return (
        <div className={isOpen ? "show-page" : "hide-page"}>
            <span style={{fontSize: '2rem', fontWeight: '600', margin: '10px'}}>PWS 장비 인수/인계 확인서</span>
            <SubTable columns={columns} data={data} />

            <div style={{width: '100%', overflow: 'auto', margin: '20px 0'}}>
                <SubTable columns={columns3} data={data2}/>
            </div>
            <div style={{display: 'flex'}}>
                <Button variant="contained" color="success" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} onClick={exportHandler}>Export</Button>
                <Button variant="contained" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} onClick={onClickCloseHanler}>close</Button>
            </div>
        </div>
    );
}