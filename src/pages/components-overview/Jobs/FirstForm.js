import React, { useEffect, useState } from "react";
import {
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import axios from "axios";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
    LocalizationProvider,
    DesktopDatePicker,
    TimePicker,
} from '@mui/x-date-pickers';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#53b84d',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
}));

function FirstForm(props) {
    useEffect(() => {
        console.log("props.selectedFields", props.selectedFields);
        console.log("props.fields", props.fields);
    }, [props.selectedFields, props.fields])

    return (
        <div style={{
            overflowY: "auto",
            position: "relative",
            flex: 1,
        }}>
            <div style={{
                padding: "16px",
            }}>

                <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                        value={props.jobType}
                        onChange={(e) => props.setJobType(e.target.value)}
                    >
                        {props.jobTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <br />

                <FormControl fullWidth style={{ marginTop: "16px" }}>
                    <TextField
                        value={props.jobTitle}
                        onChange={(e) => props.setJobTitle(e.target.value)}
                        placeholder="Enter job title"
                    />
                </FormControl>
                <br />

                <div style={{
                    marginTop: "16px",
                    padding: "8px",
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: "lightgray",
                }}>
                    <Typography variant="h3">
                        Fields
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.handleAddFieldsClick}
                    >
                        ADD FIELDS
                    </Button>
                </div>

                <Paper sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: "0px"
                }}>
                    <TableContainer sx={{ maxHeight: 200 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>NAME</StyledTableCell>
                                    <StyledTableCell align="right">AREA</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.selectedFields.length > 0 ? (
                                    props.selectedFields.map((selectedId) => {
                                        const row = props.fields.find((row) => row.id === selectedId);
                                        return (
                                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.area}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            -------
                                        </TableCell>
                                        <TableCell align="right">
                                            -------
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow sx={{ position: 'sticky', bottom: 0, backgroundColor: '#fafafa' }}>
                                    <TableCell component="th" scope="row">
                                        Total (Ha)
                                    </TableCell>
                                    <TableCell align="right">
                                        {props.totalArea.toFixed(3)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Paper>
                <br />

                <div style={{
                    marginTop: "16px",
                    padding: "8px",
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: "lightgray",
                }}>
                    <Typography variant="h3">
                        Inputs
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.handleAddInputButtonClick}
                    >
                        ADD INPUTS
                    </Button>
                </div>

                <Paper sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: "0px"
                }}>
                    <TableContainer sx={{ maxHeight: 200 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>NAME</StyledTableCell>
                                    <StyledTableCell align="right">TYPE</StyledTableCell>
                                    <StyledTableCell align="right">Rate/HA</StyledTableCell>
                                    <StyledTableCell align="right">TOTAL</StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.inputList.length > 0 ? (
                                    props.inputList.map((input) => {
                                        return (
                                            <TableRow key={input.id}>
                                                <TableCell component="th" scope="row">
                                                    {input.name}
                                                </TableCell>
                                                <TableCell >{input.type}</TableCell>
                                                <TableCell >{input.application_rate_per_hector}</TableCell>
                                                <TableCell >{input.total}</TableCell>
                                                <TableCell align="right" onClick={() => props.handleDeleteInput(input.id)}>
                                                    <ClearSharpIcon
                                                        style={{
                                                            color: "red",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            ------
                                        </TableCell>
                                        <TableCell>
                                            ------
                                        </TableCell>
                                        <TableCell >
                                            ------
                                        </TableCell>
                                        <TableCell >
                                            ------
                                        </TableCell>
                                        <TableCell >
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                {
                    props.isDueDateEditing ? (
                        <div style={{
                            padding: "16px",
                            display: "inline-grid"
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="Select Date"
                                    value={props.dueDate}
                                    onChange={(newDate) => props.setDueDate(newDate)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <br />
                                <TimePicker
                                    label="Select Time"
                                    value={props.dueDate}
                                    onChange={(newDate) => props.setDueDate(newDate)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <Button style={{ marginTop: "10px" }} variant="contained" color="primary" onClick={props.handleDoneDueDateClick}>
                                    Done
                                </Button>
                            </LocalizationProvider>
                        </div>
                    ) : (
                        <div style={{
                            alignItems: "center",
                            marginTop: "16px",
                            padding: "8px",
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: "lightgray",
                        }}>
                            <div>
                                <Typography
                                    variant="subtitle1"
                                >
                                    Due Date
                                </Typography>
                                <Typography>
                                    {props.dueDate ? props.dueDate.toDateString() : "Not Set"}
                                </Typography>
                            </div>
                            <Button variant="contained" color="primary" onClick={props.handleEditDueDateClick}>
                                Edit
                            </Button>
                        </div>
                    )
                }
            </div >
            <div style={{
                position: "sticky",
                bottom: "0px",
                zIndex: 2,
                backgroundColor: "#eeeff2",
                padding: "10px",
                boxShadow: "0px -10px 10px -10px rgba(0,0,0,0.5)",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={props.handleCancelClick}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.handleSaveClick}
                        disabled={
                            props.jobType === "" ||
                            props.jobTitle === "" ||
                            props.selectedFields.length === 0 ||
                            props.inputList.length === 0 ||
                            props.dueDate === null
                        }
                        style={
                            props.jobType === "" ||
                                props.jobTitle === "" ||
                                props.selectedFields.length === 0 ||
                                props.inputList.length === 0 ||
                                props.isDueDateEditing
                                ? { backgroundColor: "lightgray", color: "gray", boxShadow: "none" }
                                : {}
                        }
                    >
                        {props.isEditing ? "Update" : "Save"}
                    </Button>
                </div>
            </div>
        </div >
    )
};
export default FirstForm;