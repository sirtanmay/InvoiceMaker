import React, { useState, useEffect, useRef } from "react";
import "./SelectList.css";

export default function SelectList({ id, options, placeholder = "Select an option", selectOption, onChange }) {
    const [selectedOption, setSelectedOption] = useState(selectOption);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle dropdown open/closed
    const toggleDropdown = () => setIsOpen((prev) => !prev);

    // Handle option selection
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) onChange(option);
    };

    // Close dropdown if clicked outside the container
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (selectOption) {
            const preSelectOption = options.filter((opt) => JSON.stringify(opt.value) === JSON.stringify(selectOption));
            if (preSelectOption.length > 0) setSelectedOption(preSelectOption[0]);
        }
    }, [selectOption]);

    return (
        <div className="custom-select-container" ref={dropdownRef}>
            <button
                id={id}
                type="button"
                className={`select-header ${isOpen ? "open" : ""}`}
                onClick={toggleDropdown}
            >
                <span>{selectedOption ? selectedOption?.label : placeholder}</span>
                <span className={`arrow ${isOpen ? "up" : "down"}`}>▼</span>
            </button>

            {isOpen && (
                <ul className="select-options-list">
                    {options.map((option) => (
                        <li
                            key={option.label}
                            className={`select-option ${selectedOption?.value === option.value ? "selected" : ""}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
