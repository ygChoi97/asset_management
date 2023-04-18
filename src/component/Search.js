import React, { useState } from "react";
import '../css/search.css';

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

export function SearchPws({ column1, column2, column3, column4, column5, column6, column7, column8, onSubmit }) {
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
      if(event.target.elements[2].value != '') 
        onSubmit(column3, event.target.elements[2].value);
      else
        onSubmit(column3, undefined);
      onSubmit(column4, event.target.elements[3].value);
      onSubmit(column5, event.target.elements[4].value);
      if(event.target.elements[5].value != '') 
        onSubmit(column6, event.target.elements[5].value);
      else
        onSubmit(column6, undefined);
      onSubmit(column7, event.target.elements[6].value);
      onSubmit(column8, event.target.elements[7].value);
  };

  return (
    <form onSubmit={hSubmit}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <div className="filterItem"><label htmlFor='department'>팀명 </label><input className='underline' id='department' name={column1} placeholder='' onChange={departmentHandler} value={department} /></div>
            <div className="filterItem"><label htmlFor='model'>모델명</label><input className='underline' id='model' name={column2} placeholder='' onChange={modelHandler} value={model} /></div>
            <div className="filterItem"><label htmlFor='uptake'>상태</label>
              <select className="selectItem" id='uptake' name={column3} onChange={handleUptakeSelect} value={uptake}>
                <option value="">― 선택안함 ―</option>
                <option value="사용">사용</option>
                <option value="미사용">미사용</option>
                <option value="매각대기">매각대기</option>
                <option value="매각">매각</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <div className="filterItem"><label htmlFor='userid'>사번</label><input className='underline' id='userid' name={column4} placeholder='' onChange={useridHandler} value={userid} /></div>
            <div className="filterItem"><label htmlFor='idasset'>자산관리번호</label><input className='underline' id='idasset' name={column5} placeholder='' onChange={idassetHandler} value={idasset} /></div>
            <div className="filterItem"><label htmlFor='area'>설치지역</label>
              <select className="selectItem" id='area' name={column6} onChange={handleAreaSelect} value={area}>
                <option value="">― 선택안함 ―</option>
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
            <div className="filterItem"><label htmlFor='username'>성명</label><input className='underline' id='username' name={column7} placeholder='' onChange={usernameHandler} value={username} /></div>
            <div className="filterItem"><label htmlFor='snHandler'>S/N</label><input className='underline' id='snHandler' name={column8} placeholder='' onChange={snHandler} value={sn} /></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
          <button className="btnSearch">조회</button>
        </div>
      </div>
    </form>
  );
}

  export function SearchProvision({ column1, column2, column3, column4, column5, column6, column7, column8, onSubmit }) {
    const [assetno, setAssetno] = useState('');
    const [department, setDepartment] = useState('');
    const [headquarters, setHeadquarters] = useState('');
    const [idasset, setIdasset] = useState('');
    const [sn, setSn] = useState('');
    const [areainstall, setAreainstall] = useState('');
    const [model, setModel] = useState('');
    const [provisiondate, setProvisiondate] = useState('');
    
    const assetnoHandler = (e) => {
      const inputText = e.target.value;
      setAssetno(inputText);
    }

    const departmentHandler = (e) => {
      const inputText = e.target.value;
      setDepartment(inputText);
    }
    
    const headquartersHandler = (e) => {
      const inputText = e.target.value;
      setHeadquarters(inputText);
    }

    const idassetHandler = (e) => {
      const inputText = e.target.value;
      setIdasset(inputText);
    }

    const snHandler = (e) => {
      const inputText = e.target.value;
      setSn(inputText);
    }

    const areainstallHandler = (e) => {
      const inputText = e.target.value;
      setAreainstall(inputText);
    }

    const modelHandler = (e) => {
      const inputText = e.target.value;
      setModel(inputText);
    }
  
    const provisiondateHandler = (e) => {
      const inputText = e.target.value;
      setProvisiondate(inputText);
    }
  
    const hSubmit = (event) => {
      event.preventDefault();
  
      onSubmit(column1, event.target.elements[0].value);
      onSubmit(column2, event.target.elements[1].value);
      onSubmit(column3, event.target.elements[2].value);
      onSubmit(column4, event.target.elements[3].value);
      onSubmit(column5, event.target.elements[4].value);
      if(event.target.elements[5].value != '') 
        onSubmit(column6, event.target.elements[5].value);
      else
        onSubmit(column6, undefined);
      onSubmit(column7, event.target.elements[6].value);
      onSubmit(column8, event.target.elements[7].value);
    };
  
    return (
      <form onSubmit={hSubmit}>
  
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div className="filterItem"><label htmlFor='assetno'>자산번호</label> <input className='underline' id='assetno' name={column1} placeholder='' onChange={assetnoHandler} value={assetno} /></div>
              <div className="filterItem"><label htmlFor='department'>부서명</label><input className='underline' id='department' name={column2} placeholder='' onChange={departmentHandler} value={department} /></div>
              <div className="filterItem"><label htmlFor='headquarters'>본부</label><input className='underline' id='headquarters' name={column3} placeholder='' onChange={headquartersHandler} value={headquarters} /></div>          
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div className="filterItem"><label htmlFor='idasset'>자산관리번호</label><input className='underline' id='idasset' name={column4} placeholder='' onChange={idassetHandler} value={idasset} /></div>
              <div className="filterItem"><label htmlFor='sn'>S/N</label><input className='underline' id='sn' name={column5} placeholder='' onChange={snHandler} value={sn} /></div>
              <div className="filterItem"><label htmlFor='areainstall'>설치지역</label>
                <select className="selectItem" id='areainstall' name={column6} onChange={areainstallHandler} value={areainstall}>
                  <option value="">― 선택안함 ―</option>
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
              <div className="filterItem"><label htmlFor='model'>모델</label><input className='underline' id='model' name={column7} placeholder='' onChange={modelHandler} value={model} /></div>
              <div className="filterItem"><label htmlFor='provisiondate'>지급일</label><input className='underline' id='provisiondate' name={column8} placeholder='' type='date' onChange={provisiondateHandler} value={provisiondate} /></div> 
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
            <button className="btnSearch">조회</button>
          </div>
        </div>
      </form>
    );
  }

  export function SearchReturn({ column1, column2, column3, column4, column5, column6, column7, column8, onSubmit }) {
    const [assetno, setAssetno] = useState('');
    const [hoteam, setHoteam] = useState('');
    const [housername, setHousername] = useState('');
    const [idasset, setIdasset] = useState('');
    const [sn, setSn] = useState('');
    const [model, setModel] = useState('');
    const [resigndate, setResigndate] = useState('');
    const [returndate, setReturndate] = useState('');
    
    const assetnoHandler = (e) => {
      const inputText = e.target.value;
      setAssetno(inputText);
    }

    const hoteamHandler = (e) => {
      const inputText = e.target.value;
      setHoteam(inputText);
    }
    
    const housernameHandler = (e) => {
      const inputText = e.target.value;
      setHousername(inputText);
    }

    const idassetHandler = (e) => {
      const inputText = e.target.value;
      setIdasset(inputText);
    }

    const snHandler = (e) => {
      const inputText = e.target.value;
      setSn(inputText);
    }

    const modelHandler = (e) => {
      const inputText = e.target.value;
      setModel(inputText);
    }

    const resigndateHandler = (e) => {
      const inputText = e.target.value;
      setResigndate(inputText);
    }

    const returndateHandler = (e) => {
      const inputText = e.target.value;
      setReturndate(inputText);
    }
  
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
              <div className="filterItem"><label htmlFor='assetno'>자산번호</label> <input className='underline' id='assetno' name={column1} placeholder='' onChange={assetnoHandler} value={assetno} /></div>
              <div className="filterItem"><label htmlFor='hoteam'>인계팀</label><input className='underline'id='hoteam' name={column2} placeholder='' onChange={hoteamHandler} value={hoteam} /></div>
              <div className="filterItem"><label htmlFor='housername'>인계자</label><input className='underline' id='housername' name={column3} placeholder='' onChange={housernameHandler} value={housername} /></div>          
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='idasset'>자산관리번호</label><input className='underline' id='idasset' name={column4} placeholder='' onChange={idassetHandler} value={idasset} /></div>
              <div className="filterItem"><label htmlFor='sn'>S/N</label><input className='underline' id='sn' name={column5} placeholder='' onChange={snHandler} value={sn} /></div>
              <div className="filterItem"><label htmlFor='model'>모델</label><input className='underline' id='model' name={column7} placeholder='' onChange={modelHandler} value={model} /></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='resigndate'>퇴직일</label><input className='underline' id='resigndate' name={column8} placeholder='' type='date' onChange={resigndateHandler} value={resigndate} /></div> 
              <div className="filterItem"><label htmlFor='returndate'>반납일자</label><input className='underline' id='returndate' name={column8} placeholder='' type='date' onChange={returndateHandler} value={returndate} /></div> 
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
            <button className="btnSearch">조회</button>
          </div>
        </div>
      </form>
    );
  }

  export function SearchPwsDisposal({ column1, column2, column3, column4, column5, column6, column7, column8, onSubmit }) {
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
      if(event.target.elements[2].value != '') 
        onSubmit(column3, event.target.elements[2].value);
      else
        onSubmit(column3, undefined);
      onSubmit(column4, event.target.elements[3].value);
      onSubmit(column5, event.target.elements[4].value);
      if(event.target.elements[5].value != '') 
        onSubmit(column6, event.target.elements[5].value);
      else
        onSubmit(column6, undefined);
      onSubmit(column7, event.target.elements[6].value);
      onSubmit(column8, event.target.elements[7].value);

      console.log(event.target.elements[2]);
    };
  
    return (
      <form onSubmit={hSubmit}>
  
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='department'>팀명 </label><input className='underline' id='department' name={column1} placeholder='' onChange={departmentHandler} value={department} /></div>
              <div className="filterItem"><label htmlFor='model'>모델명</label><input className='underline' id='model' name={column2} placeholder='' onChange={modelHandler} value={model} /></div>
              <div className="filterItem"><label htmlFor='uptake'>상태</label>
                <select className="selectItem" id='uptake' name={column3} onChange={handleUptakeSelect} value={uptake}>
                  <option value="">― 선택안함 ―</option>
                  <option value="매각대기">매각대기</option>
                  <option value="매각">매각</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='userid'>사번</label><input className='underline' id='userid' name={column4} placeholder='' onChange={useridHandler} value={userid} /></div>
              <div className="filterItem"><label htmlFor='idasset'>자산관리번호</label><input className='underline' id='idasset' name={column5} placeholder='' onChange={idassetHandler} value={idasset} /></div>
              <div className="filterItem"><label htmlFor='area'>설치지역</label>
                <select className="selectItem" id='area' name={column6} onChange={handleAreaSelect} value={area}>
                  <option value="">― 선택안함 ―</option>
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
              <div className="filterItem"><label htmlFor='username'>성명</label><input className='underline' id='username' name={column7} placeholder='' onChange={usernameHandler} value={username} /></div>
              <div className="filterItem"><label htmlFor='snHandler'>S/N</label><input className='underline' id='snHandler' name={column8} placeholder='' onChange={snHandler} value={sn} /></div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
            <button className="btnSearch">조회</button>
          </div>
        </div>
      </form>
    );
  }