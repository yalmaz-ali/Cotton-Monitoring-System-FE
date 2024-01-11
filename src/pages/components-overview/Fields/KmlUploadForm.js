import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    Box
} from "@mui/material";


function KmlUploadForm(props) {

    const [polygons, setPolygons] = useState([]);
    const [selectedPolygons, setSelectedPolygons] = useState([]);

    useEffect(() => {
        setPolygons(props.polygons);
    }, [props.polygons]);

    useEffect(() => {
        console.log(selectedPolygons);
    }, [selectedPolygons]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedPolygons(polygons.map(polygon => polygon.id));
        } else {
            setSelectedPolygons([]);
        }
    };

    const handleSelect = (id) => (event) => {
        if (event.target.checked) {
            setSelectedPolygons(prevSelected => [...prevSelected, id]);
        } else {
            setSelectedPolygons(prevSelected => prevSelected.filter(polygonId => polygonId !== id));
        }
    };

    const handleSaveKmlPolygons = () => {
        const selected = polygons.filter(polygon => selectedPolygons.includes(polygon.id));
        // props.handleSaveKmlPolygons(selected);
        console.log("selected", selected);
    };

    return (
        <div
            style={{
                overflowY: "auto",
                position: "relative",
                flex: 1
            }}
        >
            {polygons.length === 0 ?
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "calc(100% - 50px)",
                    }}>
                    <h3>
                        No Polygons
                    </h3>
                </div>
                :
                <div style={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#eeeff2",
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                        }}
                    >
                        <FormControlLabel
                            style={{
                                marginLeft: "6px"
                            }}
                            control={<Checkbox onChange={handleSelectAll} />}
                        />
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: "bold"
                            }}
                        >
                            Select All
                        </Typography>
                    </Box>
                    {polygons.map((polygon) => (
                        <Card
                            sx={{
                                margin: "8px",
                                backgroundColor: "#fff",
                                boxShadow: "1px 3px 10px -10px rgba(0,0,0,0.5)",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                            key={polygon.id}
                        >
                            <CardContent>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPolygons.includes(polygon.id)}
                                            onChange={handleSelect(polygon.id)}
                                        />
                                    }
                                    label={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{polygon.name}</Typography>}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#666"
                                    }}
                                >
                                    {polygon.area.toFixed(3)} ha
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            }
            <div style={{
                position: "sticky",
                bottom: "0px",
                backgroundColor: "#eeeff2",
                display: "flex",
                justifyContent: "space-evenly",
                zIndex: 2,
                boxShadow: "1px -3px 10px -10px rgba(0,0,0,0.5)",
                padding: "4px",
            }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={props.handleCancelKml}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveKmlPolygons}
                >
                    Upload KML
                </Button>
            </div>

        </div>
    )
}

export default KmlUploadForm;