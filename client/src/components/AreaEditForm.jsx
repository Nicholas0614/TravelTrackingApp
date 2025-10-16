import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { updateArea } from "../utils/api_area";

export default function EditAreaForm({ area, onSuccess }) {
  const [country, setCountry] = useState(area?.country || "");
  const [state, setState] = useState(area?.state || "");
  const [city, setCity] = useState(area?.city || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (area) {
      setCountry(area.country);
      setState(area.state);
      setCity(area.city);
    }
  }, [area]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!country || !state || !city) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      await updateArea(area._id, { country, state, city }); // 👈 send id
      toast.success("Area updated successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating area");
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
        Edit Area
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
