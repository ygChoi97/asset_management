import {React, useEffect} from "react";
import {Grid, Button, Container, Typography, TextField} from "@mui/material";

const API_BASE_URL = 'http://localhost:8181';

const Login = () => {

    // 로그인 서브밋 이벤트 핸들러
    const submitHandler = e => {

        // html태그가 가진 기본 기능 없애기
        e.preventDefault();

        // 1. 이메일 입력란, 패스워드 입력란에 있는 데이터를 얻어온다.

        // 이메일 입력값
        const $userid = document.getElementById('userid');
        // console.log($userid.value);

        // 패스워드 입력값
        const $password = document.getElementById('password');
        // console.log($password.value);

        // 서버에 로그인 요청
        fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                userid : $userid.value,
                password: $password.value
            })
        })
        .then(res => {
            console.log('res code:', res.status);
            return res.json();
        })
        .then(loginUserData => {
            console.log(loginUserData);
            if (loginUserData.message) {
                // console.log('로그인 실패');
                alert(loginUserData.message);
            } else {
                // console.log('로그인 성공');

                // 로그인 성공시 받은 토큰을 로컬 스토리지에 저장
                localStorage.setItem('ACCESS_TOKEN', loginUserData.token);
                localStorage.setItem('LOGIN_USERNAME', loginUserData.username);

                window.location.href = '/';
            }
        })
        // 서버가 200번이아닌 오류코드를 보낼경우 실행할 코드
        .catch(err => {
            console.log('err:', err.message);
            alert(`Error message : ${err.message}\n\n서버 점검이 필요합니다.`);

        })
    };
    
    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "200px" }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                </Grid>
            </Grid>
            <form noValidate onSubmit={submitHandler}>
                {" "}
                {/* submit 버튼을 누르면 handleSubmit이 실행됨. */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="userid"
                            label="id"
                            name="id"
                            autoComplete="username"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            로그인
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Login;