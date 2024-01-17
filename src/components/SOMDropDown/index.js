import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Box, FormControl, Select } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SOMDropDown({ onChangeSOM }) {

    const [value, setValue] = useState('By Date');

    const handleChange = (event) => {
        const selected = event.target.value;
        setValue(selected);
    };

    useEffect(() => {
        onChangeSOM(value); // Notify parent component
    }, [value]);

    return (
        <Box sx={{ minWidth: 140 }}>
            <FormControl fullWidth>
                <Select
                    displayEmpty
                    style={{ height: "38px" }}
                    value={value}
                    onChange={handleChange}
                    IconComponent={() => {
                        return <ExpandMoreIcon fontSize="medium" />;
                    }}
                >
                    <MenuItem value={"By Date"}>By Date</MenuItem>
                    <MenuItem value={"By Year"}>By Year</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default SOMDropDown;