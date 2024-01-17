import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddFarmModal({ open, onClose, farmAdded }) {
    const [farmName, setFarmName] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });

    const openSnackbar = (type, message) => setSnackbar({ open: true, type, message });
    const closeSnackbar = () => setSnackbar({ open: false, type: "", message: "" });

    const handleFarmNameChange = (event) => {
        setFarmName(event.target.value);
    };

    const handleAddFarm = async () => {
        if (farmName !== "") {
            try {
                const response = await axios.post("http://localhost:8000/api/farm/", { name: farmName }, {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken')
                    }, withCredentials: true
                });
                openSnackbar("success", "Farm Added!");
                onClose(); // Close the modal
                setFarmName(""); // Clear the input field
                farmAdded(true);
            } catch (error) {
                // Handle error
                openSnackbar("error", "Your Farm is not added please try again!");
                onClose();
                farmAdded(false);
            }
        } else {
            openSnackbar("warning", "Please Enter Farm Name!");
            onClose();
        }
    };

    useEffect(() => {
        if (!open) {
            // Reset the fieldName only when the dialog is opened
            setFarmName("");
        }
    }, [open]);

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Add a New Farm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name of the new farm.
                    </DialogContentText>
                    <TextField
                        style={{ marginTop: "5px" }}
                        label="Farm Name"
                        value={farmName}
                        onChange={handleFarmNameChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddFarm} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                key={snackbar.type}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.type} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddFarmModal;