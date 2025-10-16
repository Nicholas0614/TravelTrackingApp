import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import { getWishlist, removeFromWishlist } from "../utils/api_wishlist";
import { API_URL } from "../utils/constants";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies || {};
  const { token = "" } = currentuser || {};
  const navigate = useNavigate();
  const [iconAnimationData, setIconAnimationData] = useState(null);
  const [animationredlove, setAnimationRedLove] = useState(null);

  useEffect(() => {
    if (!token) return;
    async function fetchWishlist() {
      try {
        const data = await getWishlist(token);
        setWishlist(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchWishlist();
  }, [token]);

  useEffect(() => {
    fetch("ufo.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationData(data));
  }, []);

  useEffect(() => {
    fetch("/redheartt.json")
      .then((res) => res.json())
      .then((data) => setAnimationRedLove(data));
  }, []);

  const handleRemove = async (placeId) => {
    try {
      await removeFromWishlist(placeId, token);
      toast.success("Removed from wishlist");
      setWishlist((prev) => prev.filter((item) => item.place._id !== placeId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <Container sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="medium">
          Please log in to Unlock Wishlist
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6, position: "relative" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 6,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ textTransform: "uppercase", letterSpacing: 1 }}
        >
          Wishlist
        </Typography>
        {iconAnimationData && (
          <Box sx={{ width: 80, height: 80 }}>
            <Lottie animationData={iconAnimationData} loop />
          </Box>
        )}
      </Box>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" color="text.secondary" mb={3}>
            Your wishlist is empty
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {wishlist
            .filter((item) => item.place)
            .map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.03)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => navigate(`/places/${item.place._id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      API_URL +
                      (item.place?.image
                        ? item.place.image
                        : "uploads/default_image.jpg")
                    }
                    alt={item.place?.name || "Unknown Place"}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {item.place?.name || "Unknown Place"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.place?.area?.city || "Unknown City"},{" "}
                      {item.place?.area?.state || "Unknown State"}
                    </Typography>
                  </CardContent>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.place._id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "rgba(255,255,255,0.9)",
                      borderRadius: "50%",
                      p: 0.5,
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                  >
                    {animationredlove && (
                      <Box sx={{ width: 30, height: 30 }}>
                        <Lottie animationData={animationredlove} loop />
                      </Box>
                    )}
                  </IconButton>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Container>
  );
}
