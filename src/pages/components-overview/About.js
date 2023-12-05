import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Sir_Hassan from 'assets/images/about/Sir_Hassan_Jamal.jpeg';
import Sir_Zeeshan from 'assets/images/about/Sir_Zeeshan_Gilaani.jpeg';
import yalmaz from 'assets/images/about/yalmaz.jpg'
import LinkedIn from 'assets/images/about/linkedin.png';
import GitHub from 'assets/images/about/github.png';

const containerStyle = {
    height: '90vh',
    backgroundImage: 'url("/path/to/background/image.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
};

const titleStyle = {
    marginTop: '10px',
    marginBottom: '5px',
    textAlign: 'center',
};

const supervisorStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const teamMemberStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '5px',
};

const pictureStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '2px',
};

const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1px',
};

const iconImageStyle = {
    width: '24px',
    height: '24px',
    marginRight: '1px',
};

export default function About() {
    return (
        <div style={containerStyle}>
            <Typography variant="h3" style={titleStyle}>
                About Us
            </Typography>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6} style={supervisorStyle}>
                    <img src={Sir_Hassan} alt="Supervisor 1" style={pictureStyle} />
                    <Typography variant="h5">Supervisor 1</Typography>
                    <div style={iconStyle}>
                        <img src={LinkedIn} alt="LinkedIn" style={iconImageStyle} />
                        <img src={GitHub} alt="GitHub" style={iconImageStyle} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} style={supervisorStyle}>
                    <img src={Sir_Zeeshan} alt="Supervisor 2" style={pictureStyle} />
                    <Typography variant="h5">Supervisor 2</Typography>
                    <div style={iconStyle}>
                        <img src={LinkedIn} alt="LinkedIn" style={iconImageStyle} />
                        <img src={GitHub} alt="GitHub" style={iconImageStyle} />
                    </div>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={5}>
                <Grid item xs={12} sm={4} style={teamMemberStyle}>
                    <img src={yalmaz} alt="Team Member 1" style={pictureStyle} />
                    <Typography variant="h5">Team Member 1</Typography>
                    <div style={iconStyle}>
                        <img src={LinkedIn} alt="LinkedIn" style={iconImageStyle} />
                        <img src={GitHub} alt="GitHub" style={iconImageStyle} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={4} style={teamMemberStyle}>
                    <img src={yalmaz} alt="Team Member 2" style={pictureStyle} />
                    <Typography variant="h5">Team Member 2</Typography>
                    <div style={iconStyle}>
                        <img src={LinkedIn} alt="LinkedIn" style={iconImageStyle} />
                        <img src={GitHub} alt="GitHub" style={iconImageStyle} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={4} style={teamMemberStyle}>
                    <img src={yalmaz} alt="Team Member 3" style={pictureStyle} />
                    <Typography variant="h5">Team Member 3</Typography>
                    <div style={iconStyle}>
                        <img src={LinkedIn} alt="LinkedIn" style={iconImageStyle} />
                        <img src={GitHub} alt="GitHub" style={iconImageStyle} />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
