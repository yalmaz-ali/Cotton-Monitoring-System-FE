import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Card, CardContent, Divider } from '@mui/material';
import axios from 'axios';
import LoadingScreen from 'components/LoadingScreen';

function RenderHistory({ selectedFarmId }) {
    const [openLoading, setOpenLoading] = useState(false);
    const [data, setData] = useState([]);

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

    return (
        <Grid container style={{ width: '100%' }}>
            <Grid item xs={3} style={{
                position: 'sticky',
                boxShadow: '15px 0 15px -15px rgba(0, 0, 0, 0.5)',
            }}>
                <Paper style={{
                    padding: '16px',
                    borderRadius: 0,
                    boxShadow: 'none',
                    minHeight: '91vh ',
                    // display: 'flex',
                    // flexDirection: 'column',
                    // justifyContent: 'center',
                    // alignItems: 'center'
                }}>
                    <Typography variant="h2" style={{ fontWeight: 'bold' }}>Crop Rotation</Typography>
                    <Divider style={{ margin: '16px 0' }} />
                    {data.map((field) => (
                        <Card key={field.fieldId} style={{ margin: '16px 0' }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1">{field.fieldName}</Typography>
                                <Typography>ID: {field.fieldId}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={9} style={{
                overflowX: 'auto',
                minHeight: '91vh ',
            }}>
                <Grid container wrap="nowrap">
                    {uniqueSeasons.map((season, index) => (
                        <Grid item key={index} style={{ minWidth: "20%" }}>
                            <Paper style={{
                                padding: '16px',
                                borderRadius: 0,
                                boxShadow: '5px -1px 12px -10px rgba(0, 0, 0, 0.5)',
                                // rgba(0, 0, 0, 0.5) 5px -1px 12px -10px
                                minHeight: '91vh',
                                margin: '0 1px'
                            }}>
                                <Typography variant="h2" style={{ fontWeight: 'bold' }}>
                                    {season}
                                </Typography>
                                <Divider style={{ margin: '16px 0' }} />
                                {data.map((field) => {
                                    // Find the crop for the current season
                                    const crop = field.cropRotation.find(crop => crop.season.name === season);
                                    return (
                                        <Card key={field.fieldId} style={{ margin: '16px 0' }}>
                                            <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                {crop ?
                                                    <Typography>
                                                        {crop.cropName}
                                                    </Typography>
                                                    :
                                                    <Typography
                                                        style={{ color: 'red' }}
                                                    >
                                                        Null
                                                    </Typography>
                                                }
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <LoadingScreen openLoading={openLoading} />
        </Grid >
    );
}

export default RenderHistory;
