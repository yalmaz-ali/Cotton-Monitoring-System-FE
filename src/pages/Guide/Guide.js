import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, List, ListItem, Container, useMediaQuery } from '@mui/material';
import './Guide.css';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from './../../context/auth-context/AuthContext';
import axios from "axios";

function Guide() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { authenticated, logout } = useAuth();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const jwtToken = Cookies.get('jwt');
        if (!jwtToken) {
            console.log("no jwt token");
            logout();
            navigate('/auth/login');
            return;
        }
        getUser();
    }, [authenticated, navigate]);

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/auth/user/', {
                withCredentials: true,
            });
            const user = response.data;
            if (user) {
                console.log("user", user);
            } else {
                logout();
                navigate('/auth/login');
            }
        } catch (error) {
            logout();
            navigate('/auth/login');
        }
    };


    return (
        <div>
            <AppBar position="static"
                style={{
                    height: 100,
                    backgroundColor: "#53b84d"
                }}>
                <Toolbar
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <Typography variant="h6">
                        Logo
                    </Typography>
                    <Typography
                        variant="h2"
                        style={{
                            flexGrow: 1,
                            textAlign: 'center',
                            textWeight: 'bold'
                        }}>
                        Guide Book
                    </Typography>
                    <Button
                        color="inherit"
                    >
                        Language
                    </Button>
                </Toolbar>
            </AppBar>
            <div
                style={{
                    display: 'flex',
                    paddingLeft: matchDownSM ? '20px' : '40px',
                    paddingRight: matchDownSM ? '20px' : '40px',
                    justifyContent: 'center',
                    flexBasis: 'auto',
                    flexGrow: 1,
                    flexShrink: 0,
                    zIndex: 1,
                }}
            >
                <section
                    style={{
                        maxWidth: '100%',
                        width: '960px',
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'row-reverse',
                        }}
                    >
                        <div
                            style={{
                                display: matchDownSM ? 'none' : 'flex',
                                fontFamily: "Poppins, sans-serif",
                                maxWidth: "300px",
                                position: 'sticky',
                                top: '32px',
                                marginLeft: '27px',
                                alignSelf: 'flex-start',
                                marginTop: '64px',
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: '10px ',
                                    color: '#1a1a1a',
                                    border: '1px solid rgb(230, 230, 230)',
                                    borderStyle: 'none',
                                    boxShadow: '0px 2px 8px rgba(0,0,0,.06)',
                                    maxHeight: 'calc(100vh - 96px)',
                                    overflowY: 'auto'
                                }}
                            >
                                <div
                                    style={{
                                        marginTop: '8px',
                                        marginBottom: '8px',
                                    }}
                                >
                                    <section
                                        style={{
                                            display: 'flex',
                                            borderTopWidth: '0px',
                                            borderBottomWidth: '0px',
                                            borderInlineEndWidth: '0px',
                                            borderInlineStartWidth: '2px',
                                            borderStyle: 'solid',
                                            paddingTop: '6px',
                                            paddingBottom: '6px',
                                            border: 'none',
                                            borderColor: '#737373',
                                            paddingLeft: '16px',
                                            paddingRight: '16px',
                                        }}
                                    >
                                        <a id="#h_8702ec6f54" href="#h_8702ec6f54"
                                            style={{
                                                width: '100%',
                                                textDecorationLine: 'none',
                                                display: 'inline-block',
                                                color: '#1a1a1a',
                                                fontSize: '14px',
                                                fontWeight: 400,
                                            }}
                                        >
                                            🤔 What is the NDVI index?
                                        </a>
                                    </section>
                                    <section
                                        style={{
                                            display: 'flex',
                                            borderTopWidth: '0px',
                                            borderBottomWidth: '0px',
                                            borderInlineEndWidth: '0px',
                                            borderInlineStartWidth: '2px',
                                            borderStyle: 'solid',
                                            paddingTop: '6px',
                                            paddingBottom: '6px',
                                            border: 'none',
                                            borderColor: '#737373',
                                            paddingLeft: '16px',
                                            paddingRight: '16px',
                                        }}

                                    >
                                        <a id="#h_8d68fb29b4" href="#h_8d68fb29b4"
                                            style={{
                                                width: '100%',
                                                textDecorationLine: 'none',
                                                display: 'inline-block',
                                                color: '#1a1a1a',
                                                fontSize: '14px',
                                                fontWeight: 400,
                                            }}
                                        >
                                            🔍 How to check the vegetation quality in the web app
                                        </a>
                                    </section>
                                    <section
                                        style={{
                                            display: 'flex',
                                            borderTopWidth: '0px',
                                            borderBottomWidth: '0px',
                                            borderInlineEndWidth: '0px',
                                            borderInlineStartWidth: '2px',
                                            borderStyle: 'solid',
                                            paddingTop: '6px',
                                            paddingBottom: '6px',
                                            border: 'none',
                                            borderColor: '#737373',
                                            paddingLeft: '16px',
                                            paddingRight: '16px',
                                        }}

                                    >
                                        <a id="#h_4f576159a0" href="#h_4f576159a0"
                                            style={{
                                                width: '100%',
                                                textDecorationLine: 'none',
                                                display: 'inline-block',
                                                color: '#1a1a1a',
                                                fontSize: '14px',
                                                fontWeight: 400,
                                            }}
                                        >
                                            🛰 How to check NDVI for past dates
                                        </a>
                                    </section>
                                </div>
                            </div>
                        </div>
                        <article className="jsx-adf13c9b2a104cce ">
                            <div className="intercom-interblocks-heading intercom-interblocks-align-left">
                                <h1 id="h_8702ec6f54">
                                    <b>🤔 What is the NDVI index?</b>
                                </h1>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>NDVI (Normalized difference vegetation index) is an indicator of plant health. It shows how a plant reflects red and near-infrared light waves.</p>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>A healthy plant with a lot of chlorophyll and good cell structure actively absorbs red light and reflects near-infrared light.</p>
                            </div><div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>The index ranges from -1 to 1. NDVI values between -1 to 0 correspond to surfaces like snow, water, sand, stones, and infrastructure objects, such as roads and houses. NDVI values for plants range from 0 to 1.</p>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>

                                </p>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>This <a href="https://up42.com/blog/5-things-to-know-about-ndvi" rel="nofollow noopener noreferrer" target="_blank" style={{ color: '#30c03c' }} > blog
                                </a> has more insights into what the NDVI index can tell you at different stages of the season.
                                </p>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>

                                </p>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>

                                </p>
                            </div>
                            <div className="intercom-interblocks-heading intercom-interblocks-align-left">
                                <h1 id="h_8d68fb29b4">
                                    <b>🔍 How to check the vegetation quality in the web app</b>
                                </h1>
                            </div>
                            <div className="intercom-interblocks-ordered-nested-list">
                                <ol>
                                    <li>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>
                                                Go to <a href="/Field" rel="nofollow noopener noreferrer" target="_blank" style={{ color: '#30c03c' }}>the 'Fields' section</a> of the main menu and select a field from your field list or click it on the map. Please note that in the web app, you can only see the NDVI vegetation index for fields that have been added and saved to your account.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>
                                                Click the field right on the map or click its name in the field list. You'll see its NDVI map. It may take a few seconds to calculate the index.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>
                                                A bar with the dates of the available images will appear at the top of the screen. Scroll through them to see how the NDVI index has changed over time.
                                            </p>
                                        </div>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>

                                            </p>
                                        </div>
                                        <div className="intercom-interblocks-image intercom-interblocks-align-left">
                                            {/* <a href="https://downloads.intercomcdn.com/i/o/375048391/90a1a05bdc684329d4d3e61f/NDVI-EN.gif" target="_blank" rel="noreferrer nofollow noopener">
                                                    <img src="https://downloads.intercomcdn.com/i/o/375048391/90a1a05bdc684329d4d3e61f/NDVI-EN.gif" width="1920" height="1080">
                                                </a> */}
                                        </div>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>

                                            </p>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>

                                </p>
                            </div>
                            <div className="intercom-interblocks-heading intercom-interblocks-align-left">
                                <h1 id="h_4f576159a0">
                                    <b>
                                        🛰 How to check NDVI for past dates
                                    </b>
                                </h1>
                            </div>
                            <div className="intercom-interblocks-unordered-nested-list">
                                <ul>
                                    <li>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>
                                                After you select a field, you'll see a bar with the dates of the available images at the top of the screen. Just scroll through the dates.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>
                                                Use the Slider or Grid View tool to compare NDVI for different days on the same field. Select a field, and click the split window (Slider) icon on the right side of the screen.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="intercom-interblocks-image intercom-interblocks-align-left">
                                {/* <a href="https://onesoil-02a6e0d85c62.intercom-attachments-7.com/i/o/337352823/32b0b5fefd850e61071c98aa/oFpmXl5HKCrMhQjwn_FZnY5SW-Vq19qfAfUepd7VZcNtdgSETYMZf7bPKXAvaxz-eb83YmXpXMnWFxBE0SbWMbD3Mn1nRH1S_O_IXAGkOZ0ngc-noep_pr2e9uUoJrXXi0YDoOZn?expires=1621338612&amp;signature=68c8abb3be0f2bc5a4278d51f1bfb2ebee73d3e44a1817c3064b9a34a8c36b68" target="_blank" rel="noreferrer nofollow noopener">
                                        <img src="https://onesoil-02a6e0d85c62.intercom-attachments-7.com/i/o/337352823/32b0b5fefd850e61071c98aa/oFpmXl5HKCrMhQjwn_FZnY5SW-Vq19qfAfUepd7VZcNtdgSETYMZf7bPKXAvaxz-eb83YmXpXMnWFxBE0SbWMbD3Mn1nRH1S_O_IXAGkOZ0ngc-noep_pr2e9uUoJrXXi0YDoOZn?expires=1621338612&amp;signature=68c8abb3be0f2bc5a4278d51f1bfb2ebee73d3e44a1817c3064b9a34a8c36b68">
                                    </a> */}
                            </div>
                            <div className="intercom-interblocks-unordered-nested-list">
                                <ul>
                                    <li>
                                        <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                            <p>
                                                Use the vegetation index chart in <a href="https://app.onesoil.ai/weather?utm_source=helpdesk&amp;utm_medium=en" rel="nofollow noopener noreferrer" target="_blank" style={{ color: '#30c03c' }}>the 'Calendar' Icon</a> to see how NDVI values changed during the season.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="intercom-interblocks-image intercom-interblocks-align-center">
                                {/* <a href="https://onesoil-02a6e0d85c62.intercom-attachments-7.com/i/o/337352824/ff6065e6d3cf86f46bdd4e92/idpznlYs-XDEtpoQgD15iXbefWSvxQ9DxVvBUFzkRh-xAbQ4o6jrJaY3vDzDvSN7npWnCWt53sdQSgm5UTkEaWVcQmRA6zkes7tG1PRFixVP_V5a9Gel7fyOUUji_wldhY_dtxNr?expires=1621338612&amp;signature=68ab6619b6f7e9e9fe81507f73b50e3d08b293b8dc7bcfc4d4b30ec951a29948" target="_blank" rel="noreferrer nofollow noopener">
                                        <img src="https://onesoil-02a6e0d85c62.intercom-attachments-7.com/i/o/337352824/ff6065e6d3cf86f46bdd4e92/idpznlYs-XDEtpoQgD15iXbefWSvxQ9DxVvBUFzkRh-xAbQ4o6jrJaY3vDzDvSN7npWnCWt53sdQSgm5UTkEaWVcQmRA6zkes7tG1PRFixVP_V5a9Gel7fyOUUji_wldhY_dtxNr?expires=1621338612&amp;signature=68ab6619b6f7e9e9fe81507f73b50e3d08b293b8dc7bcfc4d4b30ec951a29948">
                                    </a> */}
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>

                                </p>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>

                                </p>
                            </div>
                            <div className="intercom-interblocks-paragraph no-margin intercom-interblocks-align-left">
                                <p>

                                </p>
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        </div >
    );
}

export default Guide;