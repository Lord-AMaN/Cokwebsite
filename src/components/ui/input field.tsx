import React from 'react';
import styled from 'styled-components';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <StyledWrapper>
      <div className="inputGroup">
        <input id={inputId} required autoComplete="off" {...props} />
        <label htmlFor={inputId}>{label}</label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .inputGroup {
    font-family: inherit;
    margin: 0;
    width: 100%;
    position: relative;
  }

  .inputGroup input {
    font-size: 15px;
    padding: 0.875rem 1rem;
    outline: none;
    border: 1px solid #333;
    /* Set to transparent so it inherits the form container's background */
    background-color: transparent; 
    color: white;
    border-radius: 21px;
    width: 100%;
    transition: border-color 0.3s ease;
  }

  .inputGroup label {
    font-size: 15px;
    position: absolute;
    left: 0;
    padding: 0.875rem 1rem;
    pointer-events: none;
    transition: all 0.3s ease;
    color: #777;
  }

  .inputGroup :is(input:focus, input:valid)~label {
    transform: translateY(-50%) scale(0.85);
    margin: 0;
    margin-left: 0.8em;
    padding: 0 0.4em;
    /* Perfectly matches the Checkout page container background */
    background-color: #161616;
    color: #a3a3a3;
  }

  .inputGroup :is(input:focus) {
    border-color: #3e95ff;
  }
  
  .inputGroup :is(input:focus)~label {
    color: #3e95ff;
  }
`;

export default InputField;