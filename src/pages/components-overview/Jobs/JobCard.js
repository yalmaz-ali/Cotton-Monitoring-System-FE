import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";


function JobCard(props) {
    let job = props.job;
    let key = props.job.id;

    // const [isExpanded, setIsExpanded] = useState(false);

    const handleDeleteJobClick = (id) => {
        console.log("Delete job with id:", id);

        const confirmDelete = window.confirm("Are you sure you want to delete this field?");

        if (confirmDelete) {
            // Send a request to delete the field to your backend
            props.DeleteJob(id); // Replace with the actual field identifier (ID or something)
        }
    };
    const handleEditClick = (id) => {
        console.log("Edit job with id:", id);
        props.EditClick(id);
    };

    return (
        <Card
            key={key}
            sx={{
                margin: "8px",
                boxShadow: "0px 0px 10px -10px rgba(0,0,0,0.5)",
                minHeight: "200px",
            }}
        >
            <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5" component="div">
                        {job.name}
                    </Typography>
                    {job.status === "pending" && (
                        <Typography variant="h5" component="div">
                            Pending
                        </Typography>
                    )}
                    {job.status === "overdue" && (
                        <Typography variant="h5" component="div"
                            style={{ color: "red" }}
                        >
                            Overdue
                        </Typography>
                    )}
                </div>
                <Typography variant="subtitle1" component="div">
                    {job.type}
                </Typography>
                <Typography variant="subtitle1" component="div">
                    {job.note}
                </Typography>
                <Typography variant="subtitle1" component="div">
                    {job.due_date}
                </Typography>
                <Typography variant="subtitle1" component="div">
                    {job.due_time}
                </Typography>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDeleteJobClick(job.id)}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(job.id)}
                >
                    Edit
                </Button>
            </div>
        </Card>
    );
};

export default JobCard;