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

export function SearchPws({ column1, column2, column3, column4, column5, column6, column7, column8, column9, column10, onSubmit }) {
  const [department, setDepartment] = useState('');
  const [model, setModel] = useState('');
  const [uptake, setUptake] = useState('');

  const [userid, setUserid] = useState('');
  const [idasset, setIdasset] = useState('');
  const [area, setArea] = useState('');

  const [username, setUsername] = useState('');
  const [sn, setSn] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  
  const [introductiondateSD, setIntroductiondateSD] = useState('');
  const [introductiondateED, setIntroductiondateED] = useState('');

  const departmentHandler = (e) => {
    setDepartment(e.target.value);
  }

  const modelHandler = (e) => {
    setModel(e.target.value);
  }

  const useridHandler = (e) => {
    setUserid(e.target.value);
  }

  const idassetHandler = (e) => {
    setIdasset(e.target.value);
  }

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  }

  const snHandler = (e) => {
    setSn(e.target.value);
  }

  function areaSelectHandler(e) {
    setArea(e.target.value);
  }

  const uptakeSelectHandler = (e) => {
    setUptake(e.target.value);
  };

  const headquartersHandler = (e) => {
    setHeadquarters(e.target.value);
  };

  const introductiondateSDHandler = (e) => {
    setIntroductiondateSD(e.target.value);
  };

  const introductiondateEDHandler = (e) => {
    setIntroductiondateED(e.target.value);
  };
  
  const hSubmit = (event) => {
      event.preventDefault();
    
      onSubmit(column1, event.target.elements[0].value);
      onSubmit(column2, event.target.elements[1].value);
      onSubmit(column3, event.target.elements[2].value);
      if(event.target.elements[3].value != '') 
        onSubmit(column4, event.target.elements[3].value);
      else
        onSubmit(column4, undefined);
      onSubmit(column5, event.target.elements[4].value);
      onSubmit(column6, event.target.elements[5].value);
      onSubmit(column7, event.target.elements[6].value);
      if(event.target.elements[7].value != '') 
        onSubmit(column8, event.target.elements[7].value);
      else
        onSubmit(column8, undefined);
      onSubmit(column9, event.target.elements[8].value);

      onSubmit(column10, (old = []) => [event.target.elements[10].value ? event.target.elements[10].value : undefined, old[1]]);
      onSubmit(column10, (old = []) => [event.target.elements[9].value ? event.target.elements[9].value : undefined, old[0]]);
    };
  
    return (
      <form onSubmit={hSubmit}>
  
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='headquarters'>본부</label><input className='underline' id='headquarters' name={column1} placeholder='' onChange={headquartersHandler} value={headquarters} /></div>
              <div className="filterItem"><label htmlFor='department'>관리부서 </label><input className='underline' id='department' name={column2} placeholder='' onChange={departmentHandler} value={department} /></div>
              <div className="filterItem"><label htmlFor='model'>모델명</label><input className='underline' id='model' name={column3} placeholder='' onChange={modelHandler} value={model} /></div>
              <div className="filterItem"><label htmlFor='uptake'>사용구분</label>
                <select className="selectItem" id='uptake' name={column4} onChange={uptakeSelectHandler} value={uptake}>
                  <option value="">― 선택안함 ―</option>
                  <option value="사용">사용</option>
                  <option value="미사용">미사용</option>
                  <option value="매각대기">매각대기</option>
                  <option value="매각">매각</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='userid'>사용자ID</label><input className='underline' id='userid' name={column5} placeholder='' onChange={useridHandler} value={userid} /></div>
              <div className="filterItem"><label htmlFor='idasset'>자산관리번호</label><input className='underline' id='idasset' name={column6} placeholder='' onChange={idassetHandler} value={idasset} /></div>
              <div className="filterItem"><label htmlFor='sn'>S/N</label><input className='underline' id='sn' name={column7} placeholder='' onChange={snHandler} value={sn} /></div>
              <div className="filterItem"><label htmlFor='area'>지역</label>
                <select className="selectItem" id='area' name={column8} onChange={areaSelectHandler} value={area}>
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
              <div className="filterItem"><label htmlFor='username'>사용자</label><input className='underline' id='username' name={column9} placeholder='' onChange={usernameHandler} value={username} /></div>
              <div className="filterItem"><label htmlFor='introductiondate'>도입년월</label>
                <input className='selectDate' id='introductiondateED' name={column10} placeholder='' type='date' onChange={introductiondateEDHandler} value={introductiondateED} />
                <span>~</span>
                <input className='selectDate' id='introductiondateSD' name={column10} placeholder='' type='date' onChange={introductiondateSDHandler} value={introductiondateSD} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      setAssetno(e.target.value);
    }

    const departmentHandler = (e) => {
      setDepartment(e.target.value);
    }
    
    const headquartersHandler = (e) => {
      setHeadquarters(e.target.value);
    }

    const idassetHandler = (e) => {
      setIdasset(e.target.value);
    }

    const snHandler = (e) => {
      setSn(e.target.value);
    }

    const areainstallHandler = (e) => {
      setAreainstall(e.target.value);
    }

    const modelHandler = (e) => {
      setModel(e.target.value);
    }
  
    const provisiondateHandler = (e) => {
      setProvisiondate(e.target.value);
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      setAssetno(e.target.value);
    }

    const hoteamHandler = (e) => {
      setHoteam(e.target.value);
    }
    
    const housernameHandler = (e) => {
      setHousername(e.target.value);
    }

    const idassetHandler = (e) => {
      setIdasset(e.target.value);
    }

    const snHandler = (e) => {
      setSn(e.target.value);
    }

    const modelHandler = (e) => {
      setModel(e.target.value);
    }

    const resigndateHandler = (e) => {
      setResigndate(e.target.value);
    }

    const returndateHandler = (e) => {
      setReturndate(e.target.value);
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btnSearch">조회</button>
          </div>
        </div>
      </form>
    );
  }

  export function SearchPwsDisposal({ column1, column2, column3, column4, column5, column6, column7, column8, column9, onSubmit }) {
    const [department, setDepartment] = useState('');
    const [model, setModel] = useState('');
    const [uptake, setUptake] = useState('');
  
    const [userid, setUserid] = useState('');
    const [idasset, setIdasset] = useState('');
    const [area, setArea] = useState('');
  
    const [username, setUsername] = useState('');
    const [sn, setSn] = useState('');
    const [headquarters, setHeadquarters] = useState('');

    const departmentHandler = (e) => {
      const inputText = e.target.value;
      setDepartment(inputText);
    }
  
    const modelHandler = (e) => {
      setModel(e.target.value);
    }
  
    const useridHandler = (e) => {
      setUserid(e.target.value);
    }
  
    const idassetHandler = (e) => {
      setIdasset(e.target.value);
    }
  
    const usernameHandler = (e) => {
      setUsername(e.target.value);
    }
  
    const snHandler = (e) => {
      setSn(e.target.value);
    }
  
    const areaSelectHandler = (e) => {
      setArea(e.target.value);
    };
  
    const uptakeSelectHandler = (e) => {
      setUptake(e.target.value);
    };

    const headquartersHandler = (e) => {
      setHeadquarters(e.target.value);
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
      onSubmit(column9, event.target.elements[8].value);
      console.log(event.target.elements[2]);
    };
  
    return (
      <form onSubmit={hSubmit}>
  
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='department'>관리부서 </label><input className='underline' id='department' name={column1} placeholder='' onChange={departmentHandler} value={department} /></div>
              <div className="filterItem"><label htmlFor='model'>모델명</label><input className='underline' id='model' name={column2} placeholder='' onChange={modelHandler} value={model} /></div>
              <div className="filterItem"><label htmlFor='uptake'>사용구분</label>
                <select className="selectItem" id='uptake' name={column3} onChange={uptakeSelectHandler} value={uptake}>
                  <option value="">― 선택안함 ―</option>
                  <option value="매각대기">매각대기</option>
                  <option value="매각">매각</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="filterItem"><label htmlFor='userid'>사용자ID</label><input className='underline' id='userid' name={column4} placeholder='' onChange={useridHandler} value={userid} /></div>
              <div className="filterItem"><label htmlFor='idasset'>자산관리번호</label><input className='underline' id='idasset' name={column5} placeholder='' onChange={idassetHandler} value={idasset} /></div>
              <div className="filterItem"><label htmlFor='area'>지역</label>
                <select className="selectItem" id='area' name={column6} onChange={areaSelectHandler} value={area}>
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
              <div className="filterItem"><label htmlFor='username'>사용자</label><input className='underline' id='username' name={column7} placeholder='' onChange={usernameHandler} value={username} /></div>
              <div className="filterItem"><label htmlFor='sn'>S/N</label><input className='underline' id='sn' name={column8} placeholder='' onChange={snHandler} value={sn} /></div>
              <div className="filterItem"><label htmlFor='headquarters'>본부</label><input className='underline' id='headquarters' name={column9} placeholder='' onChange={headquartersHandler} value={headquarters} /></div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btnSearch">조회</button>
          </div>
        </div>
      </form>
    );
  }