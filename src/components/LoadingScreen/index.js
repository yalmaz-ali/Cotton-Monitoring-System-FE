import React, { useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import logo from 'assets/images/logo.svg'
import './LoadingScreen.css'; // Import the CSS file

export default function LoadingScreen(props) {
    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: 9999999 }}
                open={props.openLoading}
            >
                {/* <div className="logo-container">
                    <img src={logo} alt="logo" className="logo" />
                </div> */}
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}