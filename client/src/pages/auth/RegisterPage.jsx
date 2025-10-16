import {
  Button,
  Paper,
  Box,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../utils/api_user";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// Same country data as LoginPage
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
    image: "/taipei101.avif",
  },
  {
    code: "kr",
    name: "Korea",
    flag: "https://flagcdn.com/w80/kr.png",
    image: "/korea.avif",
  },
  {
    code: "jp",
    name: "Japan",
    flag: "https://flagcdn.com/w80/jp.png",
    image: "/japan.avif",
  },
];

const RegisterPage = () => {
  const [cookies, setCookies] = useCookies(["currentuser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const navigate = useNavigate();
  const [iconAnimationData, setIconAnimationData] = useState(null);
  const [iconAnimationDataPassword, setIconAnimationDataPassword] =
    useState(null);
  const [iconAnimationDataEmail, setIconAnimationDataEmail] = useState(null);
  const [iconAnimationDataName, setIconAnimationDataName] = useState(null);
  const [animationBus, setAnimationBus] = useState(null);
  const [animationBike, setAnimationBike] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const userData = await registerUser(name, email, password);
      setCookies("currentuser", userData, { path: "/", maxAge: 60 * 60 * 8 });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

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
    fetch("/Plane.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationData(data));
  }, []);
  useEffect(() => {
    fetch("/avatar.json")
      .then((res) => res.json())
      .then((data) => setIconAnimationDataName(data));
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
        {/* Left section (Form 30%) */}
        <Box
          sx={{
            flex: 0.3,
            py: { xs: 4, sm: 6, md: 6.5 }, // balanced spacing across screens
            px: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
            maxWidth: { xs: "100%", sm: "450px", md: "500px" }, // keeps it neat on md
            mx: "auto", // centers the box if space allows
          }}
        >
          {iconAnimationData && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: 100, sm: 120, md: 140 }, // smoother scale
              }}
            >
              <Box
                sx={{
                  width: { xs: 250, sm: 230, md: 240 },
                  height: { xs: 80, sm: 100, md: 110 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Lottie animationData={iconAnimationData} loop={true} />
              </Box>
            </Box>
          )}

          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, sm: 2 },
              width: "100%",
            }}
          >
            <FormControl fullWidth sx={{ my: 1.2 }}>
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
                {iconAnimationDataName && (
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
                        animationData={iconAnimationDataName}
                        loop={true}
                      />
                    </Box>
                  </Box>
                )}
                <TextField
                  variant="standard"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                  }}
                />
              </Box>
            </FormControl>

            <FormControl fullWidth sx={{ my: 1.2 }}>
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
                    disableUnderline: true,
                  }}
                />
              </Box>
            </FormControl>

            {/* Password Field */}
            <FormControl fullWidth sx={{ my: 1.2 }}>
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

            {/* Confirm Password Field */}
            <FormControl fullWidth sx={{ my: 1.2 }}>
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
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                borderRadius: 2,
                backgroundColor: "rgba(161, 155, 155, 1)",
              }}
              type="submit"
            >
              Sign Up
            </Button>
          </Box>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mt: 4,
            }}
          >
            Already have an account?{" "}
            <IconButton onClick={() => navigate("/login")}>
              {iconAnimationDataName && (
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
                    <Lottie animationData={iconAnimationDataName} loop={true} />
                  </Box>
                </Box>
              )}
            </IconButton>
          </Typography>
        </Box>

        {/* Right section (Image + flag selector 70%) */}
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

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              p: 4,
            }}
          ></Box>

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
      </Paper>
    </Box>
  );
};

export default RegisterPage;
