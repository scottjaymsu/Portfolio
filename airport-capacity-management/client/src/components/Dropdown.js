import React from "react";
import PropTypes from "prop-types";

const Dropdown = ({ type, label, value, onChange, options, placeholder, listId }) => {
  return (
    <div className="dropdown-container">
      <label htmlFor={listId}>{label}</label>
      {type === "datalist" ? (
        <>
          <input
            type="text"
            id={listId}
            name={listId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            list={listId}
          />
          <datalist id={listId}>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </datalist>
        </>
      ) : (
        <select id={listId} name={listId} onChange={onChange} value={value}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

// Define expected props for validation
Dropdown.propTypes = {
  type: PropTypes.oneOf(["select", "datalist"]).isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  listId: PropTypes.string.isRequired,
};

export default Dropdown;
