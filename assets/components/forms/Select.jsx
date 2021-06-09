import React, { Component } from 'react'

const Select = ({name, defaultValue, error="", label, onChange, children}) => {
    return ( 
        <div className="form-group">
            <label htmlFor={name} className="form-label mt-4">{label}</label>
            <select 
                onChange={onChange}
                name={name} 
                id={name}
                value={defaultValue}
                className={"form-select" + (error && " is-invalid")}
            >
                {children}
            </select>
            <p className="invalid-feedback">{error}</p>
        </div> 
     );
}
 
export default Select;