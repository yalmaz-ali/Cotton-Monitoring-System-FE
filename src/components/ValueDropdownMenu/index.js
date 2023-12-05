import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Box, FormControl, FormHelperText, Select } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ValueDropdownMenu({ onValueSelect }) {

    const [value, setValue] = useState('Without Values');

    const handleChange = (event) => {
        const selected = event.target.value;
        setValue(selected);
    };

    useEffect(() => {
        onValueSelect(value); // Notify parent component
    }, [value]);

    return (
        <Box sx={{ minWidth: 140 }}>
            <FormControl fullWidth>
                {/* <FormHelperText id="value-helper">Value</FormHelperText> */}
                <Select
                    displayEmpty
                    style={{ height: "38px" }}
                    value={value}
                    onChange={handleChange}
                    // aria-describedby="value-helper"
                    IconComponent={() => {
                        return <ExpandMoreIcon fontSize="medium" />;
                    }}
                >
                    <MenuItem value={"Without Values"}>Without Values</MenuItem>
                    <MenuItem value={"Field names"}>Field names</MenuItem>
                    <MenuItem value={"Area"}>Area</MenuItem>
                    <MenuItem value={"Crop"}>Crop</MenuItem>
                    <MenuItem value={"Average NDVI"}>Average NDVI</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default ValueDropdownMenu;