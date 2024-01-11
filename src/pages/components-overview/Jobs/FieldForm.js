import React, { useState } from 'react';
import { Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


function FieldForm(props) {


    const handleSelectAllClick = () => {
        if (props.selectAll) {
            props.setSelectedFields([]);
            props.setSelectAll(false);
        } else {
            const newSelected = props.fields.map((row) => row.id);
            props.setSelectedFields(newSelected);
            props.setSelectAll(true);
        }
    };

    const handleClickSingleCheck = (id) => {
        const selectedIndex = props.selectedFields.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(props.selectedFields, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(props.selectedFields.slice(1));
        } else if (selectedIndex === props.selectedFields.length - 1) {
            newSelected = newSelected.concat(props.selectedFields.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                props.selectedFields.slice(0, selectedIndex),
                props.selectedFields.slice(selectedIndex + 1),
            );
        }

        props.setSelectedFields(newSelected);
    };

    const handleAddFieldsConfirmClick = () => {
        props.AddFieldsConfirmClick(props.selectedFields);
    };

    return (
        <div style={{
            flex: 1,
            overflowY: "auto",
            position: "relative",
        }}>
            <div style={{ padding: "16px" }}>
                <h3 style={{
                    textAlign: "center",
                }}>Attach the fields to this Job
                </h3>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ padding: "2px", minHeight: 400 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            checked={props.selectAll}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Area</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.fields.map((row) => {
                                    const isItemSelected = props.selectedFields.indexOf(row.id) !== -1;
                                    return (
                                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    onChange={() => handleClickSingleCheck(row.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.area}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
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
                        color="primary"
                        onClick={handleAddFieldsConfirmClick}
                    >
                        DONE
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default FieldForm;