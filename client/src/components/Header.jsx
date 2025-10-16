import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Lottie from "lottie-react";

export default function Navbar() {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies || {};

  const [iconAnimationData, setIconAnimationData] = useState(null);
  const [iconLoadingAnimationData, setIconLoadingAnimationData] =
    useState(null);
  const [animationLogout, setAnimationLogout] = useState(null);
  const [animationLogin, setAnimationLogin] = useState(null);
  const [animationRegister, setAnimationRegister] = useState(null);

  const [walkingAnimations, setWalkingAnimations] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/Icon.json").then((res) => res.json()),
      fetch("/Loading.json").then((res) => res.json()),
      fetch("/Walking.json").then((res) => res.json()),
      fetch("/Walkingg.json").then((res) => res.json()),
      fetch("/Walking taco.json").then((res) => res.json()),
      fetch("/Wall.json").then((res) => res.json()),
    ]).then(([icon, loading, w1, w2, w3, w4]) => {
      setIconAnimationData(icon);
      setIconLoadingAnimationData(loading);
      setWalkingAnimations([w1, w2, w3, w4]);
    });
  }, []);

  useEffect(() => {
    fetch("/exit.json")
      .then((res) => res.json())
      .then((data) => setAnimationLogout(data));
  }, []);
  useEffect(() => {
    fetch("/avatar.json")
      .then((res) => res.json())
      .then((data) => setAnimationLogin(data));
  }, []);
  useEffect(() => {
    fetch("/document.json")
      .then((res) => res.json())
      .then((data) => setAnimationRegister(data));
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 1100);
  };

  const menuItems = [
    ...(currentuser && currentuser.role === "admin"
      ? [{ label: "Admin", path: "/admin" }]
      : []),
    { label: "Tourist", path: "/" },
    { label: "Food", path: "/food" },
    { label: "Shopping", path: "/shopping" },
    { label: "Stay", path: "/stay" },
    { label: "Wishlist", path: "/wishlist" },
    // Show Admin only for admin users
  ];

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(104, 104, 104, 0.8)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconLoadingAnimationData && (
            <Lottie
              animationData={iconLoadingAnimationData}
              loop
              style={{ width: 150, height: 150 }}
            />
          )}
        </Box>
      )}

      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ overflow: "hidden", borderBottom: "1px solid rgba(0,0,0,0.1)" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            px: { xs: 1, sm: 2, md: 4 },
            overflow: "hidden",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Logo + Animation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", md: "flex-start" },
              flexGrow: 1, // allow to share space
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {iconAnimationData && (
              <Box
                sx={{
                  width: { xs: 30, sm: 40 },
                  height: { xs: 30, sm: 40 },
                  mr: 1,
                  flexShrink: 0,
                }}
              >
                <Lottie animationData={iconAnimationData} loop />
              </Box>
            )}

            {/* Walking animations */}
            <Box
              sx={{
                display: { xs: "none", sm: "block" }, // hide on very small screens
                position: "relative",
                width: { sm: 300, md: 1500 },
                height: { xs: 40, sm: 50 },
                overflow: "hidden",
                flexShrink: 1,
              }}
            >
              {walkingAnimations.map((anim, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    left: "-60px",
                    bottom: 0,
                    width: { xs: 35, sm: 45 },
                    height: { xs: 35, sm: 45 },
                    animation: `walk 5s linear infinite`,
                    animationDelay: `${i * 1.3}s`,
                  }}
                >
                  <Lottie animationData={anim} loop />
                </Box>
              ))}
              <style>{`@keyframes walk {0% { left: -60px; opacity: 0; } 10% { opacity: 1; } 50% { opacity: 1; } 90% { opacity: 0; } 100% { left: 100%; opacity: 0; } }`}</style>
            </Box>
          </Box>

          {/* Hamburger (mobile only) */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Tabs + Buttons (desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              textColor="black"
              sx={{ "& .MuiTabs-indicator": { backgroundColor: "black" } }}
            >
              {menuItems.map((item, idx) => (
                <Tab
                  key={idx}
                  label={item.label}
                  sx={{ textTransform: "none" }}
                  onClick={() => handleNavigation(item.path)}
                />
              ))}
            </Tabs>

            {currentuser ? (
              <IconButton
                onClick={() => {
                  removeCookie("currentuser", { path: "/" });
                  navigate("/login");
                }}
                sx={{ ml: 2 }}
              >
                {animationLogout && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mr: 1,
                    }}
                  >
                    <Box sx={{ width: 30, height: 30 }}>
                      <Lottie animationData={animationLogout} loop />
                    </Box>
                  </Box>
                )}
              </IconButton>
            ) : (
              <>
                <IconButton onClick={() => handleNavigation("/login")}>
                  {animationLogin && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mr: 1,
                      }}
                    >
                      <Box sx={{ width: 30, height: 30 }}>
                        <Lottie animationData={animationLogin} loop />
                      </Box>
                    </Box>
                  )}
                </IconButton>
                <IconButton onClick={() => handleNavigation("/register")}>
                  {animationRegister && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mr: 1,
                      }}
                    >
                      <Box sx={{ width: 30, height: 30 }}>
                        <Lottie animationData={animationRegister} loop />
                      </Box>
                    </Box>
                  )}
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
          role="presentation"
          onClick={handleDrawerToggle}
        >
          <List>
            {menuItems.map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemButton onClick={() => handleNavigation(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem disablePadding>
              {currentuser ? (
                <ListItemButton
                  onClick={() => {
                    removeCookie("currentuser", { path: "/" });
                    navigate("/login");
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              ) : (
                <>
                  <ListItemButton onClick={() => handleNavigation("/login")}>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                  <ListItemButton onClick={() => handleNavigation("/register")}>
                    <ListItemText primary="Sign Up" />
                  </ListItemButton>
                </>
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
