import React, { useState, useRef } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed && !isLoading) {
            onSearch(trimmed);
        }
    };

    const suggestions = ['night', 'father', 'water', 'mother', 'fire', 'star', 'heart', 'name', 'new', 'sun', 'land', 'red'];

    return (
        <div className="searchbar-wrapper">
            <form onSubmit={handleSubmit} className="searchbar-form">
                <div className="searchbar-input-group">
                    <span className="searchbar-icon">
                        {isLoading ? (
                            <span className="spinner" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        )}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter any English word…"
                        className="searchbar-input"
                        disabled={isLoading}
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <button
                        type="submit"
                        className="searchbar-btn"
                        disabled={!value.trim() || isLoading}
                    >
                        {isLoading ? 'Tracing…' : 'Explore →'}
                    </button>
                </div>
            </form>

            {/* Quick suggestions */}
            <div className="suggestion-row">
                <span className="suggestion-label">Try:</span>
                {suggestions.map(s => (
                    <button
                        key={s}
                        className="suggestion-chip"
                        onClick={() => {
                            setValue(s);
                            onSearch(s);
                        }}
                        disabled={isLoading}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
