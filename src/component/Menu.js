import { Link, useLocation, useNavigate } from "react-router-dom";
import '../css/menu.css';
import { Button } from "@mui/material";
import "../css/foot.css";
import COMNPRO from "../comnpro_logo_white.png"

export default function Menu() {
    const USERNAME = localStorage.getItem('LOGIN_USERNAME');
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const logoutHandler = e => {
        // 로컬스토리지 데이터 제거
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('LOGIN_USERNAME');
        localStorage.removeItem('SEARCHTERM_PWS');
        localStorage.removeItem('SEARCHTERM_PROVISION');
        localStorage.removeItem('SEARCHTERM_RETURN');
        localStorage.removeItem('SEARCHTERM_DISPOSAL');
        navigate('/login', { state: { previousPath: pathname } });
    };
    const button = USERNAME
        ? (<div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '0.5rem', fontFamily: 'Verdana', fontSize: '0.75rem', fontStyle: 'oblique', color: 'lightslategray', backgroundColor: 'lightslategray', textShadow: '1px 1px 0 #eaeaea, -1px -1px 0 #232323' }}>
                {USERNAME}
            </div>
            <Button color="inherit" onClick={logoutHandler}><strong style={{ color: '#ffffff' }}>로그아웃</strong></Button>
        </div>)
        : (

            <Link to='/login' state={{ previousPath: pathname }} style={{ color: '#fff', marginRight: 20, textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>로그인</Link>

        );
    
    return (
        <>
            <div style={{ display: 'flex', backgroundColor: 'lightslategray', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottom: '2px solid' }}>
                <div style={{ width: '290px', fontSize: '1.2rem', fontWeight: '900', color: 'whitesmoke', fontStyle: 'oblique', textShadow: '2px 2px 3px black', marginLeft: '0.4rem' }}>PWS Asset Manager</div>
                <nav className="menu">

                    <ul className="menu-list">
                        <li className="menu-item">
                            <Link
                                to="/" state = {{ previousPath: pathname}}
                                className={`menu-link${location.pathname === '/' ? ' menu-link--active' : ''}`}
                            >
                                조회
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link
                                to="/provision" state = {{ previousPath: pathname}}
                                className={`menu-link${location.pathname === '/provision' ? ' menu-link--active' : ''}`}
                            >
                                지급
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link
                                to="/return" state = {{ previousPath: pathname}}
                                className={`menu-link${location.pathname === '/return' ? ' menu-link--active' : ''}`}
                            >
                                반납
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link
                                to="/disposal" state = {{ previousPath: pathname}}
                                className={`menu-link${location.pathname === '/disposal' ? ' menu-link--active' : ''}`}
                            >
                                매각
                            </Link>
                        </li>
                    </ul>

                </nav>
                <div style={{ whiteSpace: 'nowrap' }}>{button}</div>
            </div>
            <div className="foot-container" >
                <div className="company-foot"><img src={COMNPRO} alt="컴앤프로정보기술" width='37rem' />
                    <div style={{ fontSize: '0.7rem', margin: '0 0.8rem' }}>
                        <div>Com & Pro</div>
                        {/* <div>Information Technology</div> */}
                        <div>컴앤프로 정보기술(주)</div>
                    </div>
                </div>
            </div>
        </>
    );
}