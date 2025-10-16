import {
  Button,
  Paper,
  Box,
  FormControl,
  TextField,
  Typography,
  IconButton,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { loginUser } from "../../utils/api_user";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

const countryData = [
  {
    code: "my",
    name: "Malaysia",
    flag: "https://flagcdn.com/w80/my.png",
    image: "/klcc.jpg",
  },
  {
    code: "tw",
    name: "Taiwan",
    flag: "https://flagcdn.com/w80/tw.png",
    image: "/taipei101.avif", // Tokyo temple
  },
  {
    code: "kr",
    name: "Korea",
    flag: "https://flagcdn.com/w80/kr.png",
    image: "/korea.avif", // NYC
  },
  {
    code: "jp",
    name: "Japan",
    flag: "https://flagcdn.com/w80/jp.png",
    image: "/japan.avif", // Colosseum
  },
];

const LoginPage = () => {
  const [cookies, setCookies] = useCookies(["currentuser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const navigate = useNavigate();
  const [iconAnimationData, setIconAnimationData] = useState(null);
  const [iconAnimationDataPassword, setIconAnimationDataPassword] =
    useState(null);
  const [iconAnimationDataEmail, setIconAnimationDataEmail] = useState(null);
  const [animationRegister, setAnimationRegister] = useState(null);
  const [animationBus, setAnimationBus] = useState(null);
  const [animationBike, setAnimationBike] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const userData = await loginUser(email, password);
      setCookies("currentuser", userData, { path: "/", maxAge: 60 * 60 * 8 });
      toast.success("Login successful!");

      // Navigate based on role
      if (userData.role === "admin") {
        navigate("/admin"); // go to AdminPage
      } else {
        navigate("/"); // go to HomePage
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password."
      );
    }
  };

  useEffect(() => {
    fetch("animation/LoginIcon.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationData(data));
  }, []);
  useEffect(() => {
    fetch("/password.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationDataPassword(data));
  }, []);
  useEffect(() => {
    fetch("/email.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationDataEmail(data));
  }, []);

  useEffect(() => {
    fetch("/document.json")
      .then((res) => res.json())
      .then((data) => setAnimationRegister(data));
  }, []);
  useEffect(() => {
    fetch("/bike.json")
      .then((res) => res.json())
      .then((data) => setAnimationBike(data));
  }, []);
  useEffect(() => {
    fetch("/bus.json")
      .then((res) => res.json())
      .then((data) => setAnimationBus(data));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        pt: 3,
        overflow: "hidden",
      }}
    >
      {animationBus && (
        <Box
          sx={{
            position: "fixed", // ✅ ensures it flies across entire screen
            top: "13%", // adjust vertical height of the path
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
          <Lottie animationData={animationBus} loop={true} />
        </Box>
      )}

      {animationBike && (
        <Box
          sx={{
            position: "fixed",
            top: "58%",
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
          <Lottie animationData={animationBike} loop />
        </Box>
      )}
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "95%", sm: "90%", md: "1050px" },
          height: { md: "600px" },
          borderRadius: 5,
          overflow: "hidden",
          mb: 10,
          position: "relative", // ensures it is above animations
          zIndex: 1,
        }}
      >
        {/* Left section */}
        <Box
          sx={{
            flex: 0.7,
            position: "relative",
            backgroundColor: "#000",
            color: "white",
            overflow: "hidden",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Landmark Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCountry.code}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${selectedCountry.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </AnimatePresence>

          {/* Text */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              p: 4,
            }}
          ></Box>

          {/* Flag selector */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              p: 3,
              flexWrap: "wrap",
            }}
          >
            {countryData.map((country) => (
              <Box
                key={country.code}
                component="img"
                src={country.flag}
                alt={country.name}
                sx={{
                  width: 60,
                  height: 40,
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    selectedCountry.code === country.code
                      ? "3px solid white"
                      : "2px solid transparent",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => setSelectedCountry(country)}
              />
            ))}
          </Box>
        </Box>

        {/* Right section (Login Form) */}
        <Box
          sx={{
            flex: 0.3,
            p: { xs: 3, sm: 5, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          {iconAnimationData && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "150px", // space reserved for the animation
                mb: 5,
              }}
            >
              <Box
                sx={{
                  width: 200, // responsive size
                  height: 200,
                }}
              >
                <Lottie animationData={iconAnimationData} loop={true} />
              </Box>
            </Box>
          )}

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl fullWidth sx={{ my: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.42)", // same as MUI standard TextField line
                  "&:hover": {
                    borderBottom: "2px solid black",
                  },
                  pb: 0.5,
                }}
              >
                {iconAnimationDataEmail && (
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
                        width: 30, // responsive size
                        height: 30,
                      }}
                    >
                      <Lottie
                        animationData={iconAnimationDataEmail}
                        loop={true}
                      />
                    </Box>
                  </Box>
                )}
                <TextField
                  variant="standard"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  InputProps={{
                    disableUnderline: true, // disable default underline so it merges with your border
                  }}
                />
              </Box>
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
                  "&:hover": { borderBottom: "2px solid black" },
                  "&:focus-within": { borderBottom: "2px solid black" },
                  pb: 0.5,
                }}
              >
                {iconAnimationDataPassword && (
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
                        width: 30, // responsive size
                        height: 30,
                      }}
                    >
                      <Lottie
                        animationData={iconAnimationDataPassword}
                        loop={true}
                      />
                    </Box>
                  </Box>
                )}

                <TextField
                  variant="standard"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                  }}
                />
              </Box>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                py: 1.2,
                fontSize: "1rem",
                backgroundColor: "rgba(161, 155, 155, 1)",
              }}
              type="submit"
            >
              Login
            </Button>
          </Box>

          <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
            Don't have an account?{" "}
            <IconButton onClick={() => navigate("/register")}>
              {animationRegister && (
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
                      width: 30, // responsive size
                      height: 30,
                    }}
                  >
                    <Lottie animationData={animationRegister} loop={true} />
                  </Box>
                </Box>
              )}
            </IconButton>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
