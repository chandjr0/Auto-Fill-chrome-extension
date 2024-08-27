import type { RadioChangeEvent } from 'antd';
import { Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.css';

interface Option {
    label: string;
    value: string;
    name:string;
  }
interface RadioFieldProps {
    // label: string;
    // options: Array<{label: string, value: any, input?: boolean}>;
    options: Option[];
    defaultValue?: any;
    onUpdate :(name:string,checkboxes:Option[])=>void
}


const RadioField: React.FC<RadioFieldProps> = ({ 
    //  label,
     options,
     onUpdate,
     defaultValue }) => {
    const [value, setValue] = useState(defaultValue);
    
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue])

    const onChange = (e: RadioChangeEvent) => {
        const name = options[0].name
        const updatedOptions = options.map((op) =>
          op.label === e.target.value
            ? { ...op, checked:true }
            : { ...op, checked:false }
        );
        onUpdate(name,updatedOptions)
        setValue(e.target.value);
    };
    return (
        <div>
            <Radio.Group onChange={onChange} value={value} className='radioContainer'>
                <Space direction="vertical">
                    {options.map((option) => (
                        <Radio value={option.label}      
                        className='simple-input-field'
                        key={option.label}>
                            {option.label}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
        </div>
    );
};

export default RadioField;
