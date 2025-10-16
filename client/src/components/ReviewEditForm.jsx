import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Rating,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import { getReview, updateReview } from "../utils/api_reviews";
import { uploadImage } from "../utils/api_image";
import { API_URL } from "../utils/constants";
import { useCookies } from "react-cookie";
import Lottie from "lottie-react";

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

export default function ReviewEditForm({ reviewId, onSuccess, onCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReview, setLoadingReview] = useState(true);
  const [animationDelete, setAnimationDelete] = useState(null);
  const [animationImage, setAnimationImage] = useState(null);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  useEffect(() => {
    async function fetchReview() {
      if (!reviewId) return;
      try {
        setLoadingReview(true);
        const review = await getReview(reviewId, token);
        if (!review) throw new Error("No review found");

        setRating(Number(review.rating) || 0);
        setComment(review.comment || "");

        if (Array.isArray(review.image)) {
          setImage(review.image[0] || null);
        } else {
          setImage(review.image || null);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load review");
      } finally {
        setLoadingReview(false);
      }
    }
    fetchReview();
  }, [reviewId, token]);

  useEffect(() => {
    fetch("/remove.json")
      .then((res) => res.json())
      .then((data) => setAnimationDelete(data));
    fetch("/photo.json")
      .then((res) => res.json())
      .then((data) => setAnimationImage(data));
    fetch("/check.json")
      .then((res) => res.json())
      .then((data) => setAnimationConfirm(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedReview = await updateReview(
        reviewId,
        { rating, comment, image },
        token
      );
      onSuccess && onSuccess(updatedReview);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  if (loadingReview) return <CircularProgress />;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
      }}
    >
      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        size="large"
      />

      <TextField
        label="Comment"
        fullWidth
        multiline
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {image ? (
          <>
            <img
              src={image.startsWith("http") ? image : API_URL + image}
              width="100px"
              alt="review"
            />
            <IconButton size="small" onClick={() => setImage(null)}>
              {animationDelete && (
                <Box sx={{ width: 35, height: 35 }}>
                  <Lottie animationData={animationDelete} loop={true} />
                </Box>
              )}
            </IconButton>
          </>
        ) : (
          <IconButton component="label" size="small">
            {animationImage && (
              <Box sx={{ width: 35, height: 35 }}>
                <Lottie animationData={animationImage} loop={true} />
              </Box>
            )}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                try {
                  const data = await uploadImage(e.target.files[0]);
                  setImage(data.image_url);
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to upload image");
                }
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* ---------------- Buttons at right bottom ---------------- */}
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
  );
}
