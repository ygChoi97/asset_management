import { Grid, ListItem, MenuItem, Select, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";

function ContentCommon({ item, update }) {

    const [value, setValue] = useState(null);

    useEffect(() => {
        if (item.dateType === 'y') {
            if (item.data !== null)
                setValue(new Date(item.data));
            else
                setValue(null);
        }
    }, [item.data]);

    const theme = createTheme({
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
        // palette: {
        //     primary: {
        //       main: purple[500],
        //     },
        //     secondary: {
        //       main: blueGrey[400],
        //     },
        //   },

    });

    const handleChangeInput = (e) => {
        item.data = e.target.value;
        update(item);
    };

    const color = "#399939";

    return (
        <ListItem
            sx={{
                height: 28
            }}
        >

            <Grid container spacing={1} alignItems="center" textAlign='right'>
                <ThemeProvider theme={theme}>
                    <Grid item xs={3}>
                        <Typography
                            sx={{ fontSize: '0.7rem', fontWeight: 600, width: '100px' }}
                        >
                            {item.columnName}
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        { item.number === 'y' ?
                        <TextField
                        //placeholder={item.value}
                        fullWidth
                        id="standard-number"
                        type="number"
                        
                        inputProps={{ min: 0, max: 4, style: { height: 9, fontSize: '0.7rem', fontWeight: 400 } }}
                        //label={item.columnName}
                        value={item.data||''}
                        onChange={handleChangeInput}
                        sx={{
                            width: 1,
                            "& .MuiInputBase-root": {
                                height: '1.6rem'
                            }
                        }}
                        />
                        : item.readOnly === 'y' ? 
                            <TextField
                            //placeholder={item.value}
                            fullWidth
                            id="outlined-disabled"
                            disabled
                            
                            inputProps={{ style: { height: 9, fontSize: '0.7rem', fontWeight: 400 } }}
                            //label={item.columnName}
                            value={item.data||''}
                            onChange={handleChangeInput}
                            sx={{
                                width: 1,
                                "& .MuiInputBase-root": {
                                    height: '1.6rem'
                                }
                            }}
                            />
                        : item.req === 'y' ?
                            <TextField
                                // placeholder={item.value}
                                fullWidth
                                id="standard-read-only-input"
                                // label={item.columnName}
                                InputProps={{
                                    readOnly: false,
                                    style: { height: '1rem', fontSize: '0.9rem', fontWeight: 600 }
                                }}

                                variant="standard"
                                value={item.data||''}
                                size="small"
                                color="secondary"
                                onChange={handleChangeInput}
                                focused
                            />
                            : item.dateType === 'y' ?
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker value={dayjs(value)} format={"YYYY-MM-DD"} showToolbar
                                        onChange={(newValue) => {
                                            setValue(newValue);

                                            if (newValue != null) {
                                                item.data = newValue.format("YYYY-MM-DD");
                                                console.log(item.data)
                                                update(item);
                                            }
                                            else {
                                                item.data = null;
                                                console.log(newValue)
                                                update(item);

                                            }
                                        }}
                                        /* slotProps={{ fieldSeparator: { sx: { height: '10px', width: '50%' } } }} */
                                        slotProps={{
                                            actionBar: {
                                                actions: ['clear'],
                                            },
                                        }}
                                        placeholder="custom label"
                                        sx={{
                                            width: 1,
                                            '& .MuiInputBase-root': {
                                                height: '1.6rem',
                                                fontSize: '0.7rem'
                                            },
                                        }}

                                    />
                                </LocalizationProvider>
                                :
                                item.area == 'y' ?
                                    <>

                                        <Select
                                            value={item.data||''}
                                            onChange={handleChangeInput}
                                            sx={{ width: 1, height: '1.6rem', fontSize: '0.7rem', textAlign: 'left' }}
                                        >
                                            <MenuItem value=''>
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={"남양"}>남양</MenuItem>
                                            <MenuItem value={"마북"}>마북</MenuItem>
                                            <MenuItem value={"의왕"}>의왕</MenuItem>
                                            <MenuItem value={"광명"}>광명</MenuItem>
                                            <MenuItem value={"화성"}>화성</MenuItem>
                                            <MenuItem value={"광주"}>광주</MenuItem>
                                            <MenuItem value={"전주"}>전주</MenuItem>
                                            <MenuItem value={"울산"}>울산</MenuItem>
                                            <MenuItem value={"아산"}>아산</MenuItem>
                                            <MenuItem value={"본사"}>본사</MenuItem>
                                            <MenuItem value={"대치"}>대치</MenuItem>
                                            <MenuItem value={"삼성"}>삼성</MenuItem>
                                            <MenuItem value={"판교"}>판교</MenuItem>
                                            <MenuItem value={"원효로"}>원효로</MenuItem>
                                            <MenuItem value={"대방"}>대방</MenuItem>
                                            <MenuItem value={"기타"}>기타</MenuItem>
                                        </Select>
                                    </> :
                                    item.uptake == 'y' ?
                                        <>

                                            <Select
                                                value={item.data||''}
                                                onChange={handleChangeInput}
                                                sx={{ width: 1, height: '1.6rem', fontSize: '0.7rem', textAlign: 'left' }}
                                            >
                                                <MenuItem value=''>
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={"사용"}>사용</MenuItem>
                                                <MenuItem value={"미사용"}>미사용</MenuItem>
                                                <MenuItem value={"매각"}>매각</MenuItem>
                                                <MenuItem value={"매각대기"}>매각대기</MenuItem>
                                            </Select>
                                        </>
                                        :
                                        <TextField
                                            //placeholder={item.value}
                                            fullWidth
                                            id="standard-basic"
                                            inputProps={{ style: { height: 9, fontSize: '0.7rem', fontWeight: 400 } }}
                                            //label={item.columnName}
                                            value={item.data||''}
                                            onChange={handleChangeInput}
                                            sx={{
                                                width: 1,
                                                "& .MuiInputBase-root": {
                                                    height: '1.6rem'
                                                }
                                            }}
                                        />}
                    </Grid>
                </ThemeProvider>
            </Grid>
        </ListItem>
    );
}

export default ContentCommon;