import React, { useState } from "react";
import {
    Divider,
    Chip,
    TextField,
    Button,

} from "@mui/material";

function FieldDrawForm(props) {
    const [fieldName, setFieldName] = useState("");

    const handleFieldNameChange = (event) => {
        setFieldName(event.target.value);
    };


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
                disabled={!props.flagFieldComplete}
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
                        props.onSubmit(fieldName);
                    }}
                    disabled={!props.flagFieldComplete || fieldName === ""}
                >
                    Add
                </Button>
            </div>
        </div>
    )
}

export default FieldDrawForm;