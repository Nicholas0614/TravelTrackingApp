import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NoPermission() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw", // ✅ fill full screen width
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#f0f0f0",
        p: 0, // ✅ remove all internal padding
        m: 0, // ✅ remove external margin
        overflow: "hidden", // ✅ prevent scrollbars
      }}
    >
      <Typography variant="h2" color="error" sx={{ fontWeight: "bold", mb: 2 }}>
        CAUGHT YOU 👀
      </Typography>

      <Box
        component="img"
        src="/caught.gif"
        alt="Caught in 4K"
        sx={{
          width: "450px",
          borderRadius: "12px",
          boxShadow: 3,
          mb: 3,
        }}
      />

      <Typography variant="h4" sx={{ mb: 3 }}>
        Tried sneaking in? Nah, I saw that.
      </Typography>

      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go Back Lah
      </Button>
    </Box>
  );
}
