import React, { useState, useEffect } from "react";
import { ShapeCategory, ShapeSearchOptions } from "../../types/shapes";
import "./ShapeLibrary.css";

interface ShapeSearchProps {
  onSearch: (options: ShapeSearchOptions) => void;
  availableCategories: ShapeCategory[];
}

/**
 * Component for searching shapes in the library
 */
const ShapeSearch: React.FC<ShapeSearchProps> = ({
  onSearch,
  availableCategories,
}) => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ShapeCategory[]>(
    []
  );
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  // Perform search when query or selected categories change
  useEffect(() => {
    const searchOptions: ShapeSearchOptions = {
      query,
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
    };

    onSearch(searchOptions);
  }, [query, selectedCategories, onSearch]);

  // Handle query change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Toggle category selection
  const toggleCategory = (category: ShapeCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setSelectedCategories([]);
  };

  // Toggle advanced search
  const toggleAdvancedSearch = () => {
    setIsAdvancedSearch(!isAdvancedSearch);
    if (isAdvancedSearch) {
      setSelectedCategories([]);
    }
  };

  return (
    <div className="shape-search">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search shapes..."
          value={query}
          onChange={handleQueryChange}
        />
        {query && (
          <button className="clear-search" onClick={clearSearch}>
            ×
          </button>
        )}
      </div>

      <div className="search-options">
        <button
          className="toggle-advanced-search"
          onClick={toggleAdvancedSearch}
        >
          {isAdvancedSearch ? "Simple Search" : "Advanced Search"}
        </button>
      </div>

      {isAdvancedSearch && (
        <div className="advanced-search-options">
          <div className="category-filters">
            <div className="filter-label">Filter by category:</div>
            <div className="category-checkboxes">
              {availableCategories.map((category) => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShapeSearch;
