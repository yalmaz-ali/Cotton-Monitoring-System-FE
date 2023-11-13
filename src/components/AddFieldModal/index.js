import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";

function FieldModal({ open, onClose, onSubmit }) {
    const [fieldName, setFieldName] = useState("");

    const handleFieldNameChange = (event) => {
        setFieldName(event.target.value);
    };

    const handleFieldSubmission = () => {
        // Your submission logic here
        console.log(fieldName);
        onSubmit(fieldName);
        onClose(); // Close the dialog after submission
    };

    useEffect(() => {
        if (!open) {
            // Reset the fieldName only when the dialog is opened
            setFieldName("");
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add a New Field</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the name of the field.
                </DialogContentText>
                <TextField
                    label="Field Name"
                    value={fieldName}
                    onChange={handleFieldNameChange}
                    fullWidth
                    style={{ marginTop: 5 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleFieldSubmission} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FieldModal;
