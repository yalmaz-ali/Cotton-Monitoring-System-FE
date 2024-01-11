import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams } from 'react-router-dom';

function Calendar() {
    const navigate = useNavigate();
    const { fieldId, date } = useParams();

    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const startDate = useMemo(() => new Date(2020, 0, 4), []); // Start date is 2020-01-04

    const shouldDisableDate = useCallback((date) => {
        const diffTime = Math.abs(date - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays % 5 !== 0;
    }, [startDate]);

    useEffect(() => {
        if (!date) {
            // If date is not present in URL, set today's date
            let today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            console.log("today", today);
            // Find the closest previous not disabled date
            while (shouldDisableDate(today)) {
                today.setDate(today.getDate() - 1);
            }

            setSelectedDate(today);
            navigate(`/Field/${fieldId}/${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`, { replace: true });
        } else {
            // If date is present in URL, set the selected date
            const [year, month, day] = date.split('-').map(Number);
            const parsedDate = new Date(year, month - 1, day);
            setSelectedDate(parsedDate);
        }
    }, [date, fieldId, navigate, shouldDisableDate]);

    const handleDateChange = useCallback((newDate) => {
        setSelectedDate(newDate);
        const formattedDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
        navigate(`/Field/${fieldId}/${formattedDate}`, { replace: true });
    }, [fieldId, navigate]);

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
                    shouldDisableDate={shouldDisableDate}
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

export default React.memo(Calendar);