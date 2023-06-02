import { Button, List, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import '../css/main.css';
import '../css/contentlist.css';
import UseConfirm from "./UseConfirm";
import ContentCommon from "./ContentCommon";

function ContentListCommon({id, doRefresh, doClose, url}) {

    const BASE_URL = `http://localhost:8181${url}`;

    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

    // PWS UI정보
    const [contents, setContents] = useState([]);

    // pws json
    const [pwsInfo, setPwsInfo] = useState({});

    const [bModifyDisabled, setBModifyDisabled] = useState(true);
    const [btnMode, setBtnMode] = useState(true);

    const [getConfirmationYN, ConfirmationYN, getConfirmationOK, ConfirmationOK] = UseConfirm();

    const [isOpen, setIsOpen] = useState(false);

    // 각 PWS 입력 항목 update 함수
    const update = item => {
        let copyContents = [...contents];
        for (let i = 0; i < copyContents.length; i++) {
            if (copyContents[i].columnName === item.columnName) {
                copyContents[i].data = item.data;
                break;
            }
        }
        setContents(copyContents);
        console.log('contents updated: ', contents);
        let info = {};
        for (let i = 0; i < copyContents.length; i++) {
            info[copyContents[i].dbColumn] = copyContents[i].data;
        }
        setPwsInfo(info);
        console.log(pwsInfo);
        if (contents[0].data != null)
            setBtnMode(false);
        else
            setBtnMode(true);
    };

    // DB에서 읽은 PWS정보를 PWS UI정보에 저장
    function insertPwsFromDB(pws) {
        let copyContents = [...contents];
        for (let dbCol in pws) {
            loop: for (let i = 0; i < copyContents.length; i++) {
                for (let item in copyContents[i]) {
                    if (dbCol === copyContents[i][item]) {
                        copyContents[i].data = pws[dbCol];
                        break loop;
                    }
                }
            }
        }
        setContents(copyContents);
        console.log('contents updated: ', contents);
    }

    // PWS 정보 렌더링 
    const items = contents.map(item => {
        // console.log(item);
        if (item.data === null) {

            console.log(item)
            if (item.dbColumn === 'period' || item.dbColumn.includes('date'))
                item.data = null;
            else
                item.data = '';
        }
        if(item.dbColumn !== 'id')
            return <ContentCommon key={item.dbColumn} item={item} update={update} />;
    });

    useEffect(() => {
        fetch(BASE_URL + `/menu`, {
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
                // 메뉴등록     
                console.log(json);
                let copyContents = [...contents];
                for (let i = 0; i < json.length; i++) {
                    /* if (json[i].column_name === 'id')
                        continue; */
                    let copyContent = {};
                    copyContent.columnName = json[i].column_comment;
                    copyContent.dbColumn = json[i].column_name;
                    if (json[i].column_name === 'idasset' || json[i].column_name === 'sn')
                        copyContent.req = 'y';
                    else if (json[i].column_name === 'uptake')
                        copyContent.uptake = 'y';
                    else if (json[i].column_name === 'period' || json[i].column_name.includes('date'))
                        copyContent.dateType = 'y';
                    else if (json[i].column_name.includes('area'))
                        copyContent.area = 'y';
                    copyContents.push(copyContent);
                }
                setContents(copyContents);
                console.log(copyContents);
                console.log('세부항목 정보 fetch 완료!');
            })
            .catch((error) => {
                console.log('error: ' + error);
                getConfirmationOK(`DB에서 세부항목 정보를 가져오지 못했습니다. ${error}`);
                
            })
    }, []);

    // id 감지
    useEffect(() => {
        if (id !== '' && id !== null && id !== undefined ) {
            fetch(BASE_URL + `/id/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            })
                .then(res => {
                    if (res.status === 403) {
                        alert('로그인 토큰이 만료되었습니다.\n로그인 페이지로 이동합니다.');
                        window.location.href = '/login';
                    }
                    else if (!res.ok) {
                        throw new Error(res.status);
                    }
                    else {
                        setBtnMode(true);
                        setBModifyDisabled(false);
                        return res.json();
                    }
                })
                .then(json => {
                    console.log('json : ', json);
                    insertPwsFromDB(json);
                })
                .catch((error) => {
                    console.log('error: ' + error);
                    getConfirmationOK(`번호(${id}) 조회 실패(${error})`);
                })
            setIsOpen(true);
        }
    }, [id]);

    const onClickModifyHandler = e => {
        
        for (let key in pwsInfo) {
            const value = pwsInfo[key];
            console.log(typeof value)
            
            if(typeof value === 'string' && value != null)
                if(value.trim() === '')
                    pwsInfo[key] = null;
                else
                    pwsInfo[key] = value.trim();
        }
        console.log('pwsInfo : ', pwsInfo);

        if((pwsInfo.idasset === null || pwsInfo.idasset === '') && (pwsInfo.sn === null || pwsInfo.sn === '')) {        
            getConfirmationOK('해당 정보의 자산관리번호와 S/N 중 최소 하나는 입력되어야 수정이 가능합니다.');
            return;
        }
        
        fetch(BASE_URL, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + ACCESS_TOKEN },
            body: JSON.stringify(pwsInfo)
        })
            .then(res => {
                if (!res.ok) {
                    console.log(JSON.stringify(pwsInfo));
                    console.log(res); throw new Error(res.status);
                }
                else {
                    setBtnMode(true);
                    return res.json();
                }
            })
            .then(json => {
                console.log(json);
                if(pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                    getConfirmationOK(`${pwsInfo.idasset} DB 저장 완료!`);
                else
                    getConfirmationOK(`${pwsInfo.sn} DB 저장 완료!`);

                doRefresh();
                
            })
            .catch(error => {
                console.log(error);
                if(pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                    getConfirmationOK(`${pwsInfo.idasset} DB 저장 실패(${error})`);
                else
                    getConfirmationOK(`${pwsInfo.sn} DB 저장 실패(${error})`);
                
            });
    };

    const onClickCloseHanler = (e) => {
        setIsOpen(!isOpen);
        doClose();  // id 초기화
    };
    console.log('ContentList 렌더링');

    return (
        <div className={isOpen ? "show-list" : "hide-list"}>
            <ConfirmationYN />
            <ConfirmationOK />
            <Paper sx={{
                width: 400,
                borderRadius: 3, borderColor: "#000",
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFF',
            }} elevation={8}>
                <List>
                    {items}
                </List>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="success" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} disabled={Boolean(bModifyDisabled | btnMode)} onClick={onClickModifyHandler}>modify</Button>
                    <Button variant="contained" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} onClick={onClickCloseHanler}>close</Button>
                </div>
            </Paper>
        </div>
    );
}

export default ContentListCommon;