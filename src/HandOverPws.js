import React, { useRef, useState } from "react";
import { saveAs } from 'file-saver';
import './search.css';
import './handOverPws.css';
import xx from './handoverpws.xlsx'
export default function HandOverPws() {

    const $fileInput = useRef();

    const [data, setData] = useState([]);

    const [area, setArea] = useState('');
    const [department, setDepartment] = useState('');
    const [writer, setwriter] = useState('');
    const [tel, setTel] = useState('');
    const [hp, setHp] = useState('');
    const [reason, setReason] = useState('');
    const [date, setDate] = useState('');
    const [quantity, setQuantity] = useState('');

    const [username, setUsername] = useState('');
    const [userid, setUserid] = useState('');
    const [assetno, setAssetno] = useState('');

    const [idasset, setIdasset] = useState('');
    const [sn, setSn] = useState('');
    const [model, setModel] = useState('');

    const [location, setLocation] = useState('');
    const [monitor, setMonitor] = useState('');
    const [keyboard, setKeyboard] = useState('');

    const [mouse, setMouse] = useState('');
    const [sticker, setSticker] = useState('');
    const [cam, setCam] = useState('');

    const areaHandler = (e) => {
        setArea(e.target.value);
    };
    const departmentHandler = (e) => {
        setDepartment(e.target.value);
    };
    const writerHandler = (e) => {
        setwriter(e.target.value);
    };
    const telHandler = (e) => {
        setTel(e.target.value);
    };
    const hpHandler = (e) => {
        setHp(e.target.value);
    };
    const reasonHandler = (e) => {
        setReason(e.target.value);
    };
    const dateHandler = (e) => {
        setDate(e.target.value);
    };
    const quantityHandler = (e) => {
        setQuantity(e.target.value);
    };

    const usernameHandler = (e) => {
        setUsername(e.target.value);
    };

    const useridHandler = (e) => {
        setUserid(e.target.value);
    };

    const assetnoHandler = (e) => {
        setAssetno(e.target.value);
    };

    const idassetHandler = (e) => {
        setIdasset(e.target.value);
    };

    const snHandler = (e) => {
        setSn(e.target.value);
    };

    const modelHandler = (e) => {
        setModel(e.target.value);
    };

    const locationHandler = (e) => {
        setLocation(e.target.value);
    };

    const monitorHandler = (e) => {
        setMonitor(e.target.value);
    };

    const keyboardHandler = (e) => {
        setKeyboard(e.target.value);
    };

    const mouseHandler = (e) => {
        setMouse(e.target.value);
    };

    const stickerHandler = (e) => {
        setSticker(e.target.value);
    };

    const camHandler = (e) => {
        setCam(e.target.value);
    };

    const hSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.elements);

        let tempData = [...data];
        let apply = {};
        for (let v of event.target.elements) {
            if (v.nodeName != 'BUTTON') {
                if (v.value == '') {
                    if (v.nodeName == 'INPUT')
                        alert(`${v.placeholder} 을(를) 입력하지 않았습니다.`);
                    if (v.nodeName == 'SELECT')
                        alert(`${v[0].text} 을(를) 입력하지 않았습니다.`);
                    return;
                }
                apply[v.name] = v.value;
            }
        }
        tempData.push(apply);
        setQuantity(tempData.length);
        setData(tempData);
        console.log(tempData);
    }

    const excelDownHandler = async(e) => {
        if (area == '') return;
        if (department == '') return;
        if (writer == '') return;
        if (tel == '') return;
        if (hp == '') return;
        if (reason == '') return;
        if (date == '') return;
        if (quantity == '') return;

        /* const ExcelJS = require("exceljs");
        const wb = new ExcelJS.Workbook();
        try {
            const oReq = new XMLHttpRequest();
            const excelUrl = $fileInput.value;
            oReq.open('get', excelUrl, true);
            oReq.responseType = 'blob';
            const reader = new FileReader();
            reader.readAsArrayBuffer(oReq);
            oReq.send(null);
            

        } catch(error) {
            console.log(error);
        } */

    };

    const resetHandler = (event) => {
        setUsername('');
        setUserid('');
        setAssetno('');
        setIdasset('');
        setSn('');
        setModel('');
        setLocation('');
        setMonitor('');
        setKeyboard('');
        setMouse('');
        setSticker('');
        setCam('');
    };

    const contents = data.map((item, index) => {

        const values = Object.values(item);

        const vs = values.map((v, idx) => { return <td key={(index + 1) * 10 + idx}>{v}</td> });

        return (
            <tr key={index + 1}>
                <td>{index + 1}</td>
                {vs}
            </tr>
        );
    });

    console.log(contents);
    return (

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>PWS 장비 인수/인계 확인서</h1>
            <table>
                <tbody>
                    <tr className="narrowTr">
                        <td rowSpan='2'>지역</td>
                        <td rowSpan='2'>
                            <select className='selectArea' name='area' onChange={areaHandler} value={area}>
                                <option value="">― 지역 ―</option>
                                <option>남양</option>
                                <option>마북</option>
                                <option>의왕</option>
                                <option>양재</option>
                                <option>삼성사옥</option>
                                <option>루첸타워</option>
                                <option>오토웨이타워</option>
                                <option>판교</option>
                                <option>원효</option>
                                <option>울산</option>
                                <option>아산</option>
                                <option>전주</option>
                                <option>소하</option>
                                <option>화성</option>
                                <option>광주</option>
                                <option>기타</option>
                            </select>
                        </td>
                        <td rowSpan='2'>부서명</td>
                        <td rowSpan='2' colSpan='2'><input className='inputTable' name='department' onChange={departmentHandler} value={department} /></td>
                        <td rowSpan='2'>작성자</td>
                        <td rowSpan='2' colSpan='3'><input className='inputTable' name='writer' onChange={writerHandler} value={writer} /></td>

                        <td rowSpan='2' colSpan='3'>연락처</td>
                        <td>내선</td><td colSpan='2'><input className='inputTable' name='tel' onChange={telHandler} value={tel} /></td>
                    </tr>
                    <tr className="narrowTr">
                        <td>HP</td>
                        <td colSpan='2'><input className='inputTable' name='hp' onChange={hpHandler} value={hp} /></td>
                    </tr>
                    <tr>
                        <td>사유</td>
                        <td colSpan='4'><input className='inputTable' name='reason' onChange={reasonHandler} value={reason} /></td>
                        <td>지급일자</td>
                        <td colSpan='3'><input className='inputTable' type='date' name='date' onChange={dateHandler} value={date} /></td>
                        <td colSpan='4'>수량</td>
                        <td><input className='inputTable' type='number' min='0' name='quantity' onChange={quantityHandler} value={quantity} disabled /></td>
                    </tr>
                </tbody>
            </table>

            <button className="btnSearch" onClick={excelDownHandler}>엑셀 내려받기</button>
            
            {/*<input type="file" value='http://3000/handoverpws.xlsx' ref={$fileInput} readOnly hidden></input>  */}

            <form onSubmit={hSubmit} style={{ border: '1px solid', width: '70%', margin: '3rem auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <div><input className='underline' name='username' placeholder='사용자' onChange={usernameHandler} value={username} /></div>
                            <div><input className='underline' type='number' name='userid' placeholder='사번' onChange={useridHandler} value={userid} /></div>
                            <div><input className='underline' name='assetno' placeholder='자산번호' onChange={assetnoHandler} value={assetno} /></div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <div><input className='underline' name='idasset' placeholder='관리번호' onChange={idassetHandler} value={idasset} /></div>
                            <div><input className='underline' name='sn' placeholder='S/N' onChange={snHandler} value={sn} /></div>
                            <div><input className='underline' name='model' placeholder='모델명' onChange={modelHandler} value={model} /></div>
                        </div>


                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <div><input className='underline' name='location' placeholder='사무실위치 (동, 층)' onChange={locationHandler} value={location} /></div>
                            <div>
                                <select className='selectItem' name='monitor' onChange={monitorHandler} value={monitor}>
                                    <option value="">모니터</option>
                                    <option>O</option>
                                    <option>X</option>
                                </select>
                            </div>
                            <div>
                                <select className='selectItem' name='keyboard' onChange={keyboardHandler} value={keyboard}>
                                    <option value="">키보드</option>
                                    <option>O</option>
                                    <option>X</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <div>
                                <select className='selectItem' name='mouse' onChange={mouseHandler} value={mouse}>
                                    <option value="">마우스</option>
                                    <option>O</option>
                                    <option>X</option>
                                </select>
                            </div>
                            <div>
                                <select className='selectItem' name='sticker' onChange={stickerHandler} value={sticker}>
                                    <option value="">보안스티커</option>
                                    <option>O</option>
                                    <option>X</option>
                                </select>
                            </div>
                            <div>
                                <select className='selectItem' name='cam' onChange={camHandler} value={cam}>
                                    <option value="">캠/헤드셋</option>
                                    <option>O</option>
                                    <option>X</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
                        <button className="btnSearch">사용자 추가</button>
                        <button type='button' className="btnSearch" onClick={resetHandler}>Reset</button>
                    </div>
                </div>
            </form>

            {contents.length > 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>사용자</th>
                            <th>사번</th>
                            <th>자산번호</th>
                            <th>관리번호</th>
                            <th>S/N</th>
                            <th>모델명</th>
                            <th>사무실위치</th>
                            <th>모니터</th>
                            <th>키보드</th>
                            <th>마우스</th>
                            <th>보안스티커</th>
                            <th>캠/헤드셋</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contents}
                    </tbody>
                </table>
                : <></>}
        </div>
    );
}