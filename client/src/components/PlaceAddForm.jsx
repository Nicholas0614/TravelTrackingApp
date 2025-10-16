import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
  Grid,
} from "@mui/material";
import { toast } from "sonner";
import { addPlace } from "../utils/api_places";
import { uploadImage } from "../utils/api_image";
import { styled } from "@mui/material/styles";
import { API_URL } from "../utils/constants";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddPlaceForm({
  onSuccess,
  areas = [],
  categories = [],
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [googleLink, setGoogleLink] = useState("");
  const [openTimes, setOpenTimes] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpenTimeChange = (day, value) => {
    setOpenTimes((prev) => ({ ...prev, [day]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !categoryId || !areaId) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      await addPlace({
        name,
        description,
        category: categoryId,
        area: areaId,
        phone: phone || undefined,
        image: image || undefined,
        googleLink: googleLink || undefined,
        openTimes,
      });
      toast.success("Place added successfully!");
      // Reset form
      setName("");
      setDescription("");
      setCategoryId("");
      setAreaId("");
      setPhone("");
      setImage("");
      setGoogleLink("");
      setOpenTimes({
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
      });
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding place");
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
        Add New Place
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        multiline
        rows={2}
      />
      <TextField
        select
        label="Area"
        value={areaId}
        onChange={(e) => setAreaId(e.target.value)}
        required
      >
        {areas.map((area) => (
          <MenuItem key={area._id} value={area._id}>
            {area.country} / {area.state} / {area.city}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Box mb={2} sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {image ? (
          <>
            <img src={API_URL + image} width="100px" />
            <Button
              color="info"
              variant="contained"
              size="small"
              onClick={() => setImage(null)}
            >
              Remove
            </Button>
          </>
        ) : (
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
          >
            Upload image
            <VisuallyHiddenInput
              type="file"
              onChange={async (event) => {
                const data = await uploadImage(event.target.files[0]);
                setImage(data.image_url);
                // {image_url: "uploads/image.jpg"}
              }}
              accept="image/*"
            />
          </Button>
        )}
      </Box>
      <TextField
        label="Google Map Link"
        value={googleLink}
        onChange={(e) => setGoogleLink(e.target.value)}
      />

      <Typography variant="subtitle1" mt={2}>
        Opening Times (Optional)
      </Typography>
      <Grid container spacing={1}>
        {Object.keys(openTimes).map((day) => (
          <Grid size={{ xs: 6, sm: 4 }} key={day}>
            <TextField
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              value={openTimes[day]}
              onChange={(e) => handleOpenTimeChange(day, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Add Place"}
      </Button>
    </Box>
  );
}
