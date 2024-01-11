import React, { useState, useEffect } from "react";
import { TextField, Button, Divider, Chip, Autocomplete } from "@mui/material";

function EditForm(
    props
) {
    const cropNames = [
        "Alfalfa",
        "Apple",
        "Apricot",
        "Artichoke",
        "Asparagus",
        "Avocado",
        "Banana",
        "Barley",
        "Bean",
        "Beet",
        "Blackberry",
        "Blackgram",
        "Blueberry",
        "Broccoli",
        "Brussels Sprouts",
        "Cabbage",
        "Cantaloupe",
        "Carrot",
        "Cauliflower",
        "Cherry",
        "Chickpea",
        "Coconut",
        "Coffee",
        "Cotton",
        "Cranberry",
        "Cucumber",
        "Date Palm",
        "Eggplant",
        "Fig",
        "Garlic",
        "Ginger",
        "Grapes",
        "Hazelnut",
        "Jute",
        "Kale",
        "Kiwi",
        "Lemon",
        "Lentil",
        "Lettuce",
        "Lychee",
        "Maize",
        "Mango",
        "Moth Beans",
        "Mung Bean",
        "Muskmelon",
        "Nectarine",
        "No Crop",
        "Olive",
        "Onion",
        "Orange",
        "Other Crop",
        "Papaya",
        "Peach",
        "Pear",
        "Pigeon Peas",
        "Pineapple",
        "Plum",
        "Pomegranate",
        "Potato",
        "Quinoa",
        "Raspberry",
        "Rice",
        "Soybean",
        "Spinach",
        "Sugarcane",
        "Strawberry",
        "Sweet Potato",
        "Taro",
        "Tomato",
        "Walnut",
        "Watermelon",
        "Wheat",
        "Yam",
        "Zucchini",
    ];

    const [cropName, setCropName] = useState(props.cropName || "");

    const handleCropNameChange = (newValue) => {
        setCropName(newValue);
    }
    useEffect(() => {
        props.setCropNameToChange(cropName);
    }, [cropName]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <Divider>
                <Chip label="UPDATE FIELD" />
            </Divider>
            <br />
            <TextField
                label="Field Name"
                variant="outlined"
                value={props.fieldName}
                onChange={(e) => props.handleFieldNameChange(e)}
                style={{ margin: "15px" }}
            />
            <Autocomplete
                options={cropNames}
                clearOnEscape
                autoComplete
                autoHighlight
                blurOnSelect
                value={cropName}
                onChange={(event, newValue) => {
                    handleCropNameChange(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Crop Name" variant="outlined" />}
                style={{ margin: "15px" }}
            />
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%"
            }}>
                <Button variant="contained" color="secondary"
                    onClick={props.handleEditCancel}
                >
                    Cancel
                </Button>
                <Button variant="contained" color="primary"
                    onClick={props.handleEditSubmit}
                    disabled={props.fieldName === ""}
                >
                    Update
                </Button>
            </div>
        </div>

    );
};

export default EditForm;