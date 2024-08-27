import React, { useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './index.css';

interface Option {
  selected: boolean;
  text: string;
  value: string;
}

interface SelectFieldProps {
  options: Option[];
  value?: string;
  updateSelect: (value: string, index: number) => void;
  index: number;
}

const SelectField: React.FC<SelectFieldProps> = ({ options, value, updateSelect, index }) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string;
    updateSelect(selectedValue, index); // Pass the value and index to the parent handler
  };

  return (
    <div>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        className='selectFieldContainer simple-input-field'

      >
        {options.map((option) => (
          <MenuItem key={option.value}
          className='simple-input-field'
          value={option.value}>{option.text}</MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default SelectField;
