import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";
import { addArea } from "../utils/api_area";

export default function AddAreaForm({ onSuccess }) {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!country || !state || !city) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      await addArea({ country, state, city });
      toast.success("Area added successfully!");
      setCountry("");
      setState("");
      setCity("");
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
        Add New Area
      </Typography>
      <TextField
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      />
      <TextField
        label="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        required
      />
      <TextField
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Add Area"}
      </Button>
    </Box>
  );
}
