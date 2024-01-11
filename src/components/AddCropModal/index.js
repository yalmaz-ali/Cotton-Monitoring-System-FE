import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Autocomplete
} from '@mui/material';

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

function AddCropModal(props) {


    return (
        <div>
            <Dialog
                open={Boolean(props.anchorEl)}
                onClose={props.handleClose}
                BackdropProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: 'none'
                    },
                }}
            >
                <DialogTitle>Assign Crop</DialogTitle>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Autocomplete
                        options={cropNames}
                        clearOnEscape
                        autoComplete
                        autoHighlight
                        blurOnSelect
                        value={props.cropNameInput}
                        onChange={(event, newValue) => {
                            props.handleCropNameChange(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Crop Name" variant="outlined" />}
                        style={{
                            margin: "15px",
                            minWidth: "200px",

                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={props.handleCropNameSubmit}
                        color="primary"
                        disabled={props.cropNameInput === ""}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default AddCropModal;
