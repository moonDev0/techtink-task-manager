import { useState } from "react";
import { TextField, Box } from "@mui/material";

const SearchForm = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" gap={2} mt={2}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={input}
        onChange={handleChange} // Updated to call handleChange on input
      />
    </Box>
  );
};

export default SearchForm;
