import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import JobCard from "./JobCard";

function MainForm(props) {
    return (
        <div style={{
            overflowY: "auto",
            position: "relative",
            flex: 1
        }}>
            {props.jobs.length > 0 ?
                <div style={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                }}>
                    {props.jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            DeleteJob={props.DeleteJob}
                            EditClick={props.handleEditJobClick}
                        />
                    ))}
                </div>
                :
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "calc(100% - 50px)",
                }}>
                    <h3>
                        No Jobs
                    </h3>
                </div>
            }
            <div style={{
                position: "sticky",
                bottom: "0px",
                backgroundColor: "#eeeff2",
                display: "flex",
                justifyContent: "center",
                zIndex: 2,
                boxShadow: "1px -3px 10px -10px rgba(0,0,0,0.5)"
            }}>
                <Button
                    variant="contained"
                    fullWidth
                    style={{
                        margin: "5px",
                        color: "white",
                    }}
                    onClick={props.handleAddJobClick}
                >
                    <AddIcon />
                    <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                        Field Job
                    </Typography>
                </Button>
            </div>
        </div>
    )
}
export default MainForm;