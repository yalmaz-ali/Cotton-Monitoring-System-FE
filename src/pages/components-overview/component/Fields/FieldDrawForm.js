import React, { useState, useEffect } from "react";
import {
    Divider,
    Chip,
    TextField,
    Button,
    Autocomplete
} from "@mui/material";
import axios from "axios";

function FieldDrawForm(props) {
    const [fieldName, setFieldName] = useState("");
    const [cropName, setCropName] = useState("");

    const handleFieldNameChange = (event) => {
        setFieldName(event.target.value);
    };

    function handleCropNameChange(newCropName) {
        setCropName(newCropName);
    }

    useEffect(() => {
        if (props.flagFieldComplete) {
            GetPrediction();
        }
    }, [props.flagFieldComplete, props.latLngCoordinates]);


    const GetPrediction = async () => {
        setCropName("Loading...");
        const coordinates = props.latLngCoordinates;
        const body = {
            coordinates: JSON.stringify(coordinates),
        }
        try {
            const response = await axios.post('http://localhost:8000/api/field/getPrediction/',
                body,
                { withCredentials: true });

            if (response.status === 200) {
                console.log("response", response.data.prediction);
                console.log("status", response.status);
                setCropName(response.data.prediction);
            }
        } catch (err) {
            console.log("error", err);
            setCropName("");
        }
    };

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


    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Divider>
                <Chip label="ADD FIELD" />
            </Divider>
            <br />
            <TextField
                label="Field Name"
                variant="outlined"
                value={fieldName}
                onChange={handleFieldNameChange}
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
                getOptionLabel={(option) => option} // replace 'label' with the actual property you want to display
                renderInput={(params) => <TextField {...params} label="Crop Name" variant="outlined" />}
                style={{ margin: "15px" }}
            />
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                <Button variant="contained" color="secondary"
                    onClick={props.handleDeleteFieldDraw}
                >
                    {!props.flagFieldComplete ? "Cancel" : "Delete"}
                </Button>
                <Button variant="contained" color="primary"
                    onClick={() => {
                        props.handleAddFieldDraw();
                        props.onSubmit(fieldName, cropName);
                    }}
                    disabled={!props.flagFieldComplete || fieldName === "" || cropName === ""}
                >
                    Add
                </Button>
            </div>
        </div>
    )
}

export default FieldDrawForm;