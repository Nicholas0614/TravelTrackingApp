import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import StarIcon from "@mui/icons-material/Star";
import MenuIcon from "@mui/icons-material/Menu";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import { getReviews } from "../utils/api_reviews";
import { useCookies } from "react-cookie";
import { API_URL } from "../utils/constants";
import { getPlaces } from "../utils/api_places";
import { getCategories } from "../utils/api_categories";
import { getAreas } from "../utils/api_area";
import { getTrips, deleteTrip } from "../utils/api_trips";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../utils/api_wishlist";
import Masonry from "@mui/lab/Masonry";

import TripAddForm from "../components/TripAddForm";
import TripEditForm from "../components/TripEditForm";
import Lottie from "lottie-react";

export default function HomePage() {
  const [places, setPlaces] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeReviews, setPlaceReviews] = useState({});

  const [filters, setFilters] = useState({ country: "", state: "", city: "" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tripsOpen, setTripsOpen] = useState(false);

  const [openTripForm, setOpenTripForm] = useState(false);
  const [editTripId, setEditTripId] = useState(null);
  const [openEditTripForm, setOpenEditTripForm] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [openTripDetails, setOpenTripDetails] = useState(false);

  const [iconAnimationData, setIconAnimationData] = useState(null);
  const [iconAnimationData2, setIconAnimationData2] = useState(null);
  const [animationlove, setAnimationLove] = useState(null);
  const [animationredlove, setAnimationRedLove] = useState(null);
  const [animationJustify, setAnimationJustify] = useState(null);
  const [animationCalender, setAnimationCalender] = useState(null);
  const [animationDelete, setAnimationDelete] = useState(null);
  const [animationUpdate, setAnimationUpdate] = useState(null);
  const [animationClose, setAnimationClose] = useState(null);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  const [confirmTripOpen, setConfirmTripOpen] = useState(false);
  const [deleteTripId, setDeleteTripId] = useState(null);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [placesData, categoriesData, areasData] = await Promise.all([
          getPlaces(),
          getCategories(),
          getAreas(),
        ]);
        setPlaces(placesData);
        setCategories(categoriesData);
        setAreas(areasData);
      } catch (e) {
        console.error("Error fetching homepage data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetch("/redheart.json")
      .then((res) => res.json())
      .then((data) => setAnimationLove(data));
  }, []);
  useEffect(() => {
    fetch("/redheartt.json")
      .then((res) => res.json())
      .then((data) => setAnimationRedLove(data));
  }, []);
  useEffect(() => {
    fetch("/justify.json")
      .then((res) => res.json())
      .then((data) => setAnimationJustify(data));
  }, []);
  useEffect(() => {
    fetch("/calendar.json")
      .then((res) => res.json())
      .then((data) => setAnimationCalender(data));
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
    async function fetchReviewsForPlaces() {
      try {
        const reviewsData = {};
        for (let place of places) {
          const reviews = await getReviews(place._id);
          const count = reviews.length;
          const avg =
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (count || 1);
          reviewsData[place._id] = { count, avg };
        }
        setPlaceReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    }

    if (places.length) fetchReviewsForPlaces();
  }, [places]);

  // Fetch wishlist
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const data = await getWishlist(token);
        setWishlist(data);
      } catch (e) {
        console.error("Error loading wishlist", e);
      }
    }
    if (token) fetchWishlist();
  }, [token]);

  useEffect(() => {
    fetch("/zoom.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationData(data));
  }, []);

  useEffect(() => {
    fetch("/delete.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationData2(data));
  }, []);

  // Fetch trips
  const fetchTripsData = async () => {
    try {
      const data = await getTrips(token);
      setTrips(data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  useEffect(() => {
    if (token) fetchTripsData();
  }, [token]);

  const handleWishlistToggle = async (place) => {
    try {
      const existing = wishlist.find((item) => item.place._id === place._id);
      if (existing) {
        await removeFromWishlist(place._id, token);
        toast.success("Removed From Wishlist");
        setWishlist((prev) => prev.filter((w) => w._id !== existing._id));
      } else {
        const newItem = await addToWishlist(place._id, token);
        toast.success("Added To Wishlist");
        setWishlist((prev) => [...prev, newItem]);
      }
    } catch (err) {
      toast.error("Please Login First");
      console.error("Error toggling wishlist:", err);
    }
  };

  if (loading) return <Container sx={{ py: 10 }}>Loading...</Container>;
  // unique filter options
  const countries = [...new Set(areas.map((a) => a.country))];
  const states = filters.country
    ? [
        ...new Set(
          areas.filter((a) => a.country === filters.country).map((a) => a.state)
        ),
      ]
    : [];
  const cities = filters.state
    ? [
        ...new Set(
          areas.filter((a) => a.state === filters.state).map((a) => a.city)
        ),
      ]
    : [];

  // filter places
  const filteredPlaces = places.filter((p) => {
    const matchCountry = filters.country
      ? p.area?.country === filters.country
      : true;
    const matchState = filters.state ? p.area?.state === filters.state : true;
    const matchCity = filters.city ? p.area?.city === filters.city : true;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.area?.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.area?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.area?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCountry && matchState && matchCity && matchSearch;
  });

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh" }}>
      {/* Top bar */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", // ✅ allow wrapping on small screens
          gap: 1, // spacing when wrapped
        }}
      >
        {/* Left side: Menu + Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 0, // ✅ allows shrinking
            gap: 1, // space between menu & search
          }}
        >
          {/* Menu Icon */}
          <IconButton onClick={() => setDrawerOpen(true)}>
            {animationJustify && (
              <Box sx={{ width: 25, height: 25 }}>
                <Lottie animationData={animationJustify} loop={true} />
              </Box>
            )}
          </IconButton>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1, // fills remaining space
              minWidth: 0, // allows shrinking
              maxWidth: { xs: "180px", sm: "250px", md: "300px" }, // ✅ max width per screen size
              bgcolor: "white",
              borderRadius: "10px",
              boxShadow: 2,
              px: 1,
              py: 0.5,
            }}
          >
            {iconAnimationData && (
              <Box sx={{ width: 30, height: 30, mr: 1 }}>
                <Lottie animationData={iconAnimationData} loop={true} />
              </Box>
            )}
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "16px",
                padding: "8px",
                borderRadius: "30px",
                minWidth: 0, // important for shrinking
              }}
            />
          </Box>
        </Box>

        {/* Right side: Trip Icon */}
        <IconButton onClick={() => setTripsOpen(true)}>
          {animationCalender && (
            <Box sx={{ width: 25, height: 25 }}>
              <Lottie animationData={animationCalender} loop={true} />
            </Box>
          )}
        </IconButton>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filter Places
          </Typography>

          {/* Country */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              value={filters.country}
              onChange={(e) =>
                setFilters({ country: e.target.value, state: "", city: "" })
              }
            >
              <MenuItem value="">All</MenuItem>
              {countries.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* State */}
          <FormControl fullWidth margin="normal" disabled={!filters.country}>
            <InputLabel>State</InputLabel>
            <Select
              value={filters.state}
              onChange={(e) =>
                setFilters({ ...filters, state: e.target.value, city: "" })
              }
            >
              <MenuItem value="">All</MenuItem>
              {states.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* City */}
          <FormControl fullWidth margin="normal" disabled={!filters.state}>
            <InputLabel>City</InputLabel>
            <Select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {cities.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => setFilters({ country: "", state: "", city: "" })}
          >
            Clear Filters
          </Button>
        </Box>
      </Drawer>

      {/* Trips Drawer */}
      <Drawer
        anchor="right"
        open={tripsOpen}
        onClose={() => setTripsOpen(false)}
      >
        <Box
          sx={{
            width: 280,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Trips
          </Typography>

          <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
            {trips.length > 0 ? (
              trips.map((trip) => (
                <Box
                  key={trip._id}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: "grey.200",
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    color: "inherit", // optional: keeps parent text color
                    "&:hover": {
                      textDecoration: "none", // ensures no underline on hover
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    component={Link} // 👈 make it a link
                    to={`/trips/${trip._id}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit", // optional: keeps parent text color
                      "&:hover": {
                        textDecoration: "none", // ensures no underline on hover
                      },
                    }}
                  >
                    {trip.name}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => {
                          setEditTripId(trip._id);
                          setOpenEditTripForm(true);
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
                                width: 20, // responsive size
                                height: 20,
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
                        onClick={() => {
                          setDeleteTripId(trip._id);
                          setConfirmTripOpen(true);
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
                                width: 20, // responsive size
                                height: 20,
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
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                {currentuser ? "No trip yet" : "Pls Login to Add TRIP"}
              </Typography>
            )}
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpenTripForm(true)}
            disabled={!currentuser}
          >
            Add Trip
          </Button>
        </Box>
      </Drawer>

      {/* Add Trip Dialog */}
      <Dialog
        open={openTripForm}
        onClose={() => setOpenTripForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add New Trip
          <IconButton onClick={() => setOpenTripForm(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TripAddForm
            onSuccess={async () => {
              setOpenTripForm(false);
              await fetchTripsData();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Trip Dialog */}
      <Dialog
        open={openEditTripForm}
        onClose={() => setOpenEditTripForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Edit Trip
          <IconButton onClick={() => setOpenEditTripForm(false)}>
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
                    width: 25, // responsive size
                    height: 25,
                  }}
                >
                  <Lottie animationData={animationClose} loop={true} />
                </Box>
              </Box>
            )}
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editTripId && (
            <TripEditForm
              tripId={editTripId}
              onSuccess={async () => {
                setOpenEditTripForm(false);
                await fetchTripsData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openTripDetails}
        onClose={() => setOpenTripDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Trip Details
          <IconButton onClick={() => setOpenTripDetails(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTrip && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTrip.name}
              </Typography>
              <Typography gutterBottom>
                {new Date(selectedTrip.startDate).toLocaleDateString()} -{" "}
                {new Date(selectedTrip.endDate).toLocaleDateString()}
              </Typography>

              <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                Dates:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {selectedTrip.dates.map((d, idx) => (
                  <Typography key={idx}>
                    {new Date(d).toLocaleDateString()}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmTripOpen}
        onClose={() => setConfirmTripOpen(false)}
        fullWidth
        maxWidth="xs" // ✅ small width for mobile
      >
        {iconAnimationData2 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%", // ✅ full width of dialog
              py: 2,
            }}
          >
            <Lottie
              animationData={iconAnimationData2}
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
          Are U Sure?
        </DialogTitle>

        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <Typography textAlign="center">
            You won't be able to revert this!
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center", // same as "end"\
            pb: 3,
            gap: 3,
          }}
        >
          <IconButton onClick={() => setConfirmTripOpen(false)}>
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
          <IconButton
            onClick={async () => {
              try {
                await deleteTrip(deleteTripId, token);
                toast.success("Trip deleted successfully");
                await fetchTripsData();
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete trip");
              } finally {
                setConfirmTripOpen(false);
                setDeleteTripId(null);
              }
            }}
          >
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

      {/* Places Section */}
      <Container maxWidth="xl" disableGutters sx={{ px: 2, py: 3 }}>
        {Array.from(
          new Set(
            filteredPlaces
              .filter((p) => p.category?.name?.toLowerCase() === "shopping")
              .map((p) => p.area?.country)
          )
        ).map((country) => {
          const countryPlaces = filteredPlaces.filter(
            (p) =>
              p.category?.name?.toLowerCase() === "shopping" &&
              p.area?.country === country
          );
          return (
            <Box key={country} sx={{ mb: 8 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                {country}
              </Typography>
              {Array.from(new Set(countryPlaces.map((p) => p.area?.state))).map(
                (state) => {
                  const statePlaces = countryPlaces.filter(
                    (p) => p.area?.state === state
                  );
                  return (
                    <Box
                      key={state}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          px: 2, // optional horizontal padding
                          py: 3, // optional vertical padding
                        }}
                      >
                        <Masonry
                          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                          spacing={4}
                        >
                          {statePlaces.map((place) => (
                            <Grid
                              key={place._id}
                              size={{ xs: 12, sm: 6, md: 3 }}
                              component={Link}
                              to={`/places/${place._id}`}
                              sx={{ textDecoration: "none", color: "inherit" }}
                            >
                              <Card
                                sx={{
                                  borderRadius: 3,
                                  boxShadow: 4,
                                  position: "relative",
                                  overflow: "hidden",
                                  "&:hover .hoverOverlay": { opacity: 1 },
                                  "&:hover .darkOverlay": { opacity: 1 },
                                }}
                              >
                                <CardActionArea>
                                  <CardMedia
                                    component="img"
                                    image={
                                      API_URL +
                                      (place.image
                                        ? place.image
                                        : "uploads/default_image.jpg")
                                    }
                                    alt={place.name}
                                    sx={{
                                      width: "100%",
                                      height: "auto",
                                      objectFit: "cover",
                                    }}
                                  />
                                </CardActionArea>

                                <Box
                                  className="darkOverlay"
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: "rgba(0,0,0,0.4)",
                                    opacity: 0,
                                    transition: "opacity 0.3s",
                                  }}
                                />

                                <Box
                                  className="hoverOverlay"
                                  sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 1,
                                    opacity: 0,
                                    transition: "opacity 0.3s",
                                    zIndex: 2,
                                  }}
                                >
                                  <IconButton
                                    sx={{
                                      bgcolor: "white",
                                      "&:hover": { bgcolor: "white" },
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleWishlistToggle(place);
                                    }}
                                  >
                                    {wishlist.some(
                                      (w) => w.place._id === place._id
                                    ) ? (
                                      <Box>
                                        {animationredlove && (
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
                                                animationData={animationredlove}
                                                loop={true}
                                              />
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    ) : (
                                      <Box>
                                        {animationlove && (
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
                                                animationData={animationlove}
                                                loop={true}
                                              />
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    )}
                                  </IconButton>
                                </Box>
                              </Card>

                              <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                  {place.name}
                                </Typography>
                                <Box
                                  mt={1}
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <StarIcon sx={{ color: "#fdd835" }} />
                                  <Typography sx={{ ml: 1, color: "#757575" }}>
                                    {placeReviews[place._id]?.avg?.toFixed(1) ||
                                      "No Rating"}
                                  </Typography>
                                  <Typography sx={{ ml: 1, color: "#757575" }}>
                                    ・
                                  </Typography>
                                  <Typography sx={{ ml: 1, color: "#757575" }}>
                                    {placeReviews[place._id]?.count || 0}{" "}
                                    reviews
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Grid>
                          ))}
                        </Masonry>
                      </Box>
                    </Box>
                  );
                }
              )}
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}
