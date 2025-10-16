import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CircularProgress,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
} from "@mui/material";
import { getTrips } from "../utils/api_trips";
import { getActivities, deleteActivity } from "../utils/api_activities";
import toast from "react-hot-toast";
import { API_URL } from "../utils/constants";
import { useCookies } from "react-cookie";
import ActivityEditForm from "../components/ActivityEditForm";
import Lottie from "lottie-react";

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [iconAnimationData, setIconAnimationData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteActivityId, setDeleteActivityId] = useState(null); // ✅ Added this
  const [animationUpdate, setAnimationUpdate] = useState(null);
  const [animationDelete, setAnimationDelete] = useState(null);
  const [animationClose, setAnimationClose] = useState(null);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  useEffect(() => {
    fetch("/delete.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationData(data));
  }, []);
  useEffect(() => {
    fetch("/remove.json")
      .then((res) => res.json())
      .then((data) => setAnimationDelete(data));
  }, []);
  useEffect(() => {
    fetch("/edit.json")
      .then((res) => res.json())
      .then((data) => setAnimationUpdate(data));
  }, []);
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
    async function fetchData() {
      try {
        const trips = await getTrips(token);
        const foundTrip = trips.find((t) => t._id === id);
        setTrip(foundTrip);

        const acts = await getActivities(id, token);
        setActivities(acts);
      } catch (err) {
        console.error("Error loading trip details:", err);
        toast.error("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // ✅ new confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deleteActivityId) return;
    try {
      await deleteActivity(deleteActivityId, token);
      toast.success("Activity deleted");
      setActivities((prev) => prev.filter((a) => a._id !== deleteActivityId));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete activity");
    } finally {
      setConfirmOpen(false);
      setDeleteActivityId(null);
    }
  };

  const getDaysArray = (start, end) => {
    const arr = [];
    const dt = new Date(start);
    while (dt <= new Date(end)) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!trip) {
    return <Typography variant="h6">Trip not found</Typography>;
  }

  const days = getDaysArray(trip.startDate, trip.endDate);

  const formatTime12Hour = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <Box sx={{ p: 5, bgcolor: "grey.100", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        {trip.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {new Date(trip.startDate).toLocaleDateString()} -{" "}
        {new Date(trip.endDate).toLocaleDateString()}
      </Typography>

      {days.map((day, idx) => {
        const dayStr = day.toISOString().split("T")[0];
        const dayActivities = activities
          .filter((act) => act.date.split("T")[0] === dayStr)
          .sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
          });

        return (
          <Box key={idx} sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {day.toDateString()}
            </Typography>

            {dayActivities.length === 0 ? (
              <Typography color="text.secondary">
                No activities for this day.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {dayActivities.map((act) => (
                  <Grid size={{ xs: 12, sm: 6, md: 2 }} key={act._id}>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        "&:hover .action-buttons": {
                          transform: "translateY(0)",
                          opacity: 1,
                          pointerEvents: "auto",
                        },
                      }}
                    >
                      <Card
                        component={Link}
                        to={`/places/${act.place?._id}`}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: 5,
                          boxShadow: 4,
                          overflow: "hidden",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="200"
                            image={
                              act.place?.image
                                ? API_URL + act.place.image
                                : API_URL + "uploads/default_image.jpg"
                            }
                            alt={act.place?.name || "Place image"}
                            sx={{ borderRadius: 2 }}
                          />
                        </CardActionArea>

                        <CardContent sx={{ pb: 8 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {act.place?.name || "Unknown Place"}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Expected Start Time : {formatTime12Hour(act.time)}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {act.notes || "No notes"}
                          </Typography>
                        </CardContent>

                        <Box
                          className="action-buttons"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            display: "flex",
                            gap: 1.5,
                            padding: "12px 0",
                            background: "grey.100",
                            backdropFilter: "blur(8px)",
                            borderTop: "1px solid rgba(0,0,0,0.05)",
                            transform: "translateY(100%)",
                            opacity: 0,
                            transition: "all 0.35s ease",
                            pointerEvents: "none",
                          }}
                        >
                          <IconButton
                            size="small"
                            variant="contained"
                            color="primary"
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              fontWeight: 500,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                              },
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedActivity(act);
                              setEditOpen(true);
                            }}
                          >
                            {animationUpdate && (
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
                                    width: 25, // responsive size
                                    height: 25,
                                  }}
                                >
                                  <Lottie
                                    animationData={animationUpdate}
                                    loop={true}
                                  />
                                </Box>
                              </Box>
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            variant="contained"
                            color="error"
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              fontWeight: 500,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                              },
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteActivityId(act._id); // ✅ store ID
                              setConfirmOpen(true); // ✅ open confirm dialog
                            }}
                          >
                            {animationDelete && (
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
                                    width: 25, // responsive size
                                    height: 25,
                                  }}
                                >
                                  <Lottie
                                    animationData={animationDelete}
                                    loop={true}
                                  />
                                </Box>
                              </Box>
                            )}
                          </IconButton>
                        </Box>
                      </Card>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );
      })}

      <ActivityEditForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        activity={selectedActivity}
        onEdited={async () => {
          try {
            const acts = await getActivities(id, token);
            setActivities(acts);
          } catch (err) {
            console.error("Failed to refresh activities:", err);
          }
        }}
      />

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        {iconAnimationData && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",

              py: 2,
            }}
          >
            <Lottie
              animationData={iconAnimationData}
              loop={true}
              style={{
                width: "50%", // ✅ responsive width
                maxWidth: 180,
                height: "auto", // maintain aspect ratio
              }}
            />
          </Box>
        )}
        <DialogTitle
          sx={{
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.5rem",
            pt: 0,
          }}
        >
          Are U Sure ?
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <Typography textAlign="center">
            You won't be able to revert this!
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "center", pb: 3, gap: 3 }}
        >
          <IconButton onClick={() => setConfirmOpen(false)}>
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
                    width: 60, // responsive size
                    height: 60,
                  }}
                >
                  <Lottie animationData={animationClose} loop={true} />
                </Box>
              </Box>
            )}
          </IconButton>
          <IconButton color="error" onClick={handleConfirmDelete}>
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
                    width: 60, // responsive size
                    height: 60,
                  }}
                >
                  <Lottie animationData={animationConfirm} loop={true} />
                </Box>
              </Box>
            )}
          </IconButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
