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
// import MDSnackbar from "components/MDSnackbar";

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

    useEffect(() => {
        if (!open) {
            // Reset the fieldName only when the dialog is opened
            setFarmName("");
        }
    }, [open]);

    // const renderSuccessSB = (
    //     <MDSnackbar
    //         color="success"
    //         icon="check"
    //         title="Farm Added"
    //         content="Your Farm is added!"
    //         // dateTime="11 mins ago"
    //         open={successSB}
    //         onClose={closeSuccessSB}
    //         close={closeSuccessSB}
    //         bgWhite
    //     />
    // );

    // const renderErrorSB = (
    //     <MDSnackbar
    //         color="error"
    //         icon="warning"
    //         title="Error"
    //         content="Your Farm is not added please try again!"
    //         // dateTime="11 mins ago"
    //         open={errorSB}
    //         onClose={closeErrorSB}
    //         close={closeErrorSB}
    //         bgWhite
    //     />
    // );

    // const renderWarningSB = (
    //     <MDSnackbar
    //         color="warning"
    //         icon="star"
    //         title="Warning"
    //         content="Please Enter Farm Name!"
    //         // dateTime="11 mins ago"
    //         open={warningSB}
    //         onClose={closeWarningSB}
    //         close={closeWarningSB}
    //         bgWhite
    //     />
    // );



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
            {/* {renderSuccessSB}
            {renderErrorSB}
            {renderWarningSB} */}
        </>
    );
}

export default AddFarmModal;
