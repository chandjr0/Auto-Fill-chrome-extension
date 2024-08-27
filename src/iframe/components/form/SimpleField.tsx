import React from 'react';
import { Input, Tooltip, message } from 'antd';
import './index.css';
import copyIcon from '../../../assets/images/copy.svg';

interface SimpleFieldProps {
    value?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SimpleField: React.FC<SimpleFieldProps> = ({ handleChange, value }) => {
    // Function to handle the copy action
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            
            message.success('Copied to clipboard'); // Show success message
        } catch (error) {
            console.log(error)
            message.error('Failed to copy'); // Show error message
        }
    };

    // Function to render input with a copy icon
    const renderInputWithCopy = () => (
        <>
            <Input
                value={value}
                onChange={handleChange}
                className='simple-input-field'
                suffix={
                    <Tooltip title="Copy">
                        <img
                            src={copyIcon}
                            alt="Copy"
                            onClick={(e) => {
                                e.preventDefault();
                                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                                handleCopy(input.value);
                            }}
                            style={{ cursor: 'pointer', width: '21px', height: '21px' }}
                        />
                    </Tooltip>
                }
            />
        </>
    );

    return (
        <div>
            {renderInputWithCopy()}
        </div>
    );
};

export default SimpleField;
