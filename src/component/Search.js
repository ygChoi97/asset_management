import React, { useEffect, useRef, useState } from "react";
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

export function SearchPws({ column1, column2, column3, column4, column5, column6, column7, column8, column9, column10, column11, onSubmit, setFilterHeadquarters }) {

  const [department, setDepartment] = useState('');
  const [model, setModel] = useState('');
  const [uptake, setUptake] = useState('');
  const [userid, setUserid] = useState('');
  const [idasset, setIdasset] = useState('');
  const [area, setArea] = useState('');
  const [username, setUsername] = useState('');
  const [sn, setSn] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [headquartersOption, setHeadquartersOption] = useState("1");
  const [introductiondateSD, setIntroductiondateSD] = useState('');
  const [introductiondateED, setIntroductiondateED] = useState('');
  const [company, setCompany] = useState('');

  const btnRef = useRef(null);

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

  const headquartersOptionHandler = (e) => {
    setHeadquartersOption(e.target.value);
  };

  const introductiondateSDHandler = (e) => {
    setIntroductiondateSD(e.target.value);
  };

  const introductiondateEDHandler = (e) => {
    setIntroductiondateED(e.target.value);
  };

  const companySelectHandler = (e) => {
    setCompany(e.target.value);
  }

  const resetHandler = (event) => {
    setHeadquarters('');
    setHeadquartersOption('1');
    setDepartment('');
    setModel('');
    setUptake('');
    setUserid('');
    setIdasset('');
    setSn('');
    setArea('');
    setUsername('');
    setIntroductiondateSD('');
    setIntroductiondateED('');
    setCompany('');
  }
  
  const hSubmit = (event) => {
    event.preventDefault();

    setFilterHeadquarters(headquartersOption);

    onSubmit(column1, event.target.elements[0].value.trim());
    onSubmit(column2, event.target.elements[2].value.trim());
    onSubmit(column3, event.target.elements[3].value.trim());
    if (event.target.elements[4].value != '')
      onSubmit(column4, event.target.elements[4].value.trim());
    else
      onSubmit(column4, undefined);
    onSubmit(column5, event.target.elements[5].value.trim());
    onSubmit(column6, event.target.elements[6].value.trim());
    onSubmit(column7, event.target.elements[7].value.trim());
    if (event.target.elements[8].value != '')
      onSubmit(column8, event.target.elements[8].value.trim());
    else
      onSubmit(column8, undefined);
    onSubmit(column9, event.target.elements[9].value.trim());

    onSubmit(column10, (old = []) => [event.target.elements[11].value ? event.target.elements[11].value.trim() : undefined, old[1]]);
    onSubmit(column10, (old = []) => [event.target.elements[10].value ? event.target.elements[10].value.trim() : undefined, old[0]]);

    if (event.target.elements[12].value != '')
      onSubmit(column11, event.target.elements[12].value.trim());
    else
      onSubmit(column11, undefined);

    if (headquarters !== '' || department !== '' || model !== '' || uptake !== '' || userid !== '' || idasset !== '' ||
      sn !== '' || area !== '' || username !== '' || introductiondateSD !== '' || introductiondateED !== '' || company !== '') {
      const state = {
        headquarters: headquarters,
        headquartersOption: headquartersOption,
        department: department,
        model: model,
        uptake: uptake,
        userid: userid,
        idasset: idasset,
        sn: sn,
        area: area,
        username: username,
        introductiondateSD: introductiondateSD,
        introductiondateED: introductiondateED,
        company: company
      };
      // 상태값이 변경될 때마다 로컬 스토리지에 저장
      const stateString = JSON.stringify(state);
      console.log(state)
      localStorage.setItem('SEARCHTERM_PWS', stateString);
    }
    else {
      const term = localStorage.getItem("SEARCHTERM_PWS");
      if(term)
        localStorage.removeItem("SEARCHTERM_PWS");
    }

  };

  useEffect(() => {

    // 로컬 스토리지에서 'SEARCHTERM_PWS' 가져옴
    const stateString = localStorage.getItem('SEARCHTERM_PWS');
    // JSON 문자열을 JavaScript 객체로 변환
    if (stateString) {
      const state = JSON.parse(stateString);

      if (state.headquarters) setHeadquarters(state.headquarters);
      if (state.headquartersOption) setHeadquartersOption(state.headquartersOption);
      if (state.department) setDepartment(state.department);
      if (state.model) setModel(state.model);
      if (state.uptake) setUptake(state.uptake);

      if (state.userid) setUserid(state.userid);
      if (state.idasset) setIdasset(state.idasset);
      if (state.sn) setSn(state.sn);
      if (state.area) setArea(state.area);

      if (state.username) setUsername(state.username);
      if (state.introductiondateSD) setIntroductiondateSD(state.introductiondateSD);
      if (state.introductiondateED) setIntroductiondateED(state.introductiondateED);
      if (state.company) setCompany(state.company);

      if (btnRef.current) {
        console.log("rerendering 2sec")
        const timeoutId = setTimeout(() => {
          btnRef.current.click();
        }, 2000); // 2초 후에 클릭 이벤트 발생
        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  return (
    <form onSubmit={hSubmit} id="frmPws">

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '355px' }}>
              <div className="filterItem">
                <label htmlFor='headquarters'>본부</label>
                <input className='underline2' id='headquarters' name={column1} placeholder='' onChange={headquartersHandler} value={headquarters} />
              </div>
              <select className="selectOption" value={headquartersOption} onChange={headquartersOptionHandler}>
                <option value="0">포함</option>
                <option value="1">제외</option>
              </select>
            </div>


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
              <input className='selectDate' id='introductiondateSD' name={column10} placeholder='' type='date' onChange={introductiondateSDHandler} value={introductiondateSD} />
              <span>~</span>
              <input className='selectDate' id='introductiondateED' name={column10} placeholder='' type='date' onChange={introductiondateEDHandler} value={introductiondateED} />
            </div>
            <div className="filterItem"><label htmlFor='company'>회사</label>
              <select className="selectItem" id='company' name={column11} onChange={companySelectHandler} value={company}>
                <option value="">― 선택안함 ―</option>
                <option value="현대">현대</option>
                <option value="기아">기아</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btnSearch" type="submit" id="submitPwsBtn" ref={btnRef}>조회</button>
          <button className="btnReset" type="submit" onClick={resetHandler}>리셋</button>
        </div>
      </div>
    </form>
  );
};

export function SearchProvision({ column1, column2, column3, column4, column5, column6, column7, column8, onSubmit, setFilterHeadquarters }) {
  const [assetno, setAssetno] = useState('');
  const [department, setDepartment] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [headquartersOption, setHeadquartersOption] = useState("1");
  const [idasset, setIdasset] = useState('');
  const [sn, setSn] = useState('');
  const [areainstall, setAreainstall] = useState('');
  const [model, setModel] = useState('');
  const [provisiondateSD, setProvisiondateSD] = useState('');
  const [provisiondateED, setProvisiondateED] = useState('');

  const btnRef = useRef(null);

  const assetnoHandler = (e) => {
    setAssetno(e.target.value);
  }

  const departmentHandler = (e) => {
    setDepartment(e.target.value);
  }

  const headquartersHandler = (e) => {
    setHeadquarters(e.target.value);
  }

  const headquartersOptionHandler = (e) => {
    setHeadquartersOption(e.target.value);
  };

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

  const provisiondateSDHandler = (e) => {
    setProvisiondateSD(e.target.value);
  };

  const provisiondateEDHandler = (e) => {
    setProvisiondateED(e.target.value);
  };

  const resetHandler = (event) => {
    setAssetno('');
    setDepartment('');
    setHeadquarters('');
    setHeadquartersOption('1');
    setIdasset('');
    setSn('');
    setAreainstall('');
    setModel('');
    setProvisiondateSD('');
    setProvisiondateED('');
  }

  const hSubmit = (event) => {
    event.preventDefault();

    setFilterHeadquarters(headquartersOption);

    onSubmit(column1, event.target.elements[0].value.trim());
    onSubmit(column2, event.target.elements[1].value.trim());
    onSubmit(column3, event.target.elements[2].value.trim());
    onSubmit(column4, event.target.elements[4].value.trim());
    onSubmit(column5, event.target.elements[5].value.trim());
    if (event.target.elements[6].value != '')
      onSubmit(column6, event.target.elements[6].value.trim());
    else
      onSubmit(column6, undefined);
    onSubmit(column7, event.target.elements[7].value.trim());
    onSubmit(column8, (old = []) => [event.target.elements[9].value ? event.target.elements[9].value.trim() : undefined, old[1]]);
    onSubmit(column8, (old = []) => [event.target.elements[8].value ? event.target.elements[8].value.trim() : undefined, old[0]]);

    if (assetno !== '' || department !== '' || headquarters !== '' || idasset !== '' || sn !== '' || areainstall !== '' ||
      model !== '' || provisiondateSD !== '' || provisiondateED !== '') {
      const state = {
        assetno: assetno,
        department: department,
        headquarters: headquarters,
        headquartersOption: headquartersOption,
        idasset: idasset,
        sn: sn,
        areainstall: areainstall,
        model: model,
        provisiondateSD: provisiondateSD,
        provisiondateED: provisiondateED,
      };
      // 상태값이 변경될 때마다 로컬 스토리지에 저장
      const stateString = JSON.stringify(state);
      localStorage.setItem('SEARCHTERM_PROVISION', stateString);
    }
    else {
      const term = localStorage.getItem("SEARCHTERM_PROVISION");
      if(term)
        localStorage.removeItem("SEARCHTERM_PROVISION");
    }
  };

  useEffect(() => {

    // 로컬 스토리지에서 'SEARCHTERM_PROVISION' 가져옴
    const stateString = localStorage.getItem('SEARCHTERM_PROVISION');
    // JSON 문자열을 JavaScript 객체로 변환
    if (stateString) {
      const state = JSON.parse(stateString);
      
      if (state.assetno) setHeadquarters(state.assetno);
      if (state.department) setDepartment(state.department);
      if (state.headquarters) setHeadquarters(state.headquarters);
      if (state.headquartersOption) setHeadquartersOption(state.headquartersOption);
      if (state.idasset) setIdasset(state.idasset);
      if (state.sn) setSn(state.sn);
      if (state.areainstall) setAreainstall(state.areainstall);
      if (state.model) setModel(state.model);
      if (state.provisiondateSD) setProvisiondateSD(state.provisiondateSD);
      if (state.provisiondateED) setProvisiondateED(state.provisiondateED);

      if (btnRef.current) {
        const timeoutId = setTimeout(() => {
          btnRef.current.click();
        }, 2000); // 2초 후에 클릭 이벤트 발생
        return () => clearTimeout(timeoutId);
      }
    }   
  }, []);

  return (
    <form onSubmit={hSubmit}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div className="filterItem"><label htmlFor='assetno'>자산번호</label> <input className='underline' id='assetno' name={column1} placeholder='' onChange={assetnoHandler} value={assetno} /></div>
            <div className="filterItem"><label htmlFor='department'>부서명</label><input className='underline' id='department' name={column2} placeholder='' onChange={departmentHandler} value={department} /></div>
            
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '355px' }}>
              <div className="filterItem">
                <label htmlFor='headquarters'>본부</label>
                <input className='underline2' id='headquarters' name={column3} placeholder='' onChange={headquartersHandler} value={headquarters} />
              </div>
              <select className="selectOption" value={headquartersOption} onChange={headquartersOptionHandler}>
                <option value="0">포함</option>
                <option value="1">제외</option>
              </select>
            </div>
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
            <div className="filterItem"><label htmlFor='introductiondate'>지급일자</label>
              <input className='selectDate' id='provisiondateSD' name={column8} placeholder='' type='date' onChange={provisiondateSDHandler} value={provisiondateSD} />
              <span>~</span>
              <input className='selectDate' id='provisiondateED' name={column8} placeholder='' type='date' onChange={provisiondateEDHandler} value={provisiondateED} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btnSearch" type="submit" id="submitPwsBtn" ref={btnRef}>조회</button>
          <button className="btnReset" type="submit" onClick={resetHandler}>리셋</button>
        </div>
      </div>
    </form>
  );
}

export function SearchReturn({ column1, column2, column3, column4, column5, column6, column7, column8, column9, column10, onSubmit, setFilterHeadquarters }) {
  const [headquarters, setHeadquarters] = useState('');
  const [headquartersOption, setHeadquartersOption] = useState("1");
  const [assetno, setAssetno] = useState('');
  const [hoteam, setHoteam] = useState('');
  const [housername, setHousername] = useState('');
  const [idasset, setIdasset] = useState('');
  const [sn, setSn] = useState('');
  const [model, setModel] = useState('');
  const [area, setArea] = useState('');
  const [resigndateSD, setResigndateSD] = useState('');
  const [resigndateED, setResigndateED] = useState('');
  const [returndateSD, setReturndateSD] = useState('');
  const [returndateED, setReturndateED] = useState('');

  const btnRef = useRef(null);

  const headquartersHandler = (e) => {
    setHeadquarters(e.target.value);
  }

  const headquartersOptionHandler = (e) => {
    setHeadquartersOption(e.target.value);
  };

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

  const areaSelectHandler = (e) => {
    setArea(e.target.value);
  }

  const resigndateSDHandler = (e) => {
    setResigndateSD(e.target.value);
  }

  const resigndateEDHandler = (e) => {
    setResigndateED(e.target.value);
  }

  const returndateSDHandler = (e) => {
    setReturndateSD(e.target.value);
  }

  const returndateEDHandler = (e) => {
    setReturndateED(e.target.value);
  }

  const resetHandler = (event) => {
    setHeadquarters('');
    setHeadquartersOption('1');
    setAssetno('');
    setHoteam('');
    setHousername('');
    setIdasset('');
    setSn(''); 
    setModel('');
    setArea('');
    setResigndateSD('');
    setResigndateED('');
    setReturndateSD('');
    setReturndateED('');
  }

  const hSubmit = (event) => {
    event.preventDefault();

    setFilterHeadquarters(headquartersOption);

    onSubmit(column1, event.target.elements[0].value.trim());
    onSubmit(column2, event.target.elements[2].value.trim());
    onSubmit(column3, event.target.elements[3].value.trim());
    onSubmit(column4, event.target.elements[4].value.trim());
    onSubmit(column5, event.target.elements[5].value.trim());
    onSubmit(column6, event.target.elements[6].value.trim());
    onSubmit(column7, event.target.elements[7].value.trim());
    onSubmit(column8, event.target.elements[8].value.trim());
    onSubmit(column9, (old = []) => [event.target.elements[10].value ? event.target.elements[10].value.trim() : undefined, old[1]]);
    onSubmit(column9, (old = []) => [event.target.elements[9].value ? event.target.elements[9].value.trim() : undefined, old[0]]);
    onSubmit(column10, (old = []) => [event.target.elements[12].value ? event.target.elements[12].value.trim() : undefined, old[1]]);
    onSubmit(column10, (old = []) => [event.target.elements[11].value ? event.target.elements[11].value.trim() : undefined, old[0]]);

    if (headquarters !== '' || assetno !== '' || hoteam !== '' || housername !== '' || idasset !== '' || sn !== '' || model !== '' || area !== '' ||
        resigndateSD !== '' || resigndateED !== '' || returndateSD !== '' || returndateED !== '') {
      const state = {
        headquarters: headquarters,
        headquartersOption: headquartersOption,
        assetno: assetno,
        hoteam: hoteam,
        housername: housername,
        idasset: idasset,
        sn: sn,
        model: model,
        area: area,
        resigndateSD: resigndateSD,
        resigndateED: resigndateED,
        returndateSD: returndateSD,
        returndateED: returndateED,
      };
      // 상태값이 변경될 때마다 로컬 스토리지에 저장
      const stateString = JSON.stringify(state);
      localStorage.setItem('SEARCHTERM_RETURN', stateString);
    }
    else {
      const term = localStorage.getItem("SEARCHTERM_RETURN");
      if(term)
        localStorage.removeItem("SEARCHTERM_RETURN");
    }
  };

  useEffect(() => {

    // 로컬 스토리지에서 'SEARCHTERM_RETURN' 가져옴
    const stateString = localStorage.getItem('SEARCHTERM_RETURN');
    // JSON 문자열을 JavaScript 객체로 변환

    console.log(stateString)
    if (stateString) {
      const state = JSON.parse(stateString);

      if (state.headquarters) setHeadquarters(state.headquarters);
      if (state.headquartersOption) setHeadquartersOption(state.headquartersOption);
      if (state.assetno) setAssetno(state.assetno);
      if (state.hoteam) setHoteam(state.hoteam);
      if (state.housername) setHousername(state.housername);
      if (state.idasset) setIdasset(state.idasset);
      if (state.sn) setSn(state.sn);
      if (state.model) setModel(state.model);
      if (state.area) setArea(state.area);   
      if (state.resigndateSD) setResigndateSD(state.resigndateSD);
      if (state.resigndateED) setResigndateED(state.resigndateED);
      if (state.returndateSD) setReturndateSD(state.returndateSD);
      if (state.returndateED) setReturndateED(state.returndateED);

      if (btnRef.current) {
        const timeoutId = setTimeout(() => {
          btnRef.current.click();
        }, 2000); // 2초 후에 클릭 이벤트 발생
        return () => clearTimeout(timeoutId);
      }
    }   
  }, []);

  return (
    <form onSubmit={hSubmit}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '355px' }}>
              <div className="filterItem">
                <label htmlFor='headquarters'>본부</label>
                <input className='underline2' id='headquarters' name={column1} placeholder='' onChange={headquartersHandler} value={headquarters} />
              </div>
              <select className="selectOption" value={headquartersOption} onChange={headquartersOptionHandler}>
                <option value="0">포함</option>
                <option value="1">제외</option>
              </select>
            </div>
            <div className="filterItem"><label htmlFor='assetno'>자산번호</label> <input className='underline' id='assetno' name={column2} placeholder='' onChange={assetnoHandler} value={assetno} /></div>
            <div className="filterItem"><label htmlFor='hoteam'>인계팀</label><input className='underline' id='hoteam' name={column3} placeholder='' onChange={hoteamHandler} value={hoteam} /></div>
            <div className="filterItem"><label htmlFor='housername'>인계자</label><input className='underline' id='housername' name={column4} placeholder='' onChange={housernameHandler} value={housername} /></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <div className="filterItem"><label htmlFor='idasset'>자산관리번호</label><input className='underline' id='idasset' name={column5} placeholder='' onChange={idassetHandler} value={idasset} /></div>
            <div className="filterItem"><label htmlFor='sn'>S/N</label><input className='underline' id='sn' name={column6} placeholder='' onChange={snHandler} value={sn} /></div>
            <div className="filterItem"><label htmlFor='model'>모델</label><input className='underline' id='model' name={column7} placeholder='' onChange={modelHandler} value={model} /></div>
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
            <div className="filterItem"><label htmlFor='introductiondate'>퇴직일자</label>
              <input className='selectDate' id='resigndateSD' name={column9} placeholder='' type='date' onChange={resigndateSDHandler} value={resigndateSD} />
              <span>~</span>
              <input className='selectDate' id='resigndateED' name={column9} placeholder='' type='date' onChange={resigndateEDHandler} value={resigndateED} />
            </div>
            <div className="filterItem"><label htmlFor='introductiondate'>반납일자</label>
              <input className='selectDate' id='returndateSD' name={column10} placeholder='' type='date' onChange={returndateSDHandler} value={returndateSD} />
              <span>~</span>
              <input className='selectDate' id='returndateED' name={column10} placeholder='' type='date' onChange={returndateEDHandler} value={returndateED} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btnSearch" type="submit" id="submitPwsBtn" ref={btnRef}>조회</button>
          <button className="btnReset" type="submit" onClick={resetHandler}>리셋</button>
        </div>
      </div>
    </form>
  );
}

export function SearchPwsDisposal({ column1, column2, column3, column4, column5, column6, column7, column8, column9, column10, column11, onSubmit, setFilterHeadquarters }) {

  const [department, setDepartment] = useState('');
  const [model, setModel] = useState('');
  const [uptake, setUptake] = useState('');
  const [userid, setUserid] = useState('');
  const [idasset, setIdasset] = useState('');
  const [area, setArea] = useState('');
  const [username, setUsername] = useState('');
  const [sn, setSn] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [headquartersOption, setHeadquartersOption] = useState("1");
  const [introductiondateSD, setIntroductiondateSD] = useState('');
  const [introductiondateED, setIntroductiondateED] = useState('');
  const [company, setCompany] = useState('');

  const btnRef = useRef(null);

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

  const headquartersOptionHandler = (e) => {
    setHeadquartersOption(e.target.value);
  };

  const introductiondateSDHandler = (e) => {
    setIntroductiondateSD(e.target.value);
  };

  const introductiondateEDHandler = (e) => {
    setIntroductiondateED(e.target.value);
  };

  const companySelectHandler = (e) => {
    setCompany(e.target.value);
  }

  const resetHandler = (event) => {
    setHeadquarters('');
    setHeadquartersOption('1');
    setDepartment('');
    setModel('');
    setUptake('');
    setUserid('');
    setIdasset('');
    setSn('');
    setArea('');
    setUsername('');
    setIntroductiondateSD('');
    setIntroductiondateED('');
    setCompany('');
  }
  
  const hSubmit = (event) => {
    event.preventDefault();

    setFilterHeadquarters(headquartersOption);

    onSubmit(column1, event.target.elements[0].value.trim());
    onSubmit(column2, event.target.elements[2].value.trim());
    onSubmit(column3, event.target.elements[3].value.trim());
    if (event.target.elements[4].value != '')
      onSubmit(column4, event.target.elements[4].value.trim());
    else
      onSubmit(column4, undefined);
    onSubmit(column5, event.target.elements[5].value.trim());
    onSubmit(column6, event.target.elements[6].value.trim());
    onSubmit(column7, event.target.elements[7].value.trim());
    if (event.target.elements[8].value != '')
      onSubmit(column8, event.target.elements[8].value.trim());
    else
      onSubmit(column8, undefined);
    onSubmit(column9, event.target.elements[9].value.trim());

    onSubmit(column10, (old = []) => [event.target.elements[11].value ? event.target.elements[11].value.trim() : undefined, old[1]]);
    onSubmit(column10, (old = []) => [event.target.elements[10].value ? event.target.elements[10].value.trim() : undefined, old[0]]);

    if (event.target.elements[12].value != '')
      onSubmit(column11, event.target.elements[12].value.trim());
    else
      onSubmit(column11, undefined);

    if (headquarters !== '' || department !== '' || model !== '' || uptake !== '' || userid !== '' || idasset !== '' ||
      sn !== '' || area !== '' || username !== '' || introductiondateSD !== '' || introductiondateED !== '' || company !== '') {
      const state = {
        headquarters: headquarters,
        headquartersOption: headquartersOption,
        department: department,
        model: model,
        uptake: uptake,
        userid: userid,
        idasset: idasset,
        sn: sn,
        area: area,
        username: username,
        introductiondateSD: introductiondateSD,
        introductiondateED: introductiondateED,
        company: company
      };
      // 상태값이 변경될 때마다 로컬 스토리지에 저장
      const stateString = JSON.stringify(state);
      console.log(state)
      localStorage.setItem('SEARCHTERM_DISPOSAL', stateString);
    }
    else {
      const term = localStorage.getItem("SEARCHTERM_DISPOSAL");
      if(term)
        localStorage.removeItem("SEARCHTERM_DISPOSAL");
    }

  };

  useEffect(() => {

    // 로컬 스토리지에서 'SEARCHTERM_DISPOSAL' 가져옴
    const stateString = localStorage.getItem('SEARCHTERM_DISPOSAL');
    // JSON 문자열을 JavaScript 객체로 변환
    if (stateString) {
      const state = JSON.parse(stateString);

      if (state.headquarters) setHeadquarters(state.headquarters);
      if (state.headquartersOption) setHeadquartersOption(state.headquartersOption);
      if (state.department) setDepartment(state.department);
      if (state.model) setModel(state.model);
      if (state.uptake) setUptake(state.uptake);

      if (state.userid) setUserid(state.userid);
      if (state.idasset) setIdasset(state.idasset);
      if (state.sn) setSn(state.sn);
      if (state.area) setArea(state.area);

      if (state.username) setUsername(state.username);
      if (state.introductiondateSD) setIntroductiondateSD(state.introductiondateSD);
      if (state.introductiondateED) setIntroductiondateED(state.introductiondateED);
      if (state.company) setCompany(state.company);

      if (btnRef.current) {
        console.log("rerendering 2sec")
        const timeoutId = setTimeout(() => {
          btnRef.current.click();
        }, 2000); // 2초 후에 클릭 이벤트 발생
        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  return (
    <form onSubmit={hSubmit} id="frmPws">

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '355px' }}>
              <div className="filterItem">
                <label htmlFor='headquarters'>본부</label>
                <input className='underline2' id='headquarters' name={column1} placeholder='' onChange={headquartersHandler} value={headquarters} />
              </div>
              <select className="selectOption" value={headquartersOption} onChange={headquartersOptionHandler}>
                <option value="0">포함</option>
                <option value="1">제외</option>
              </select>
            </div>


            <div className="filterItem"><label htmlFor='department'>관리부서 </label><input className='underline' id='department' name={column2} placeholder='' onChange={departmentHandler} value={department} /></div>
            <div className="filterItem"><label htmlFor='model'>모델명</label><input className='underline' id='model' name={column3} placeholder='' onChange={modelHandler} value={model} /></div>
            <div className="filterItem"><label htmlFor='uptake'>사용구분</label>
              <select className="selectItem" id='uptake' name={column4} onChange={uptakeSelectHandler} value={uptake}>
                <option value="">― 선택안함 ―</option>
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
              <input className='selectDate' id='introductiondateSD' name={column10} placeholder='' type='date' onChange={introductiondateSDHandler} value={introductiondateSD} />
              <span>~</span>
              <input className='selectDate' id='introductiondateED' name={column10} placeholder='' type='date' onChange={introductiondateEDHandler} value={introductiondateED} />
            </div>
            <div className="filterItem"><label htmlFor='company'>회사</label>
              <select className="selectItem" id='company' name={column11} onChange={companySelectHandler} value={company}>
                <option value="">― 선택안함 ―</option>
                <option value="현대">현대</option>
                <option value="기아">기아</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btnSearch" type="submit" id="submitPwsBtn" ref={btnRef}>조회</button>
          <button className="btnReset" type="submit" onClick={resetHandler}>리셋</button>
        </div>
      </div>
    </form>
  );
}