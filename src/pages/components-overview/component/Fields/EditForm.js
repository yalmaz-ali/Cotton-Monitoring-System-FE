import React, { useState } from "react";
import { TextField, Button, Divider, Chip } from "@mui/material";

function EditForm(
    props
) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <Divider>
                <Chip label="UPDATE FIELD" />
            </Divider>
            <TextField
                label="Name"
                variant="outlined"
                value={props.name}
                onChange={(e) => props.handleNameChange(e)}
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
                >
                    Update
                </Button>
            </div>
        </div>

    );
};

export default EditForm;