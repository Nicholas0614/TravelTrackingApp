import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Rating,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import { addReview } from "../utils/api_reviews";
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

export default function ReviewAddForm({ placeId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null); // store uploaded image url
  const [loading, setLoading] = useState(false);
  const [animationDelete, setAnimationDelete] = useState(null);
  const [animationImage, setAnimationImage] = useState(null);
  const [animationConfirm, setAnimationConfirm] = useState(null);

  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const { token = "" } = currentuser || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating!");
      return;
    }

    setLoading(true);
    try {
      await addReview(
        placeId,
        {
          rating,
          comment,
          image,
        },
        token
      );

      toast.success("Review added successfully!");
      setRating(0);
      setComment("");
      setImage(null);
      onSuccess?.();
    } catch (err) {
      toast.error("You Already Comment This Place");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
    >
      <Typography variant="h6">Write a Review</Typography>

      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        size="large"
      />

      <TextField
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        multiline
        rows={3}
      />

      {/* Image Upload Section (same style as AddPlaceForm) */}
      <Box mb={2} sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {image ? (
          <>
            <img src={API_URL + image} width="100px" alt="review upload" />
            <Button size="small" onClick={() => setImage(null)}>
              {animationDelete && (
                <Box sx={{ width: 35, height: 35 }}>
                  <Lottie animationData={animationDelete} loop={true} />
                </Box>
              )}
            </Button>
          </>
        ) : (
          <Button component="label" role={undefined} tabIndex={-1}>
            {animationImage && (
              <Box sx={{ width: 35, height: 35 }}>
                <Lottie animationData={animationImage} loop={true} />
              </Box>
            )}
            <VisuallyHiddenInput
              type="file"
              onChange={async (event) => {
                const data = await uploadImage(event.target.files[0]);
                setImage(data.image_url); // {image_url: "uploads/file.jpg"}
              }}
              accept="image/*"
            />
          </Button>
        )}
      </Box>

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
