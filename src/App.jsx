import React, { useState } from 'react';
import './App.css';
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  
  const filterOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest alphabet' }
  ];

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponseData(null);
    setShowFilters(false);
    
   
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        setError('Invalid JSON format. Input must contain a "data" array.');
        return;
      }
      
      
      setLoading(true);
      try {
        const response = await fetch('https://gourav-backend-5voz.vercel.app/bfhl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonInput,
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        setResponseData(data);
        setShowFilters(true);
        
        
        setSelectedFilters([
          { value: 'alphabets', label: 'Alphabets' },
          { value: 'numbers', label: 'Numbers' },
          { value: 'highest_alphabet', label: 'Highest alphabet' }
        ]);
      } catch (fetchError) {
        setError(`API call failed: ${fetchError.message}`);
      } finally {
        setLoading(false);
      }
    } catch (jsonError) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  
  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions || []);
  };

  
  const renderFilteredResponse = () => {
    if (!responseData || selectedFilters.length === 0) {
      return null;
    }

    const selectedValues = selectedFilters.map(option => option.value);
    
    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        {selectedValues.includes('numbers') && responseData.numbers.length > 0 && (
          <p><strong>Numbers:</strong> {responseData.numbers.join(',')}</p>
        )}
        {selectedValues.includes('alphabets') && responseData.alphabets.length > 0 && (
          <p><strong>Alphabets:</strong> {responseData.alphabets.join(',')}</p>
        )}
        {selectedValues.includes('highest_alphabet') && responseData.highest_alphabet.length > 0 && (
          <p><strong>Highest Alphabet:</strong> {responseData.highest_alphabet.join(',')}</p>
        )}
        {(selectedValues.includes('numbers') && responseData.numbers.length === 0) && 
          (selectedValues.includes('alphabets') && responseData.alphabets.length === 0) && 
          (selectedValues.includes('highest_alphabet') && responseData.highest_alphabet.length === 0) && (
          <p>No data available for selected filters.</p>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="input-section">
        <h1>Data Processing Tool</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jsonInput">Enter JSON Input:</label>
            <textarea
              id="jsonInput"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"data": ["A", "1", "B", "2"]}'
              rows={5}
              className="json-input"
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
      </div>

      {showFilters && (
        <div className="filter-section">
          <h2>Select filters to display response data:</h2>
          <Select
            isMulti
            name="filters"
            options={filterOptions}
            className="multi-select"
            classNamePrefix="select"
            value={selectedFilters}
            onChange={handleFilterChange}
            placeholder="Select filters..."
          />
          
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

export default App;