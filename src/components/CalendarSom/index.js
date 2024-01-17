import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams } from 'react-router-dom';

function CalendarSom() {
    const navigate = useNavigate();
    const { SomFieldId, time } = useParams();

    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (!time) {

            let today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            setSelectedDate(today);
            navigate(`/SOM/${SomFieldId}/${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`, { replace: true });
        } else {
            // If date is present in URL, set the selected date
            const [year, month, day] = time.split('-').map(Number);
            const parsedDate = new Date(year, month - 1, day);
            setSelectedDate(parsedDate);
        }
    }, [time, SomFieldId, navigate]);

    const handleDateChange = useCallback((newDate) => {
        setSelectedDate(newDate);
        const formattedDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
        navigate(`/SOM/${SomFieldId}/${formattedDate}`, { replace: true });
    }, [SomFieldId, navigate]);

    return (
        <div style={{ minWidth: '145px' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    onAccept={handleDateChange}
                    value={selectedDate}
                    onChange={(newValue) => {
                        setSelectedDate(newValue);
                    }}
                    format="dd/MM/yyyy"
                    maxDate={new Date()}
                    minDate={new Date(2019, 0, 1)}
                    slotProps={{
                        textField: {
                            variant: 'outlined',
                        }
                    }}
                />
            </LocalizationProvider>
        </div>
    );
}

export default React.memo(CalendarSom);