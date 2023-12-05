import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Cookies from "js-cookie";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function AddFarmModal({ open, onClose, farmAdded }) {
    const [farmName, setFarmName] = useState("");

    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [warningSB, setWarningSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const openWarningSB = () => setWarningSB(true);
    const closeWarningSB = () => setWarningSB(false);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const renderSuccessSB = (
        <Snackbar
            open={successSB}
            autoHideDuration={4000}
            onClose={closeSuccessSB}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            key={'success'}
            close={closeSuccessSB}
        >
            <Alert onClose={closeSuccessSB} severity="success" sx={{ width: '100%' }}>
                Farm Added!
            </Alert>
        </Snackbar>
    );

    const renderErrorSB = (
        <Snackbar
            open={errorSB}
            autoHideDuration={4000}
            onClose={closeErrorSB}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            key={'error'}
            close={closeErrorSB}
        >
            <Alert onClose={closeErrorSB} severity="error" sx={{ width: '100%' }}>
                Your Farm is not added please try again!
            </Alert>
        </Snackbar>
    );

    const renderWarningSB = (
        <Snackbar
            open={warningSB}
            autoHideDuration={4000}
            onClose={closeWarningSB}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            key={'warning'}
            close={closeWarningSB}
        >
            <Alert onClose={closeWarningSB} severity="warning" sx={{ width: '100%' }}>
                Please Enter Farm Name!
            </Alert>
        </Snackbar>
    );



    const handleFarmNameChange = (event) => {
        setFarmName(event.target.value);
    };

    const handleAddFarm = async () => {
        const jwtcookie = Cookies.get("jwt");
        console.log("jwtcookie", jwtcookie);

        const jwtToken = localStorage.getItem("jwtToken");
        console.log("jwtToken", jwtToken);

        if (farmName !== "") {
            try {
                const response = await axios.post("http://localhost:8000/api/farm/", { name: farmName }, { withCredentials: true });
                openSuccessSB();
                console.log(response.data);
                onClose(); // Close the modal
                setFarmName(""); // Clear the input field
                farmAdded(true);
            } catch (error) {
                // Handle error
                openErrorSB();
                onClose();
                farmAdded(false);
                console.error("Error adding farm:", error);
            }
        } else {
            openWarningSB();
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
            {renderSuccessSB}
            {renderErrorSB}
            {renderWarningSB}
        </>
    );
}

export default AddFarmModal;
