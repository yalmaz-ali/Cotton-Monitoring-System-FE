import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InputForm from "./InputForm";
import FieldForm from "./FieldForm";
import FirstForm from "./FirstForm";
import axios from 'axios';
import JobCard from "./JobCard";
import MainForm from "./MainForm";
import EditJob from "./EditJob";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingScreen from "components/LoadingScreen/index";
import Cookies from "js-cookie";

const RenderJobs = ({ farm, season }) => {

    const [openLoading, setOpenLoading] = useState(false);

    const [isMainVisible, setIsMainVisible] = useState(true);

    const [firstFormVisible, setFirstFormVisible] = useState(false);
    const [jobType, setJobType] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [dueDate, setDueDate] = useState(null);

    const [isAddingFields, setIsAddingFields] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [isAddingInput, setIsAddingInput] = useState(false);
    const [totalArea, setTotalArea] = useState(0);

    const [inputList, setInputList] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [jobIdToEdit, setJobIdToEdit] = useState(null);
    const [seasonToEdit, setSeasonToEdit] = useState(null);


    const [fields, setFields] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedFarmId, setSelectedFarmId] = useState(null);
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);

    const [isDueDateEditing, setIsDueDateEditing] = useState(false);

    const jobTypes = ["fertilizing", "harvesting", "Irrigating", "Others"];


    const fetchFields = async () => {
        setOpenLoading(true); // start loading

        try {
            await axios
                .get(`http://localhost:8000/api/field/${selectedFarmId}/${selectedSeasonId}/`, { withCredentials: true })
                .then((response) => {
                    console.log(response.data)
                    const fields = response.data.fields_data.map(field => ({
                        id: field.id,
                        name: field.name,
                        area: field.Field_Data.area,
                    }));

                    setFields(fields);
                })
                .catch((error) => {
                    console.log(error);
                });

        } catch (error) {
            console.error('Failed to fetch fields:', error);
        } finally {
            setOpenLoading(false); // stop loading
        }

    };

    const fetchJobs = async () => {
        setOpenLoading(true); // start loading

        try {
            await axios
                .get(`http://localhost:8000/api/job/getjobs/${selectedSeasonId}/`, { withCredentials: true })
                .then((response) => {
                    console.log(response.data.jobs_data);
                    setJobs(response.data.jobs_data);
                })
                .catch((error) => {
                    console.log(error);
                });

        } catch (error) {
            console.error('Failed to fetch fields:', error);
        } finally {
            setOpenLoading(false); // stop loading
        }
    };

    const DeleteJob = async (Jobid) => {
        setOpenLoading(true); // start loading

        try {
            await axios
                .delete(`http://localhost:8000/api/job/deletejob/${Jobid}/`, {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken')
                    }, withCredentials: true
                })
                .then((response) => {
                    console.log(response.data);
                    fetchJobs();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        catch (error) {
            console.error('Failed to delete job:', error);
        } finally {
            setOpenLoading(false); // stop loading
        }

    };

    useEffect(() => {
        console.log("fields: ", fields);
    }, [fields]);

    useEffect(() => {
        if (selectedSeasonId && selectedFarmId) {
            fetchFields();
            fetchJobs();
        } else {
            setFields([]);
            setJobs([]);
        }
    }, [selectedSeasonId]);

    useEffect(() => {
        setSelectedFarmId(farm);
        setSelectedSeasonId(season);
    }, [farm, season]);


    const handleAddJobClick = () => {
        setIsMainVisible(false);
        setFirstFormVisible(true);
    };


    const handleCancelClick = () => {
        setFirstFormVisible(false);
        setIsMainVisible(true);

        setJobType("");
        setJobTitle("");
        setIsDueDateEditing(false);
        setDueDate(null);
        setSelectedFields([]);
        setSelectAll(false);

        setInputList([]);
        setInputId(0);

        setIsEditing(false);
    };

    const handleSaveClick = async () => {
        setOpenLoading(true); // start loading


        const currentDate = new Date();
        const date = new Date(dueDate);
        let status, season, response;

        if (date > currentDate) {
            status = 'pending';
        } else {
            status = 'overdue';
        }

        if (isEditing) {
            season = seasonToEdit;
        } else {
            season = selectedSeasonId;
        }
        const data = {
            Job: {
                season: season,
                type: jobType,
                name: jobTitle,
                due_date: dueDate.toISOString().split('T')[0],
                due_time: `${dueDate.getHours()}:${dueDate.getMinutes()}`,
                status: status,
            },
            Job_Input: inputList.map(input => ({
                name: input.name,
                unit: input.unit,
                type: input.type,
                application_rate_per_hector: input.application_rate_per_hector,
                total: input.total,
                n1: input.n1,
                n2: input.n2,
                n3: input.n3,
                n4: input.n4,
                n5: input.n5,
                n6: input.n6,
            })),
            Job_Field: selectedFields.map(field => ({
                field: field,
            })),
        };
        console.log('data:', data);

        try {

            if (isEditing) {
                response = await axios.patch(`http://localhost:8000/api/job/patchjob/${jobIdToEdit}/`, data, {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken')
                    }, withCredentials: true
                });
            } else {
                response = await axios.post("http://localhost:8000/api/job/", data, {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken')
                    }, withCredentials: true
                });
            }

            console.log(response);
            if (response.status !== 200) {
                throw new Error('Failed to save job');
            } else {
                // const responseData = await response.json();
                console.log('Job saved:', response.data);
                fetchJobs();
            }
        } catch (error) {
            console.error('Failed to save job:', error);
        } finally {
            setOpenLoading(false); // stop loading
        }

        setJobType("");
        setJobTitle("");
        setIsDueDateEditing(false);
        setDueDate(null);
        setSelectedFields([]);
        setSelectAll(false);

        setInputList([]);
        setInputId(0);

        setFirstFormVisible(false);
        setIsMainVisible(true);

        setIsEditing(false);
    };

    const handleEditDueDateClick = () => {
        setIsDueDateEditing(true);
    };

    const handleDoneDueDateClick = () => {
        // Handle the save action for the due date here
        setIsDueDateEditing(false);
    };

    const handleAddFieldsClick = () => {
        setIsAddingFields(true);
        setFirstFormVisible(false);
    };

    const handleAddInputButtonClick = () => {
        setIsAddingInput(true);
        setFirstFormVisible(false);
    };



    const handleAddInput = (input) => {
        setInputList([...inputList, input]);
        setIsAddingInput(false);
        setFirstFormVisible(true);
    };
    const handleDeleteInput = (id) => {
        const newInputList = inputList.filter((input) => input.id !== id);
        setInputList(newInputList);
    };


    useEffect(() => {
        console.log("Input List: ", inputList);
    }, [inputList]);

    const [inputId, setInputId] = useState(0);
    const [inputName, setInputName] = useState("");
    const [selectedInputType, setSelectedInputType] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [ratePerHectare, setRatePerHectare] = useState(0);
    const [totalInput, setTotalInput] = useState(0);
    const [n1, setN1] = useState(0);
    const [n2, setN2] = useState(0);
    const [n3, setN3] = useState(0);
    const [n4, setN4] = useState(0);
    const [n5, setN5] = useState(0);
    const [n6, setN6] = useState(0);

    const handleSetRatePerHectare = (e) => {
        if (e.target.value >= 0) {
            setRatePerHectare(e.target.value);
            setTotalInput(e.target.value * totalArea);
        }
    };

    const handleAddInputConfirmClick = () => {
        // Handle the save action for the input here
        //check the selected Unit and set unit in the newInput its short form
        const selectedUnitShortForm = units.find((unit) => unit.name === selectedUnit).short_form;

        const newInput = {
            id: inputId,
            name: inputName,
            type: selectedInputType,
            application_rate_per_hector: ratePerHectare,
            unit: selectedUnitShortForm,
            total: totalInput,
            n1: n1,
            n2: n2,
            n3: n3,
            n4: n4,
            n5: n5,
            n6: n6
        };

        setInputId(inputId + 1);
        setInputName("");
        setSelectedInputType("");
        setSelectedUnit("");
        setRatePerHectare(0);
        setTotalInput(0);
        setN1(0);
        setN2(0);
        setN3(0);
        setN4(0);
        setN5(0);
        setN6(0);

        handleAddInput(newInput);
    };


    const handleAddInputCancelClick = () => {
        setInputName("");
        setSelectedInputType("");
        setSelectedUnit("");
        setRatePerHectare(0);
        setTotalInput(0);
        setN1(0);
        setN2(0);
        setN3(0);
        setN4(0);
        setN5(0);
        setN6(0);

        setIsAddingInput(false);
        setFirstFormVisible(true);
    };

    const units = [
        {
            name: "HUNDRED_WEIGHT",
            short_form: "CWT",
            conversion_factor: 50.80234544,
        },
        {
            name: "QUART",
            short_form: "QT",
            conversion_factor: 1.1365225,
        },
        {
            name: "PINT",
            short_form: "PT",
            conversion_factor: 0.56826125,
        },
        {
            name: "CUBIC_METER",
            short_form: "M3",
            conversion_factor: 1000,
        },
        {
            name: "COUNT",
            short_form: "COUNT",
            conversion_factor: 1,
        },
        {
            name: "GALLONS",
            short_form: "GAL",
            conversion_factor: 4.54609,
        },
        {
            name: "FLUID_OUNCES",
            short_form: "FL_OZ",
            conversion_factor: 0.0284130625,
        },
        {
            name: "IMPERIAL_TONS",
            short_form: "IMP_TON",
            conversion_factor: 1016.0469088,
        },
        {
            name: "POUNDS",
            short_form: "LB",
            conversion_factor: 0.45359237,
        },
        {
            name: "OUNCES",
            short_form: "OZ",
            conversion_factor: 0.028349523125,
        },
        {
            name: "LITRES",
            short_form: "L",
            conversion_factor: 1,
        },
        {
            name: "MILLILITRES",
            short_form: "ML",
            conversion_factor: 0.001,
        },
        {
            name: "METRIC_TONNES",
            short_form: "MT",
            conversion_factor: 1000,
        },
        {
            name: "KILOGRAMS",
            short_form: "KG",
            conversion_factor: 1,
        },
        {
            name: "GRAMS",
            short_form: "G",
            conversion_factor: 0.001,
        }
    ];
    const types = [
        "FERTILIZER",
        "SEED",
        "CHEMICAL",
        "FUEL",
        "LABOUR",
        "MACHINERY",
        "OTHER"
    ];




    const AddFieldsConfirmClick = (input) => {
        setSelectedFields([...input]);
        setIsAddingFields(false);
        setFirstFormVisible(true);
    }

    useEffect(() => {
        const newTotalArea = selectedFields.reduce((acc, curr) => {
            const row = fields.find((row) => row.id === curr);
            return acc + row.area;
        }, 0);

        setTotalArea(newTotalArea);
    }, [selectedFields]);


    const handleJobEditClick = (id) => {
        console.log("Edit job with id:", id);

        let job = jobs.find((job) => job.id === id);
        console.log("jobToEdit", job);

        if (Object.keys(job).length > 0) {

            let jobFields = job.job_field.map((field) => field.field);
            let dueDate = new Date(job.due_date + " " + job.due_time);

            setJobIdToEdit(job.id);
            setSeasonToEdit(job.season);
            setJobTitle(job.name);
            setJobType(job.type);

            setDueDate(dueDate);

            setSelectedFields(jobFields);

            setInputList(job.job_input);
        }

        setIsEditing(true);
        setFirstFormVisible(true);
        setIsMainVisible(false);
    };


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#eeeff2",
                width: "30%",
                height: "100%",
                boxShadow: "inset -10px 0px 10px -10px rgba(0,0,0,0.5)",
            }}
        >
            <div>
                <h1 style={{ textAlign: "center" }}>Jobs</h1>
            </div>
            {isAddingInput &&
                <InputForm
                    inputId={inputId}
                    inputName={inputName}
                    setInputName={setInputName}
                    selectedInputType={selectedInputType}
                    setSelectedInputType={setSelectedInputType}
                    selectedUnit={selectedUnit}
                    setSelectedUnit={setSelectedUnit}
                    ratePerHectare={ratePerHectare}
                    handleSetRatePerHectare={handleSetRatePerHectare}
                    totalInput={totalInput}
                    n1={n1}
                    setN1={setN1}
                    n2={n2}
                    setN2={setN2}
                    n3={n3}
                    setN3={setN3}
                    n4={n4}
                    setN4={setN4}
                    n5={n5}
                    setN5={setN5}
                    n6={n6}
                    setN6={setN6}
                    handleAddInputConfirmClick={handleAddInputConfirmClick}
                    handleAddInputCancelClick={handleAddInputCancelClick}
                    units={units}
                    types={types}
                    totalArea={totalArea}
                />
            }
            {isAddingFields &&
                <FieldForm
                    fields={fields}
                    selectedFields={selectedFields}
                    setSelectedFields={setSelectedFields}
                    AddFieldsConfirmClick={AddFieldsConfirmClick}
                    selectAll={selectAll}
                    setSelectAll={setSelectAll}
                />
            }
            {firstFormVisible &&
                <FirstForm
                    jobTypes={jobTypes}
                    jobType={jobType}
                    setJobType={setJobType}
                    jobTitle={jobTitle}
                    setJobTitle={setJobTitle}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                    isDueDateEditing={isDueDateEditing}
                    setIsDueDateEditing={setIsDueDateEditing}
                    handleEditDueDateClick={handleEditDueDateClick}
                    handleDoneDueDateClick={handleDoneDueDateClick}
                    handleAddFieldsClick={handleAddFieldsClick}
                    handleAddInputButtonClick={handleAddInputButtonClick}
                    handleDeleteInput={handleDeleteInput}
                    handleCancelClick={handleCancelClick}
                    handleSaveClick={handleSaveClick}
                    totalArea={totalArea}
                    selectedFields={selectedFields}
                    fields={fields}
                    inputList={inputList}
                    isEditing={isEditing}
                />
            }
            {isMainVisible &&
                <MainForm
                    jobs={jobs}
                    DeleteJob={DeleteJob}
                    handleEditJobClick={handleJobEditClick}
                    handleAddJobClick={handleAddJobClick}
                />
            }
            <LoadingScreen
                openLoading={openLoading}
            />
        </div >
    );
};

export default RenderJobs;
