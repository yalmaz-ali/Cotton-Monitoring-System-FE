
import React, { useEffect, useState } from "react";
import { TextField, Button, Divider, Chip } from "@mui/material";
import FirstForm from "./FirstForm";

function EditJob(props) {
    let jobId = props.jobIdToEdit;
    let jobs = props.jobs;

    const response = {
        "id": 1,
        "name": "Job 1",
        "type": "fertilizing",
        "note": "Job 1",
        "due_date": "2021-10-20",
        "due_time": "10:00:00",
        "status": "pending",
        "season": 1,
        "job_field": [
            {
                "id": 1,
                "job": 1,
            },
            {
                "id": 2,
                "job": 1,
            }
        ],
        "job_input": [
            {
                "name": "Urea",
                "total": 100,
                "unit": "kg",
                "application_rate_per_hector": 100,
                "job": 1,
                "n1": 46,
                "n2": 0,
                "n3": 0,
                "n4": 0,
                "n5": 0,
                "n6": 0
            },
            {
                "name": "DAP",
                "total": 100,
                "unit": "kg",
                "application_rate_per_hector": 100,
                "job": 1,
                "n1": 18,
                "n2": 46,
                "n3": 0,
                "n4": 0,
                "n5": 0,
                "n6": 0
            }
        ]
    }
    const [job, setJob] = useState({});

    useEffect(() => {
        let jobToEdit = jobs.find((job) => job.id === jobId);
        console.log("jobToEdit", jobToEdit);
        setJob(jobToEdit);
    }, [jobId])

    const [jobName, setJobName] = useState("");
    const [jobType, setJobType] = useState("");
    const [jobNote, setJobNote] = useState("");
    const [jobDueDate, setJobDueDate] = useState("");
    const [jobDueTime, setJobDueTime] = useState("");
    const [jobStatus, setJobStatus] = useState("");
    const [jobSeason, setJobSeason] = useState("");

    const [jobFields, setJobFields] = useState([]);
    const [jobInputs, setJobInputs] = useState([]);

    useEffect(() => {
        if (Object.keys(job).length > 0) {

            let jobFields = job.job_field.map((field) => field.id);

            setJobName(job.name);
            setJobType(job.type);
            setJobNote(job.note);
            setJobDueDate(job.due_date);
            setJobDueTime(job.due_time);
            setJobStatus(job.status);
            setJobSeason(job.season);
            setJobFields(jobFields);
            setJobInputs(job.job_input);
        }
    }, [job]);


    return (
        <>
            <FirstForm
                jobTypes={props.jobTypes}
                jobType={jobType}
                setJobType={setJobType}
                jobTitle={jobName}
                setJobTitle={setJobName}
                dueDate={jobDueDate}
                setDueDate={setJobDueDate}
                isDueDateEditing={true}
                setisDueDateEditing={null}
                handleEditDueDateClick={null}
                handleDoneDueDateClick={null}
                handleAddFieldsClick={null}
                handleAddInputButtonClick={null}
                handleDeleteInput={null}
                handleCancelClick={null}
                handleSaveClick={null}
                totalArea={null}
                selectedFields={jobFields}
                fields={props.fields}
                inputList={jobInputs}
            />
        </>
    );
};

export default EditJob;