import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { SearchOutlined, CloseOutlined } from '@mui/icons-material';
import { useState } from 'react';

const Search = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          startAdornment={
            inputValue === '' && (
              <InputAdornment position="start" sx={{ mr: -0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            )
          }
          endAdornment={
            inputValue !== '' && (
              <InputAdornment
                position="end"
                sx={{ mr: -0.9, cursor: 'pointer' }}
              >
                <CloseOutlined
                  fontSize="small"
                  onClick={handleClearInput} />
              </InputAdornment>
            )
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'weight',
          }}
          placeholder="Search a place"
          value={inputValue}
          onChange={handleInputChange}
        />
        <style>
          {`
            .pac-container {
              z-index: 1202 !important;
              box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3) !important;
          `}
        </style>
      </FormControl>
    </Box>
  );
};

export default Search;