import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useEffect } from 'react';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const KmlModal = (props) => {

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("file", file);
        const validType = file.name.endsWith('.kml');
        const maxSize = 10 * 1024 * 1024; // 10 MB

        if (file && validType && file.size <= maxSize) {
            props.setFile(file);
            // Handle the uploaded file here
        } else {
            // Handle the invalid file here
            alert('Invalid file. Please select a .kml file that is less than 1 GB.');
        }
    };

    const dropArea = document.getElementById('drop-area');

    if (dropArea) {
        dropArea.addEventListener('dragover', (event) => {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });

        dropArea.addEventListener('drop', (event) => {
            event.stopPropagation();
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            console.log("fileDropped", file);
            const validType = file.name.endsWith('.kml');
            const maxSize = 10 * 1024 * 1024; // 10 MB

            if (file && validType && file.size <= maxSize) {
                props.setFile(file);
                // Handle the uploaded file here
            } else {
                // Handle the invalid file here
                alert('Invalid file. Please select a .kml file that is less than 1 GB.');
            }
        });
    }

    return (
        <>
            <Dialog
                open={props.isUpload}
                onClose={props.handleCloseUpload}
                PaperProps={{
                    style: {
                        borderRadius: "8px",
                    },
                }}
            >
                <DialogTitle
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",

                    }}
                >
                    Upload File
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Please upload a file with .kml extension
                    </Typography>
                    <div
                        style={{
                            backgroundColor: "whitesmoke",
                            padding: "10px",
                            marginTop: "10px",
                            marginBottom: "10px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "100%",
                            height: "200px",
                            borderRadius: "8px"
                        }}
                    >
                        <Box
                            id="drop-area"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                '& > :not(style)': { m: 1 },
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "2px dashed lightgrey",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h5"
                                >
                                    Drag and drop file here
                                </Typography>
                                <Typography variant="body2">
                                    10 MB Max
                                </Typography>
                            </Box>
                            <UploadFileOutlinedIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Button component="label" variant="contained">
                                    Upload file
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept=".kml"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {props.file && (
                                    <Typography variant="body1">
                                        {props.file.name}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleCloseUpload} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={props.handleFileUpload} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default KmlModal;