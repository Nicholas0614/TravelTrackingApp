import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { addCategory } from "../utils/api_categories";

export default function AddCategoryForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      await addCategory({ name });
      toast.success("Area added successfully!");
      setName("");
      onSuccess?.(); // trigger refresh
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding area");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
        Add New Category
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Add Category"
        )}
      </Button>
    </Box>
  );
}
