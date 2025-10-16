import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { getPlace } from "../utils/api_places";
import { getReviews, deleteReview } from "../utils/api_reviews";
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
} from "@mui/material";
import { API_URL } from "../utils/constants";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import Lottie from "lottie-react";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../utils/api_wishlist";
import AddActivityForm from "./ActivityAddForm";
import ReviewAddForm from "./ReviewAddForm";
import ReviewDetailPage from "./ReviewDetailPage";
import ReviewEditForm from "./ReviewEditForm";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [openActivityForm, setOpenActivityForm] = useState(false);
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [openReviewDetailPage, setOpenReviewDetailPage] = useState(false);

  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [openEditReviewForm, setOpenEditReviewForm] = useState(false);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  const [animationlocation, setAnimationLocation] = useState(null);
  const [animationdetail, setAnimationDetail] = useState(null);
  const [animationglobal, setAnimationGlobal] = useState(null);
  const [animationphone, setAnimationPhone] = useState(null);
  const [animationtime, setAnimationTime] = useState(null);
  const [animationlove, setAnimationLove] = useState(null);
  const [animationredlove, setAnimationRedLove] = useState(null);
  const [animationReview, setAnimationReview] = useState(null);
  const [animationAdd, setAnimationAdd] = useState(null);
  const [animationFly, setAnimationFly] = useState(null);
  const [animationCar, setAnimationCar] = useState(null);

  useEffect(() => {
    fetch("/location.json")
      .then((res) => res.json())
      .then((data) => setAnimationLocation(data));
  }, []);
  useEffect(() => {
    fetch("/clipboard.json")
      .then((res) => res.json())
      .then((data) => setAnimationDetail(data));
  }, []);
  useEffect(() => {
    fetch("/globe.json")
      .then((res) => res.json())
      .then((data) => setAnimationGlobal(data));
  }, []);
  useEffect(() => {
    fetch("/phone.json")
      .then((res) => res.json())
      .then((data) => setAnimationPhone(data));
  }, []);
  useEffect(() => {
    fetch("/clock.json")
      .then((res) => res.json())
      .then((data) => setAnimationTime(data));
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
    fetch("/star.json")
      .then((res) => res.json())
      .then((data) => setAnimationReview(data));
  }, []);
  useEffect(() => {
    fetch("/plus.json")
      .then((res) => res.json())
      .then((data) => setAnimationAdd(data));
  }, []);
  useEffect(() => {
    fetch("/fly.json")
      .then((res) => res.json())
      .then((data) => setAnimationFly(data));
  }, []);
  useEffect(() => {
    fetch("/car.json")
      .then((res) => res.json())
      .then((data) => setAnimationCar(data));
  }, []);

  // ---------------- Fetch place details ----------------
  useEffect(() => {
    async function fetchPlace() {
      try {
        const data = await getPlace(id);
        setPlace(data);
      } catch (err) {
        console.error("Error fetching place", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlace();
  }, [id]);

  // ---------------- Fetch wishlist ----------------
  useEffect(() => {
    async function fetchWishlistData() {
      if (!token) return;
      try {
        const data = await getWishlist(token);
        setWishlist(data);
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    }
    fetchWishlistData();
  }, [token]);

  // ---------------- Fetch reviews ----------------
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await getReviews(id);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id, openReviewForm]);

  // ---------------- Wishlist toggle ----------------
  const handleWishlistToggle = async (place) => {
    try {
      const existing = wishlist.find((w) => w.place._id === place._id);
      if (existing) {
        await removeFromWishlist(place._id, token);
        toast.success("Removed from Wishlist");
        setWishlist((prev) => prev.filter((w) => w._id !== existing._id));
      } else {
        const newItem = await addToWishlist(place._id, token);
        toast.success("Added to Wishlist");
        setWishlist((prev) => [...prev, newItem]);
      }
    } catch (err) {
      toast.error("Please Login First");
      console.error(err);
    }
  };

  // ---------------- Delete review ----------------
  const handleDeleteReview = async (review) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(review._id, token);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  // ---------------- Edit review ----------------
  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setOpenEditReviewForm(true);
  };

  // ✅ Compute average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  if (loading) return <Container sx={{ py: 10 }}>Loading...</Container>;
  if (!place) return <Container sx={{ py: 10 }}>Place not found</Container>;

  return (
    <Container sx={{ py: 8, position: "relative", overflow: "hidden" }}>
      {/* ---------------- Place Details ---------------- */}

      {animationFly && (
        <Box
          sx={{
            position: "fixed", // ✅ ensures it flies across entire screen
            top: "20%", // adjust vertical height of the path
            left: "-200px", // start slightly offscreen
            width: 300,
            height: 300,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.6,
            animation: "flyAcross 6s linear infinite", // ✅ smoother & continuous
            "@keyframes flyAcross": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(120vw)" }, // ✅ full width across screen
            },
          }}
        >
          <Lottie animationData={animationFly} loop={true} />
        </Box>
      )}

      {animationCar && (
        <Box
          sx={{
            position: "fixed",
            top: "60%",
            left: "100vw", // start just offscreen on the right
            width: 300,
            height: 300,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.6,
            animation: "driftLeft 6s linear infinite",
            "@keyframes driftLeft": {
              "0%": { transform: "translateX(0)" }, // no offset at start
              "100%": { transform: "translateX(-120vw)" }, // moves left across screen
            },
          }}
        >
          <Lottie animationData={animationCar} loop />
        </Box>
      )}

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            height: { xs: "auto", md: 700 },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left: Image */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              height: { xs: 300, md: "100%" },
            }}
          >
            <CardMedia
              component="img"
              image={API_URL + (place.image || "uploads/default_image.jpg")}
              alt={place.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Grid>

          {/* Right: Details */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: { xs: "auto", md: "100%" },
            }}
          >
            <CardContent sx={{ flex: 1, overflowY: "auto", p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {place.name}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Rating
                  value={avgRating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {avgRating.toFixed(1)} ·{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: "#6b4de6",
                      fontWeight: 500,
                      cursor: "pointer",
                      textDecoration: "underline",
                      "&:hover": { color: "#4c34b4" },
                    }}
                    onClick={() => setOpenReviewDetailPage(true)}
                  >
                    View all {reviews.length} reviews
                  </Typography>
                </Typography>
              </Box>

              {/* Area */}
              <Box
                sx={{
                  display: "flex",
                  borderBottom: "1px solid lightgrey",
                  py: 1.5,
                }}
              >
                {animationlocation && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // space reserved for the animation
                      mr: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25, // responsive size
                        height: 25,
                      }}
                    >
                      <Lottie animationData={animationlocation} loop={true} />
                    </Box>
                  </Box>
                )}
                <Typography variant="subtitle1" sx={{ pl: 1.5 }}>
                  {place.area.city} {place.area.state}
                </Typography>
              </Box>

              {/* Description */}
              <Box
                sx={{
                  display: "flex",
                  borderBottom: "1px solid lightgrey",
                  py: 1.5,
                }}
              >
                {animationdetail && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // space reserved for the animation
                      mr: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25, // responsive size
                        height: 25,
                      }}
                    >
                      <Lottie animationData={animationdetail} loop={true} />
                    </Box>
                  </Box>
                )}
                <Typography variant="body1" sx={{ pl: 1.5 }}>
                  {place.description || "No description available."}
                </Typography>
              </Box>

              {/* Google Maps */}
              <Box
                sx={{
                  display: "flex",
                  borderBottom: "1px solid lightgrey",
                  py: 1.5,
                }}
              >
                {animationglobal && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // space reserved for the animation
                      mr: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25, // responsive size
                        height: 25,
                      }}
                    >
                      <Lottie animationData={animationglobal} loop={true} />
                    </Box>
                  </Box>
                )}
                <Typography variant="body1" sx={{ pl: 1.5 }}>
                  <a
                    href={place.googleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#514f4fff" }}
                  >
                    View on Google Maps
                  </a>
                </Typography>
              </Box>

              {/* Phone */}
              <Box
                sx={{
                  display: "flex",
                  borderBottom: "1px solid lightgrey",
                  py: 1.5,
                }}
              >
                {animationphone && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // space reserved for the animation
                      mr: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25, // responsive size
                        height: 25,
                      }}
                    >
                      <Lottie animationData={animationphone} loop={true} />
                    </Box>
                  </Box>
                )}
                <Typography variant="body1" sx={{ pl: 1.5 }}>
                  {place.phone}
                </Typography>
              </Box>

              {/* Opening Times */}
              <Box
                sx={{
                  borderBottom: "1px solid lightgrey",
                  py: 1.5,
                  display: "flex",
                }}
              >
                {animationtime && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",

                      // space reserved for the animation
                      mr: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25, // responsive size
                        height: 25,
                      }}
                    >
                      <Lottie animationData={animationtime} loop={true} />
                    </Box>
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  {place?.openTimes ? (
                    Object.entries(place.openTimes).map(([day, time]) => (
                      <Box
                        key={day}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pl: 1.5,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="body1">{day}</Typography>
                        <Typography variant="body1">{time || "—"}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ pl: 1.5, py: 0.5, color: "text.secondary" }}
                    >
                      No opening times available
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>

            {/* Bottom Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderTop: "1px solid lightgrey",
                bgcolor: "white",
              }}
            >
              <Box>
                {/* Wishlist */}
                <IconButton
                  sx={{
                    bgcolor: "white",
                    "&:hover": { bgcolor: "white" },
                    opacity: !token ? 0.5 : 1, // visually show it’s disabled
                    cursor: !token ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleWishlistToggle(place)}
                  disabled={!token}
                >
                  {wishlist.some((w) => w.place?._id === place._id) ? (
                    <Box>
                      {animationredlove && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // space reserved for the animation
                            mr: 1,
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
                            mr: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 25, // responsive size
                              height: 25,
                            }}
                          >
                            <Lottie animationData={animationlove} loop={true} />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </IconButton>

                {/* Review */}
                <IconButton
                  onClick={() => setOpenReviewForm(true)}
                  disabled={!token}
                  sx={{
                    bgcolor: "white",
                    "&:hover": { bgcolor: "white" },
                    opacity: !token ? 0.5 : 1, // visually show it’s disabled
                    cursor: !token ? "not-allowed" : "pointer",
                  }}
                >
                  {animationReview && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // space reserved for the animation
                        mr: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 25, // responsive size
                          height: 25,
                        }}
                      >
                        <Lottie animationData={animationReview} loop={true} />
                      </Box>
                    </Box>
                  )}
                </IconButton>
              </Box>

              <IconButton
                onClick={() => setOpenActivityForm(true)}
                disabled={!token}
                sx={{
                  opacity: !token ? 0.5 : 1, // visually show it’s disabled
                  cursor: !token ? "not-allowed" : "pointer",
                }}
              >
                {animationAdd && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // space reserved for the animation
                      mr: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25, // responsive size
                        height: 25,
                      }}
                    >
                      <Lottie animationData={animationAdd} loop={true} />
                    </Box>
                  </Box>
                )}
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* ---------------- Modals ---------------- */}
      <AddActivityForm
        open={openActivityForm}
        onClose={() => setOpenActivityForm(false)}
        placeId={place._id}
      />

      <Dialog
        open={openReviewForm}
        onClose={() => setOpenReviewForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <ReviewAddForm
            placeId={place._id}
            onSuccess={() => setOpenReviewForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Review Details Modal */}
      <ReviewDetailPage
        open={openReviewDetailPage}
        onClose={() => setOpenReviewDetailPage(false)}
        reviews={reviews}
        onDelete={handleDeleteReview}
        onEdit={handleEditReview}
      />

      {/* Edit Review Modal */}
      <Dialog
        open={openEditReviewForm}
        onClose={() => {
          setOpenEditReviewForm(false);
          setReviewToEdit(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          {reviewToEdit && (
            <ReviewEditForm
              reviewId={reviewToEdit._id}
              onSuccess={() => {
                setOpenEditReviewForm(false);
                setReviewToEdit(null);
                fetchReviews();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
