import React, { useState } from "react";
import './search.css';

export function Search({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event.target.elements.filter.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="filter" />
      <button>Search</button>
    </form>
  );
}

export function Search2({ column1, column2, column3, column4, column5, column6, column7, column8, onSubmit }) {
  const [department, setDepartment] = useState('');
  const [model, setModel] = useState('');
  const [uptake, setUptake] = useState('');

  const [userid, setUserid] = useState('');
  const [idasset, setIdasset] = useState('');
  const [area, setArea] = useState('');

  const [username, setUsername] = useState('');
  const [sn, setSn] = useState('');

  const departmentHandler = (e) => {
    const inputText = e.target.value;
    setDepartment(inputText);
  }

  const modelHandler = (e) => {
    const inputText = e.target.value;
    setModel(inputText);
  }

  const uptakeHandler = (e) => {
    const inputText = e.target.value;
    setUptake(inputText);
  }

  const useridHandler = (e) => {
    const inputText = e.target.value;
    setUserid(inputText);
  }

  const idassetHandler = (e) => {
    const inputText = e.target.value;
    setIdasset(inputText);
  }

  const areaHandler = (e) => {
    const inputText = e.target.value;
    setArea(inputText);
  }

  const usernameHandler = (e) => {
    const inputText = e.target.value;
    setUsername(inputText);
  }

  const snHandler = (e) => {
    const inputText = e.target.value;
    setSn(inputText);
  }

  const handleAreaSelect = (e) => {
    setArea(e.target.value);
  };

  const handleUptakeSelect = (e) => {
    setUptake(e.target.value);
  };

  const hSubmit = (event) => {
    event.preventDefault();

    onSubmit(column1, event.target.elements[0].value);
    onSubmit(column2, event.target.elements[1].value);
    onSubmit(column3, event.target.elements[2].value);
    onSubmit(column4, event.target.elements[3].value);
    onSubmit(column5, event.target.elements[4].value);
    onSubmit(column6, event.target.elements[5].value);
    onSubmit(column7, event.target.elements[6].value);
    onSubmit(column8, event.target.elements[7].value);
  };

  return (
    <form onSubmit={hSubmit}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <div><input className='underline' name={column1} placeholder='팀명' onChange={departmentHandler} value={department} /></div>
            <div><input className='underline' name={column2} placeholder='모델명' onChange={modelHandler} value={model} /></div>
            <div>
              <select className="selectItem" name={column3} onChange={handleUptakeSelect} value={uptake}>
                <option value="">― 상태 ―</option>
                <option value="사용">사용</option>
                <option value="미사용">미사용</option>
                <option value="매각대기">매각대기</option>
                <option value="매각">매각</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <div><input className='underline' name={column4} placeholder='사번' onChange={useridHandler} value={userid} /></div>
            <div><input className='underline' name={column5} placeholder='관리번호' onChange={idassetHandler} value={idasset} /></div>
            {/* <div><input className='underline' name={column6} placeholder='설치지역' onChange={areaHandler} value={area} /></div> */}
            <div>
              <select className="selectItem" name={column6} onChange={handleAreaSelect} value={area}>
                <option value="">― 설치지역 ―</option>
                <option value="남양">남양</option>
                <option value="마북">마북</option>
                <option value="의왕">의왕</option>
                <option value="광명">광명</option>
                <option value="화성">화성</option>
                <option value="광주">광주</option>
                <option value="전주">전주</option>
                <option value="울산">울산</option>
                <option value="아산">아산</option>
                <option value="본사">본사</option>
                <option value="대치">대치</option>
                <option value="삼성">삼성</option>
                <option value="판교">판교</option>
                <option value="원효로">원효로</option>
                <option value="대방">대방</option>
                <option value="기타">기타</option>
                
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <div><input className='underline' name={column7} placeholder='성명' onChange={usernameHandler} value={username} /></div>
            <div><input className='underline' name={column8} placeholder='S/N' onChange={snHandler} value={sn} /></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
          <button className="btnSearch">조회</button>
        </div>
      </div>
    </form>
  );
}