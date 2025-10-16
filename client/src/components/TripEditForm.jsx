import { useState, useEffect } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import toast from "react-hot-toast";
import { getTrip, updateTrip } from "../utils/api_trips"; // assume you have these
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useCookies } from "react-cookie";
import Lottie from "lottie-react";

export default function EditTripForm({ tripId, onSuccess }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  // Load trip data
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const trip = await getTrip(tripId, token);
        setName(trip.name);
        setStartDate(dayjs(trip.startDate));
        setEndDate(dayjs(trip.endDate));
      } catch (err) {
        toast.error("Failed to load trip");
      }
    };
    if (token) fetchTrip();
  }, [tripId, token]);

  useEffect(() => {
    fetch("/check.json")
      .then((res) => res.json())
      .then((data) => setAnimationConfirm(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      await updateTrip(
        tripId,
        {
          name,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        token
      );
      toast.success("Trip updated successfully!");
      onSuccess?.(); // refresh list & maybe navigate back
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            if (endDate.isBefore(newValue)) setEndDate(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DatePicker
          label="End Date"
          value={endDate}
          minDate={startDate}
          onChange={(newValue) => setEndDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <IconButton type="submit">
            {animationConfirm && (
              <Box sx={{ width: 40, height: 40 }}>
                <Lottie animationData={animationConfirm} loop={true} />
              </Box>
            )}
          </IconButton>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
