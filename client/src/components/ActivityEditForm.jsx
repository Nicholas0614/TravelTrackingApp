import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { getTrips } from "../utils/api_trips";
import { editActivity } from "../utils/api_activities";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Lottie from "lottie-react";

export default function ActivityEditForm({
  open,
  onClose,
  activity,
  onEdited,
}) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(activity?.trip?._id || "");
  const [form, setForm] = useState({
    trip: activity?.trip?._id || "",
    place: activity?.place || "",
    date: activity?.date, // e.g. "2025-10-15"
    notes: activity?.notes,
    time: activity?.time,
  });
  const [animationClose, setAnimationClose] = useState(null);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  // 🔹 Fetch trips when modal opens
  useEffect(() => {
    async function fetchTrips() {
      try {
        const data = await getTrips(token);
        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips", err);
      }
    }
    if (open) fetchTrips();
  }, [open]);

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

  // 🔹 Update form when new activity is passed in
  useEffect(() => {
    if (activity) {
      setForm({
        trip: activity.trip?._id || "",
        place: activity.place || "",
        date: activity.date || "",
        notes: activity.notes || "",
        time: activity.time || "",
      });
      setSelectedTrip(activity.trip?._id || "");
    }
  }, [activity]);

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

      await editActivity(activity._id, payload, token);
      toast.success("Activity updated!");
      if (onEdited) await onEdited();
      onClose();
    } catch (err) {
      console.error("Error editing activity", err);
      toast.error("Failed to update activity");
    }
  };

  const selectedTripObj = trips.find((t) => t._id === selectedTrip);
  const availableDates = selectedTripObj ? selectedTripObj.dates : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Activity</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Select Trip"
          name=""
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
          {availableDates.map((d, idx) => {
            const formatted = d.split("T")[0]; // 👈 convert ISO to simple YYYY-MM-DD
            return (
              <MenuItem key={idx} value={formatted}>
                {new Date(d).toLocaleDateString()}
              </MenuItem>
            );
          })}
        </TextField>
        <Box sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Select Time"
              value={form.time ? dayjs(form.time, "HH:mm") : null}
              onChange={(newValue) => {
                const formatted = newValue
                  ? dayjs(newValue).format("HH:mm")
                  : "";
                setForm({ ...form, time: formatted });
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mb: 2 }} required />
              )}
            />
          </LocalizationProvider>
        </Box>

        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          sx={{ mb: 2 }}
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
