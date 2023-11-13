import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Box, FormControl, FormHelperText, Select } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FillingDropdownMenu({ onFillingSelect }) {

    const [filling, setFilling] = useState('No Filling');

    const handleChange = (event) => {
        const selected = event.target.value;
        setFilling(selected);
        onFillingSelect(selected); // Notify parent component
    };

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
                    <MenuItem value={"No Filling"}>No Filling</MenuItem>
                    <MenuItem value={"Average NDVI"}>Average NDVI</MenuItem>
                    <MenuItem value={"NDVI"}>NDVI</MenuItem>
                    <MenuItem value={"Contrasted NDVI"}>Contrasted NDVI</MenuItem>
                    <MenuItem value={"Crop"}>Crop</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default FillingDropdownMenu;
