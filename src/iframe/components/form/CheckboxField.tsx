import { Checkbox } from 'antd';
import React from 'react';
import './index.css';


type CheckboxData = {
  checked: boolean;
  label: string;
  name: string;
};

interface CheckboxFieldProps {
  checkboxes: CheckboxData[];
  onUpdate: (checkboxes: CheckboxData[]) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  checkboxes,
  onUpdate
}) => {

  const handleChange = (index: number) => (e: any) => {
    const checked = e.target.checked;
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].checked = checked;
    onUpdate(newCheckboxes);

    chrome.runtime.sendMessage({
      action: "checkboxChanged",
      data: { name: checkboxes[index].name, value: checked }
    });
  };


  return (
    <div>
      {checkboxes.map((checkbox, index) => (
        <div key={index}>
          <Checkbox
            checked={checkbox.checked}
            onChange={handleChange(index)} // Pass the index to the handleChange function
            className='checkboxContainer'
            name={checkbox.name}>
            {checkbox.label}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};

export default CheckboxField;
