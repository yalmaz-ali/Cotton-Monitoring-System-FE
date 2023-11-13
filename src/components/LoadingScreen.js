import React, { useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingScreen(props) {
    useEffect(() => {
        console.log(props.openLoading)
    }, [props.openLoading])

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: 2002 }}
                open={props.openLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
