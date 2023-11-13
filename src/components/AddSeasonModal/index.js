import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";
import Cookies from "js-cookie";
// import MDSnackbar from "components/MDSnackbar";
import PropTypes from "prop-types";

function AddSeasonModal({ open, onClose, selectedFarm, seasonAdded }) {
    const [SeasonName, setSeasonName] = useState("");
    const [StartDate, setStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    const [CopyFields, setCopyFields] = useState(false);

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
            // console.log(selectedFarmId);
            // Reset the field values only when the dialog is opened
            setSeasonName("");
            setStartDate(null);
            setEndDate(null);
            setCopyFields(false);
        }
    }, [open]);


    // const renderSuccessSB = (
    //     <MDSnackbar
    //         color="success"
    //         icon="check"
    //         title="Season Added"
    //         content="Your Season is added!"
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
    //         content="Your Season is not added please try again!"
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
    //         content="Please Enter Season Name!"
    //         // dateTime="11 mins ago"
    //         open={warningSB}
    //         onClose={closeWarningSB}
    //         close={closeWarningSB}
    //         bgWhite
    //     />
    // );


    const handleSeasonNameChange = (event) => {
        setSeasonName(event.target.value);
    };

    const handleAddSeason = () => {
        let copy_fields = "False";

        if (CopyFields) {
            copy_fields = "True";
        }
        console.log("copy_fields", copy_fields);
        if (SeasonName !== "" && selectedFarm) {
            const data = {
                name: SeasonName,
                farm: selectedFarm.id,
                start_date: StartDate ? StartDate.toISOString().split('T')[0] : null,
                end_date: EndDate ? EndDate.toISOString().split('T')[0] : null,
                copy_fields: copy_fields,
            };
            console.log("data", data);

            axios.post("http://localhost:8000/api/season/", data, { withCredentials: true })
                .then((response) => {
                    openSuccessSB();
                    console.log(response.data);
                    seasonAdded(true);
                    onClose(); // Close the modal
                })
                .catch((error) => {
                    // Handle error
                    openErrorSB();
                    onClose();
                    seasonAdded(false);
                    console.error("Error adding Season:", error);
                });
        }
        else {
            openWarningSB();
            onClose();
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Add a New Season</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details for the new Season.
                    </DialogContentText>
                    <TextField
                        sx={{ width: 420, marginTop: "10px" }}
                        label="Season Name"
                        value={SeasonName}
                        onChange={handleSeasonNameChange}
                        fullWidth
                    />
                    <div style={{ marginTop: "10px" }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                sx={{ width: 200 }}
                                label="Start Date"
                                value={StartDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                sx={{ width: 200, marginLeft: "20px" }}
                                label="End Date"
                                value={EndDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <FormControlLabel
                        control={<Checkbox checked={CopyFields} onChange={(event) => setCopyFields(event.target.checked)} />}
                        // label={`Copy Fields from ${selectedFarm.name}`}
                        label={`Copy Fields from ${selectedFarm ? selectedFarm.name : 'none'}`}

                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddSeason} color="primary">
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

// AddSeasonModal.propTypes = {
//     selectedFarmId: PropTypes.number
// };

export default AddSeasonModal;
