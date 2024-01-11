import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import { FormControl, InputLabel, TableRow, TableCell } from '@mui/material';


function InputForm(props) {
    return (
        <div style={{
            flex: 1,
            overflowY: "auto",
            position: "relative",
        }}>
            <div style={{ padding: "16px" }}>
                <h3 style={{
                    textAlign: "center",
                }}>Add Inputs to this Job</h3>
            </div>
            <div style={{
                key: props.inputId,
                padding: "16px",
                minHeight: "calc(100% - 147px)",
            }}>
                <FormControl
                    style={{
                        margin: "10px",
                        width: "calc(100% - 20px)",
                    }}
                >
                    <TextField
                        label="Name"
                        variant="outlined"
                        value={props.inputName}
                        onChange={(e) => props.setInputName(e.target.value)}
                        placeholder="Enter input name"
                    />
                </FormControl>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        margin: "10px 0px",
                    }}
                >
                    <FormControl
                        variant="outlined"
                        style={{
                            width: "calc(50% - 10px)",
                        }}
                    >
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={props.selectedInputType}
                            onChange={(e) => props.setSelectedInputType(e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: '200px',  // Adjust this value as needed
                                        overflow: 'auto'
                                    },
                                },
                            }}
                        >
                            {props.types.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ width: "calc(50% - 10px)" }}>
                        <InputLabel>Unit</InputLabel>
                        <Select
                            // onClick={handleMenuClick}
                            value={props.selectedUnit}
                            onChange={(e) => props.setSelectedUnit(e.target.value)}
                            // displayEmpty
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: '200px',  // Adjust this value as needed
                                        overflow: 'auto'
                                    },
                                },
                            }}
                        >
                            {props.units.map((unit) => (
                                <MenuItem key={unit.name} value={unit.name}>
                                    {unit.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle1" component="div">
                            FIELD JOB AREA
                        </Typography>
                    </TableCell>
                    <TableCell align="right">
                        {props.totalArea}Ha
                    </TableCell>
                </TableRow>
                <br />
                <TableRow>
                    <TableCell>
                        <TextField
                            label="Rate per Ha"
                            variant="outlined"
                            type="number"
                            value={props.ratePerHectare}
                            onChange={props.handleSetRatePerHectare}
                            disabled={props.selectedUnit === "" || props.totalArea === 0}
                            inputProps={{ min: 0 }}
                        />
                        <Typography variant="subtitle2" component="div">
                            {props.selectedUnit === "" ? "" : `(${props.units.find((unit) => unit.name === props.selectedUnit).short_form})`}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="Total"
                            variant="outlined"
                            type="number"
                            value={props.totalInput}
                            disabled
                        />
                        <Typography variant="subtitle2" component="div">
                            {props.selectedUnit === "" ? "" : `(${props.units.find((unit) => unit.name === props.selectedUnit).short_form})`}
                        </Typography>
                    </TableCell>
                </TableRow>
                {props.totalArea === 0 ? (
                    <Typography variant="subtitle2" component="div" style={{ color: "red" }}>
                        Please select any fields to add inputs
                    </Typography>
                ) : (
                    <></>
                )}
                {props.selectedInputType === "FERTILIZER" && props.totalArea !== 0 ? (
                    <div>
                        <h3 style={{
                            textAlign: "center",
                        }}>Nutrient Content</h3>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="N %"
                                    variant="outlined"
                                    type="number"
                                    value={props.n1}
                                    onChange={(e) => props.setN1(e.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="P - P2O5 %"
                                    variant="outlined"
                                    type="number"
                                    value={props.n2}
                                    onChange={(e) => props.setN2(e.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="K - K2O %"
                                    variant="outlined"
                                    type="number"
                                    value={props.n3}
                                    onChange={(e) => props.setN3(e.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="Na - Na2O %"
                                    variant="outlined"
                                    type="number"
                                    value={props.n4}
                                    onChange={(e) => props.setN4(e.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="MgO %"
                                    variant="outlined"
                                    type="number"
                                    value={props.n5}
                                    onChange={(e) => props.setN5(e.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="S - SO3 %"
                                    variant="outlined"
                                    type="number"
                                    value={props.n6}
                                    onChange={(e) => props.setN6(e.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                            </TableCell>
                        </TableRow>
                    </div>
                ) : (
                    <></>
                )}
            </div>
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
                        onClick={props.handleAddInputCancelClick}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.handleAddInputConfirmClick}
                        disabled={
                            props.inputName === "" ||
                            props.selectedInputType === "" ||
                            props.selectedUnit === "" ||
                            props.ratePerHectare === 0 ||
                            props.totalInput === 0
                        }
                        style={
                            props.inputName === "" ||
                                props.selectedInputType === "" ||
                                props.selectedUnit === "" ||
                                props.ratePerHectare === 0 ||
                                props.totalInput === 0
                                ? { backgroundColor: "lightgray", color: "gray", boxShadow: "none" }
                                : {}
                        }
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div >
    );
}

export default InputForm;