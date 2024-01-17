import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Box, FormControl, FormHelperText, Select } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from 'react-router-dom';

function FillingDropdownMenu({ onFillingSelect }) {
    const { fieldId } = useParams();
    const [filling, setFilling] = useState("");

    const handleChange = (event) => {
        const selected = event.target.value;
        setFilling(selected);
    };

    useEffect(() => {
        console.log("1");
        setFilling(fieldId ? "NDVI" : "No Filling");
    }, [fieldId]);

    useEffect(() => {
        console.log("2");
        fieldId ? onFillingSelect(filling, true) :
            onFillingSelect(filling, false); // Notify parent component
    }, [filling]);

    return (
        <Box sx={{ minWidth: 140 }}>
            <FormControl fullWidth>
                {/* <FormHelperText id="filling-helper">Filling</FormHelperText> */}
                <Select
                    displayEmpty
                    style={{ height: "38px" }}
                    value={filling}
                    onChange={handleChange}
                    // aria-describedby="filling-helper"
                    IconComponent={() => {
                        return <ExpandMoreIcon fontSize="medium" />;
                    }}
                >
                    {
                        fieldId ? [
                            <MenuItem value={"NDVI"} key="3">NDVI</MenuItem>,
                            <MenuItem value={"Contrasted NDVI"} key="4">Contrasted NDVI</MenuItem>,
                            <MenuItem value={"SOM"} key="6">SOM</MenuItem>
                        ] : [
                            <MenuItem value={"No Filling"} key="1">No Filling</MenuItem>,
                            <MenuItem value={"Average NDVI"} key="2">Average NDVI</MenuItem>,
                            <MenuItem value={"NDVI"} key="3">NDVI</MenuItem>,
                            <MenuItem value={"Contrasted NDVI"} key="4">Contrasted NDVI</MenuItem>,
                            <MenuItem value={"Crop"} key="5">Crop</MenuItem>
                        ]
                    }
                </Select>
            </FormControl>
        </Box>
    );
}

export default FillingDropdownMenu;
