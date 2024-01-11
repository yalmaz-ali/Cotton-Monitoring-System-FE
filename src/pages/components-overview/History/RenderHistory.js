import React, { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Divider,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    useMediaQuery
} from '@mui/material';
import axios from 'axios';
import LoadingScreen from 'components/LoadingScreen';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCropModal from 'components/AddCropModal';


function RenderHistory({ selectedFarmId }) {
    const [openLoading, setOpenLoading] = useState(false);
    const [data, setData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cropNameInput, setCropNameInput] = useState(null);
    const [confirmWindow, setConfirmWindow] = useState(false);

    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);

    const handleClick = (event, fieldId, seasonId) => {
        setAnchorEl(event.currentTarget);
        setSelectedFieldId(fieldId);
        setSelectedSeasonId(seasonId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCropNameInput('');
    };

    useEffect(() => {
        setCropNameInput(null);
    }, [anchorEl]);

    const handleCropNameChange = (value) => {
        setCropNameInput(value);
    };

    const handleDelete = (fieldId, seasonId) => {
        setSelectedFieldId(fieldId);
        setSelectedSeasonId(seasonId);
        handleCropNameChange(null);
        setConfirmWindow(true);
    };

    const handleCropNameSubmit = async () => {
        setConfirmWindow(false);
        setOpenLoading(true);

        console.log("fieldId", selectedFieldId);
        console.log("seasonId", selectedSeasonId);

        const data = {
            "Field":
            {

            },
            "Field_Data":
            {
                "crop_name": cropNameInput
            },
            "Field_Grid":
            {

            }
        }
        console.log("data", data);
        try {
            const response = await axios.patch(`http://localhost:8000/api/field/patchField/${selectedFieldId}/${selectedSeasonId}/`, data, { withCredentials: true });
            console.log("responsee", response.data);
            fetchData();
        } catch (error) {
            console.log(error);
        } finally {
            setOpenLoading(false);
            handleClose();
        }
    };


    const fetchData = async () => {
        setOpenLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/farm/getCropRotation/${selectedFarmId}/`, { withCredentials: true });
            console.log("responsee", response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setOpenLoading(false);
        }
    };

    useEffect(() => {
        if (selectedFarmId) {
            fetchData();
        } else {
            setData([]);
        }
    }, [selectedFarmId]);

    // Extract all unique seasons
    const uniqueSeasons = [...new Set(data.flatMap(item => item.cropRotation.map(season => season.season.name)))];

    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <Grid container style={{ width: '100%' }}>
            <Grid item style={{
                width: matchesXs ? '50%' : '25%',
                position: 'sticky',
                boxShadow: '15px 0 15px -15px rgba(0, 0, 0, 0.5)',
            }}>
                <Paper style={{
                    padding: '16px',
                    borderRadius: 0,
                    boxShadow: 'none',
                    minHeight: '100%',
                    // display: 'flex',
                    // flexDirection: 'column',
                    // justifyContent: 'center',
                    // alignItems: 'center'
                }}>
                    <Typography
                        variant={matchesXs ? "h3" : "h2"}
                        style={{
                            fontWeight: 'bold',
                            marginBottom: matchesXs ? '20px' : '16px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        Crop rotation
                    </Typography>
                    <Divider
                        style={{
                            margin: '16px 0'
                        }}
                    />
                    {data.map((field) => (
                        <Card key={field.fieldId} style={{ margin: '16px 0', height: '61.97px' }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography
                                    variant="subtitle1"
                                    style={{
                                        fontWeight: 'bold',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {field.fieldName}
                                </Typography>
                                <Typography>ID: {field.fieldId}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Paper>
            </Grid>
            <Grid item style={{
                width: matchesXs ? '50%' : '75%',
                overflowX: 'auto',
                minHeight: '100%',
            }}>
                <Grid container wrap="nowrap">
                    {uniqueSeasons.map((season, index) => (
                        <Grid item key={index}
                            style={{
                                width: matchesXs ? '80%' : '23%',
                            }}>
                            <Paper style={{
                                padding: '16px',
                                borderRadius: 0,
                                boxShadow: '5px -1px 12px -10px rgba(0, 0, 0, 0.5)',
                                minHeight: "calc(100vh - 60px)",
                                margin: '0 1px'
                            }}>
                                <Typography variant="h3"
                                    style={{
                                        fontWeight: 'bold',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    {season}
                                </Typography>
                                <Divider style={{ margin: '22px 0px 16px 0px' }} />
                                {data.map((field) => {
                                    // Find the crop for the current season
                                    const crop = field.cropRotation.find(crop => crop.season.name === season);
                                    return (
                                        <Card key={field.fieldId}
                                            style={{
                                                margin: '16px 0',
                                                height: '61.97px',
                                                // width: '137.44px',
                                            }}>
                                            <CardContent style={{
                                                display: 'flex',
                                                alignItems: "center",
                                                justifyContent: 'center',
                                                position: 'relative',
                                                height: '100%'
                                            }}>
                                                {crop ?
                                                    <>
                                                        {
                                                            crop.cropName ?
                                                                <>
                                                                    <Typography
                                                                        style={{
                                                                            fontWeight: 'bold',
                                                                            width: '100px', // Adjust this value as needed
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            display: 'flex',
                                                                            whiteSpace: 'nowrap',

                                                                        }}
                                                                    >
                                                                        {crop.cropName}
                                                                    </Typography>
                                                                    <IconButton
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: -5,
                                                                            right: -5,
                                                                            color: 'red',
                                                                            borderBottomLeftRadius: 20,
                                                                        }}
                                                                        onClick={() => handleDelete(field.fieldId, crop.season.id)}
                                                                    >
                                                                        <RemoveCircleOutlineIcon
                                                                            fontSize="small"
                                                                            color="error"
                                                                        />
                                                                    </IconButton>
                                                                </>
                                                                :
                                                                <>
                                                                    <Button onClick={(event) => handleClick(event, field.fieldId, crop.season.id)}>
                                                                        Assign Crop
                                                                    </Button>
                                                                    <AddCropModal
                                                                        anchorEl={anchorEl}
                                                                        handleClose={handleClose}
                                                                        handleCropNameChange={handleCropNameChange}
                                                                        handleCropNameSubmit={handleCropNameSubmit}
                                                                        cropNameInput={cropNameInput}
                                                                    />
                                                                </>
                                                        }
                                                    </>
                                                    :
                                                    <Typography
                                                        style={{
                                                            color: '#585858',
                                                            fontWeight: 'bold',
                                                            fontSize: '13px'
                                                        }}
                                                    >
                                                        The Field is not in this season
                                                    </Typography>

                                                }
                                            </CardContent>
                                        </Card>);
                                })}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <LoadingScreen openLoading={openLoading} />
            <Dialog
                open={confirmWindow}
                onClose={() => setConfirmWindow(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this crop?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmWindow(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCropNameSubmit} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

        </Grid >
    );
}

export default RenderHistory;
