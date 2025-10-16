import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Avatar,
  Rating,
  LinearProgress,
  IconButton,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { API_URL } from "../utils/constants";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { deleteReview } from "../utils/api_reviews";
import toast from "react-hot-toast";
import ReviewEditForm from "./ReviewEditForm";
import Lottie from "lottie-react";

export default function ReviewDetailPage({
  open,
  onClose,
  reviews: initialReviews,
}) {
  const [cookies] = useCookies(["currentuser"]);
  const currentuser = cookies?.currentuser || {};
  const token = currentuser?.token || "";

  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState("default"); // "highest" | "lowest" | "default"
  const [animation, setAnimation] = useState(null);
  const [animationDelete, setAnimationDelete] = useState(null);
  const [animationUpdate, setAnimationUpdate] = useState(null);
  const [animationClose, setAnimationClose] = useState(null);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  useEffect(() => {
    fetch("/delete.json")
      .then((res) => res.json())
      .then((data) => setAnimation(data));
  }, []);
  // Load & sort initial reviews
  useEffect(() => {
    if (initialReviews) {
      const sorted = [...initialReviews].sort((a, b) => {
        if (a.user?._id === currentuser?._id) return -1;
        if (b.user?._id === currentuser?._id) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setReviews(sorted);
    }
  }, [initialReviews, currentuser?._id]);

  useEffect(() => {
    fetch("/remove.json")
      .then((res) => res.json())
      .then((data) => setAnimationDelete(data));
    fetch("/edit.json")
      .then((res) => res.json())
      .then((data) => setAnimationUpdate(data));
    fetch("/close.json")
      .then((res) => res.json())
      .then((data) => setAnimationClose(data));
    fetch("/check.json")
      .then((res) => res.json())
      .then((data) => setAnimationConfirm(data));
  }, []);

  // Handle sorting
  const getSortedReviews = () => {
    const base = [...reviews];
    return base.sort((a, b) => {
      // User's review always stays on top
      if (a.user?._id === currentuser?._id) return -1;
      if (b.user?._id === currentuser?._id) return 1;

      if (sortOrder === "highest") return b.rating - a.rating;
      if (sortOrder === "lowest") return a.rating - b.rating;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // ---------------- Delete ----------------
  const handleDeleteClick = (reviewId) => {
    setDeleteId(reviewId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReview(deleteId, token);
      toast.success("Review deleted successfully");
      setReviews((prev) => prev.filter((r) => r._id !== deleteId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // ---------------- Edit Success ----------------
  const handleEditSuccess = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === updatedReview._id ? { ...updatedReview, user: r.user } : r
      )
    );
    toast.success("Review updated!");
    setEditingReview(null);
  };

  if (!reviews || reviews.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Reviews
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
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
          <Typography>No reviews yet. Be the first to add one!</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const sortedReviews = getSortedReviews();

  return (
    <>
      {/* ---------------- Review List ---------------- */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Reviews
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
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

        <DialogContent dividers sx={{ bgcolor: "#fafafa", p: 3 }}>
          {/* Average Rating */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            {/* --- Average Rating --- */}
            <Box sx={{ textAlign: "center", minWidth: 160 }}>
              <Typography variant="h2" fontWeight="bold" color="primary.main">
                {avgRating.toFixed(1)}
              </Typography>
              <Rating
                value={avgRating}
                precision={0.1}
                readOnly
                size="large"
                sx={{ mt: 0.5 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Based on {reviews.length} reviews
              </Typography>
            </Box>

            {/* --- Vertical Divider --- */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", sm: "block" }, height: 100 }}
            />

            {/* --- Rating Breakdown --- */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              {ratingCounts.map(({ star, count }) => {
                const percent = (count / reviews.length) * 100;
                return (
                  <Box
                    key={star}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      gap: 1.5,
                    }}
                  >
                    <Typography sx={{ width: 18 }}>{star}</Typography>
                    <Rating value={star} readOnly size="small" />
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          bgcolor: "#eee",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#4397f7ff",
                          },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: 24, textAlign: "right" }}
                    >
                      {count}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Sort Buttons */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, justifyContent: "flex-start" }}
          >
            <Button
              variant={sortOrder === "highest" ? "contained" : "outlined"}
              onClick={() => setSortOrder("highest")}
            >
              Highest
            </Button>
            <Button
              variant={sortOrder === "lowest" ? "contained" : "outlined"}
              onClick={() => setSortOrder("lowest")}
            >
              Lowest
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Individual Reviews */}
          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            {sortedReviews.map((review, idx) => {
              const isOwner =
                currentuser && review.user?._id === currentuser._id;

              return (
                <Box
                  key={review._id || idx}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "stretch", // ✅ makes image match text height
                    mb: 3,
                    gap: 2,
                    p: 2,
                  }}
                >
                  {/* 🖼 Left side - Image */}
                  {review.image && (
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: "100%", sm: 280 }, // full width on mobile
                        height: { xs: 200, sm: "auto" }, // fixed height on mobile
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#f5f5f5",
                      }}
                    >
                      {Array.isArray(review.image) ? (
                        <img
                          src={
                            review.image[0].startsWith("http")
                              ? review.image[0]
                              : API_URL + review.image[0]
                          }
                          alt="review"
                          style={{
                            width: "100%",
                            height: "100%", // ✅ stretch image to full height
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={
                            review.image.startsWith("http")
                              ? review.image
                              : API_URL + review.image
                          }
                          alt="review"
                          style={{
                            width: "100%",
                            height: "100%", // ✅ stretch image to full height
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Box>
                  )}

                  {/* 💬 Right side - Review info */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight="bold">
                          {review.user?.name || "Anonymous"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {isOwner && (
                        <Box>
                          <IconButton
                            size="small"
                            sx={{ mr: 0.5 }}
                            onClick={() => setEditingReview(review)}
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
                            size="small"
                            sx={{ color: "red" }}
                            onClick={() => handleDeleteClick(review._id)}
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
                      )}
                    </Box>

                    <Rating value={review.rating} readOnly size="small" />
                    {review.comment && (
                      <Typography
                        sx={{
                          mt: 1,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {review.comment}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>

      {/* ---------------- Edit Modal ---------------- */}
      {editingReview && (
        <Dialog
          open={Boolean(editingReview)}
          onClose={() => setEditingReview(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Review</DialogTitle>
          <DialogContent>
            <ReviewEditForm
              reviewId={editingReview._id}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* ---------------- Delete Confirm Dialog ---------------- */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        {animation && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // ✅ add this
              width: "100%",
              py: 2,
            }}
          >
            <Lottie
              animationData={animation}
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
            color: "black", // ✅ make text black
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.5rem",
            pt: 0,
          }}
        >
          Are U Sure ?
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>You won't be able to revert this!</Typography>
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
          <IconButton onClick={handleConfirmDelete}>
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
    </>
  );
}
