import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import { getTrips } from "../utils/api_trips"; // ✅ fetch trips
import { addActivity } from "../utils/api_activities"; // ✅ create activity
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Lottie from "lottie-react";

export default function ActivityAddForm({ open, onClose, placeId }) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [form, setForm] = useState({
    trip: "",
    place: placeId,
    date: "",
    notes: "",
    time: "",
  });
  const [animationClose, setAnimationClose] = useState(null);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  useEffect(() => {
    fetch("/close.json")
      .then((res) => res.json())
      .then((data) => setAnimationClose(data));
  }, []);
  useEffect(() => {
    fetch("/check.json")
      .then((res) => res.json())
      .then((data) => setAnimationConfirm(data));
  }, []);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const data = await getTrips(token);
        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips", err);
      }
    }
    fetchTrips();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        place: form.place,
        date: form.date,
        notes: form.notes,
        time: form.time,
      };

      await addActivity(form.trip, payload, token); // ✅ tripId in URL, data in body
      toast.success("Activity added!");
      onClose();
    } catch (err) {
      console.error("Error adding activity", err);
      toast.error("Failed to add activity");
    }
  };

  const selectedTripObj = trips.find((t) => t._id === selectedTrip);
  const availableDates = selectedTripObj ? selectedTripObj.dates : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Activity</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Select Trip"
          name="trip"
          value={form.trip}
          onChange={(e) => {
            setSelectedTrip(e.target.value);
            setForm({ ...form, trip: e.target.value, date: "" });
          }}
          sx={{ mb: 2 }}
          required
        >
          {trips.map((trip) => (
            <MenuItem key={trip._id} value={trip._id}>
              {trip.name} ({new Date(trip.startDate).toLocaleDateString()} -{" "}
              {new Date(trip.endDate).toLocaleDateString()})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Select Date"
          name="date"
          value={form.date}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          disabled={!selectedTripObj}
        >
          {availableDates.map((d, idx) => (
            <MenuItem key={idx} value={d}>
              {new Date(d).toLocaleDateString()}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Select Time"
            value={form.time ? dayjs(form.time, "HH:mm") : null}
            onChange={(newValue) => {
              const formatted = newValue ? dayjs(newValue).format("HH:mm") : "";
              setForm({ ...form, time: formatted });
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth sx={{ mb: 2 }} required />
            )}
          />
        </LocalizationProvider>
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          sx={{ mb: 2, mt: 2 }}
          multiline
          rows={3}
        />
      </DialogContent>

      <DialogActions>
        <IconButton onClick={onClose}>
          {" "}
          {animationClose && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                // space reserved for the animation
              }}
            >
              <Box
                sx={{
                  width: 40, // responsive size
                  height: 40,
                }}
              >
                <Lottie animationData={animationClose} loop={true} />
              </Box>
            </Box>
          )}
        </IconButton>
        <IconButton onClick={handleSubmit}>
          {animationConfirm && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // space reserved for the animation
              }}
            >
              <Box
                sx={{
                  width: 40, // responsive size
                  height: 40,
                }}
              >
                <Lottie animationData={animationConfirm} loop={true} />
              </Box>
            </Box>
          )}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
