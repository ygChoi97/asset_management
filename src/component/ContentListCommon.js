import { Button, List, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import '../css/main.css';
import '../css/contentlist.css';
import UseConfirm from "./UseConfirm";
import ContentCommon from "./ContentCommon";
import { useLocation, useNavigate } from "react-router-dom";

function ContentListCommon({ idasset, id, doRefresh, doClose, url, account }) {

    const BASE_URL = `http://localhost:8181${url}`;

    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');
    const {pathname} = useLocation();
    const navigate = useNavigate();
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
        console.log(copyContents)
        let totalVolume = 0;
        for (let i = 0; i < copyContents.length; i++) {
            
                if (copyContents[i].dbColumn === 'gb4') {
                    totalVolume += copyContents[i].data * 4;
                    continue;
                }
                if (copyContents[i].dbColumn === 'gb8') {
                    totalVolume += copyContents[i].data * 8;
                    continue;
                }
                if (copyContents[i].dbColumn === 'gb16') {
                    totalVolume += copyContents[i].data * 16;
                    continue;
                }
                if (copyContents[i].dbColumn === 'gb32') {
                    totalVolume += copyContents[i].data * 32;
                    continue;
                }
                if(copyContents[i].dbColumn === 'volume') {
                    if(totalVolume !== 0)
                        copyContents[i].data = `${totalVolume}GB`;
                    else
                        copyContents[i].data = null;  
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
            if (item.dbColumn === 'period' || item.dbColumn.includes('date')) {
                console.log(item)
                item.data = null;
            }
            else
                item.data = '';
        }
        // if(item.dbColumn !== 'id')
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
                    let copyContent = {};
                    copyContent.columnName = json[i].column_comment;
                    copyContent.dbColumn = json[i].column_name;
                    if (json[i].column_name === 'id' || json[i].column_name === 'volume') 
                        copyContent.readOnly = 'y';
                    else if (json[i].column_name === 'gb4' || json[i].column_name === 'gb8' || json[i].column_name === 'gb16' || json[i].column_name === 'gb32' || json[i].column_name === 'ssd_500gb' || json[i].column_name === 'sata_1tb' || json[i].column_name === 'm2_512gb' || json[i].column_name === 'sata_2tb' || json[i].column_name === 'headset' || json[i].column_name === 'webcam' || json[i].column_name === 'usbgender')
                        copyContent.number = 'y';
                    else if (json[i].column_name === 'idasset')
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
        if (id !== '' && id !== null && id !== undefined) {
            fetch(BASE_URL + `/id/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            })
                .then(res => {
                    if (res.status === 403) {                      
                        async function gotoLoginPage (){
                            localStorage.removeItem('ACCESS_TOKEN');
                            localStorage.removeItem('LOGIN_USERNAME');
                            await getConfirmationOK('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');                        
                            navigate("/login", { state: { previousPath: pathname } })                        
                        }
                        gotoLoginPage();
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

    // idasset 감지
    useEffect(() => {
        if (idasset !== '' && idasset !== null && idasset !== undefined) {
            fetch(BASE_URL + `/idasset/${idasset}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            })
                .then(res => {
                    if (res.status === 403) {
                        async function gotoLoginPage (){
                            localStorage.removeItem('ACCESS_TOKEN');
                            localStorage.removeItem('LOGIN_USERNAME');
                            await getConfirmationOK('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');                        
                            navigate("/login", { state: { previousPath: pathname } })                        
                        }
                        gotoLoginPage();                      
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
                    getConfirmationOK(`자산관리번호(${idasset}) 조회 실패(${error})`);
                })
            setIsOpen(true);
        }
    }, [idasset]);

    const onClickModifyHandler = e => {

        for (let key in pwsInfo) {
            const value = pwsInfo[key];
            console.log(typeof value)

            if (typeof value === 'string' && value != null)
                if (value.trim() === '')
                    pwsInfo[key] = null;
                else
                    pwsInfo[key] = value.trim();
        }
        console.log('pwsInfo : ', pwsInfo);

        if ((pwsInfo.idasset === null || pwsInfo.idasset === '')) {
            getConfirmationOK('해당 자산의 자산관리번호는 필수입력 항목입니다.');
            return;
        }
        let msg = '';
        fetch(BASE_URL, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            body: JSON.stringify(pwsInfo)
        })
            .then(res => {
                if (!res.ok) {
                    console.log(JSON.stringify(pwsInfo));
                    console.log(res);
                    msg = `status(${res.status}) `
                    return res.json();
                }
                else {
                    setBtnMode(true);
                    return res.json();
                }
            })
            .then(json => {
                console.log(json);
                if (json.count) {   // SQL이 정상동작했다면 PwsDto을 response
                    if (pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                        getConfirmationOK(`${pwsInfo.idasset} DB 저장 완료!`)
                            .then(res => { doRefresh(); });
                    else
                        getConfirmationOK(`${pwsInfo.sn} DB 저장 완료!`)
                            .then(res => { doRefresh(); });

                    // doRefresh();
                }
                else
                    throw new Error(msg.concat(json.cause.message));
            })
            .catch(error => {
                console.log(error);
                if (pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                    getConfirmationOK(`${pwsInfo.idasset} DB 저장 실패 (${error})`);
                else
                    getConfirmationOK(`${pwsInfo.sn} DB 저장 실패 (${error})`);

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
                borderRadius: 1, borderColor: "#000",
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFC',
            }} elevation={8}>
                <List>
                    {items}
                </List>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {account.role === 'admin' ?
                        <Button variant="contained" color="success" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} disabled={Boolean(bModifyDisabled | btnMode)} onClick={onClickModifyHandler}>modify</Button>
                        : <></>}
                    <Button variant="contained" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} onClick={onClickCloseHanler}>close</Button>
                </div>
            </Paper>
        </div>
    );
}

export default ContentListCommon;