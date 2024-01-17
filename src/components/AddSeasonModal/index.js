import React, { useState, useEffect, useCallback } from "react";
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingScreen from "../LoadingScreen/index";
import Cookies from "js-cookie";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddSeasonModal({ open, onClose, selectedFarm, seasonAdded, seasonNumber }) {
    const [SeasonName, setSeasonName] = useState("");
    const [StartDate, setStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    const [CopyFields, setCopyFields] = useState(false);

    const [openLoading, setOpenLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });

    const openSnackbar = (type, message) => setSnackbar({ open: true, type, message });
    const closeSnackbar = () => setSnackbar({ open: false, type: "", message: "" });

    useEffect(() => {
        if (!open) {
            // Reset the field values only when the dialog is opened
            setSeasonName("");
            setStartDate(null);
            setEndDate(null);
            setCopyFields(false);
        }
    }, [open]);


    const handleSeasonNameChange = useCallback((event) => {
        setSeasonName(event.target.value);
    }, []);

    const handleAddSeason = useCallback(() => {
        onClose();
        setOpenLoading(true);
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

            axios.post("http://localhost:8000/api/season/", data, {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken')
                }, withCredentials: true
            })
                .then((response) => {
                    openSnackbar("success", "Season Added!");
                    console.log(response.data);
                    seasonAdded(true);
                    setOpenLoading(false);
                })
                .catch((error) => {
                    openSnackbar("error", "Error adding Season!");
                    seasonAdded(false);
                    console.error("Error adding Season:", error);
                    setOpenLoading(false);
                });
        }
        else {
            openSnackbar("warning", "Please Enter Season Name!");
            setOpenLoading(false);
        }
    }, [SeasonName, selectedFarm, StartDate, EndDate, CopyFields]);

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
                                inputFormat="MM/dd/yyyy"
                                componentsProps={{
                                    input: { variant: 'outlined' }
                                }}
                            />
                            <DatePicker
                                sx={{ width: 200, marginLeft: "20px" }}
                                label="End Date"
                                value={EndDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                inputFormat="MM/dd/yyyy"
                                componentsProps={{
                                    input: { variant: 'outlined' }
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                    {seasonNumber > 0 &&
                        <FormControlLabel
                            control={<Checkbox checked={CopyFields} onChange={(event) => setCopyFields(event.target.checked)} />}
                            // label={`Copy Fields from ${selectedFarm.name}`}
                            label={`Copy Fields from ${selectedFarm ? selectedFarm.name : 'none'}`}

                        />
                    }
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
            <LoadingScreen openLoading={openLoading} />
        </>
    );
}

export default React.memo(AddSeasonModal);
