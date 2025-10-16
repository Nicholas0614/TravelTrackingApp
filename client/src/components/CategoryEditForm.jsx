import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { updateCategory } from "../utils/api_categories";

export default function EditCategoryForm({ category, onSuccess }) {
  const [name, setName] = useState(category?.name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      await updateCategory(category._id, { name });
      toast.success("Category added successfully!");
      onSuccess?.(); // trigger refresh
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating category");
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
        Edit Category
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
