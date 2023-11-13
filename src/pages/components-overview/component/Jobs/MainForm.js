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
            <div style={{
                display: "flex",
                minHeight: "90%",
                flexDirection: "column",
                padding: "10px"
            }}>

                {props.jobs.length > 0 ?
                    props.jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            DeleteJob={props.DeleteJob}
                            EditClick={props.handleEditJobClick}
                        />
                    ))
                    :
                    <h3
                        style={{
                            color: "#9e9e9e",
                            textAlign: "center",
                            margin: "0px",
                            padding: "0px",
                            marginTop: "20px"
                        }}
                    > No JOBS
                    </h3>
                }
            </div>

            <div style={{
                position: "sticky",
                bottom: "0px",
                backgroundColor: "#eeeff2",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                zIndex: 2,
                boxShadow: "1px -3px 10px -10px rgba(0,0,0,0.5)"
            }}>
                <Button variant="contained" color="error" style={{ borderRadius: "5%" }} onClick={props.handleAddJobClick}>
                    <AddIcon />
                    <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                        FIELD JOB
                    </Typography>
                </Button>
            </div>
        </div>
    )
}
export default MainForm;