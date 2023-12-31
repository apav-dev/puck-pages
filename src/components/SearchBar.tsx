import * as React from "react";
import { Button } from "./shadcn/Button";
import { Input } from "./shadcn/Input";
import { SearchIcon } from "lucide-react";
import { useState, useRef } from "react";

export interface SearchBarProps {
  onSearch: (value: string) => void; // Callback when the search is triggered
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle the change in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle the click on the search button
  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  // Handle the key press event in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="pl-3 pr-10" // Adjust padding for icon
        ref={inputRef}
      />
      <Button
        onClick={handleSearchClick}
        aria-label="Search"
        className="absolute right-0 top-0 h-full"
      >
        <SearchIcon size={16} />
      </Button>
    </div>
  );
};

export { SearchBar };
