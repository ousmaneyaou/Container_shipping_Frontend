import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  HelpOutline as HelpIcon,
  MailOutline as ContactIcon,
  AccountCircle as AccountIcon,
  AdminPanelSettings as AdminIcon,
  LocalShipping as ContainerIcon,
  Inventory as ParcelIcon,
  History as HistoryIcon,
  GpsFixed as TrackingIcon,
  Phone as PhoneIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import ApiService from "../../services/ApiServices";
import { toast } from "react-toastify";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isAdmin = ApiService.isAdmin();
  const isAuthenticated = ApiService.isAuthenticated();

  const amazonDark = "#0a1128";
  const amazonLight = "#232f3e";
  const amazonOrange = "#febd69";
  const amazonTextLight = "#ffffff";

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLanguageAnchorEl(null);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      t("confirm_logout") || "Voulez-vous vous déconnecter ?"
    );
    if (confirmLogout) {
      ApiService.logout();
      navigate("/login");
    }
  };

  const handleProtectedNavigation = (path) => {
    if (!isAuthenticated) {
      toast.warning("⚠️ Veuillez vous connecter pour accéder à cette page.");
      navigate("/login");
    } else {
      if (window.location.pathname !== path) {
        navigate(path);
      } else {
        navigate("/temp");
        setTimeout(() => navigate(path), 0);
      }
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [mobileMenuOpen]);

  const buttonStyle = {
    mx: 0.5,
    fontWeight: 500,
    color: amazonTextLight,
    fontSize: "0.9rem",
    minWidth: "auto",
    "&:hover": {
      outline: "1px solid white",
      borderRadius: "2px",
    },
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: amazonDark, boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 3,
                cursor: "pointer",
                p: 0.5,
                "&:hover": { outline: "1px solid white", borderRadius: "2px" },
              }}
              onClick={() => navigate("/")}
            >
              <ContainerIcon
                sx={{ color: amazonOrange, fontSize: 32, mr: 1 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: amazonTextLight,
                  textTransform: "uppercase",
                  fontFamily: "'Amazon Ember', Arial, sans-serif",
                }}
              >
                SARAYA
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                <Button
                  color="inherit"
                  endIcon={<span style={{ fontSize: "0.8rem" }}>▼</span>}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={buttonStyle}
                >
                  {t("reservation")}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    sx: {
                      bgcolor: amazonLight,
                      border: `1px solid ${amazonOrange}`,
                      minWidth: 250,
                      py: 0,
                    },
                  }}
                >
                  {[
                    {
                      label: t("book_container"),
                      icon: <ContainerIcon />,
                      path: "/",
                    },
                    {
                      label: t("parcel"),
                      icon: <ParcelIcon />,
                      path: "/colis",
                    },
                    {
                      label: t("booking_history"),
                      icon: <HistoryIcon />,
                      path: "/mes-reservations",
                    },
                    {
                      label: t("track_container"),
                      icon: <TrackingIcon />,
                      path: "/tracking",
                    },
                  ].map((item, i) => (
                    <MenuItem
                      key={i}
                      onClick={() => {
                        handleProtectedNavigation(item.path);
                        setAnchorEl(null);
                      }}
                      sx={{
                        py: 1.5,
                        bgcolor: amazonLight,
                        "&:hover": { bgcolor: "#37475a" },
                      }}
                    >
                      <ListItemIcon sx={{ color: amazonOrange }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText sx={{ color: "white" }}>
                        {item.label}
                      </ListItemText>
                    </MenuItem>
                  ))}
                </Menu>

                <Button
                  color="inherit"
                  startIcon={<PhoneIcon sx={{ color: amazonOrange }} />}
                  href="https://wa.me/221778596661"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    mx: 1,
                    fontWeight: 600,
                    bgcolor: "rgba(240, 193, 75, 0.15)",
                    color: amazonOrange,
                    border: "1px solid rgba(240, 193, 75, 0.3)",
                    "&:hover": { bgcolor: "rgba(240, 193, 75, 0.25)" },
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Book Now - Call us 24/7
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: amazonOrange }}
                    >
                      +221 77 859 66 61
                    </Typography>
                  </Box>
                </Button>
              </Box>
            )}

            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  color="inherit"
                  startIcon={<LanguageIcon sx={{ color: "white" }} />}
                  onClick={(e) => setLanguageAnchorEl(e.currentTarget)}
                  sx={buttonStyle}
                >
                  {i18n.language.toUpperCase()}
                </Button>
                <Menu
                  anchorEl={languageAnchorEl}
                  open={Boolean(languageAnchorEl)}
                  onClose={() => setLanguageAnchorEl(null)}
                  MenuListProps={{
                    sx: {
                      bgcolor: amazonLight,
                      border: `1px solid ${amazonOrange}`,
                      py: 0,
                      minWidth: 150,
                    },
                  }}
                >
                  {["fr", "en"].map((lang) => (
                    <MenuItem
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      selected={i18n.language === lang}
                      sx={{
                        bgcolor:
                          i18n.language === lang ? "#37475a" : "transparent",
                        "&:hover": { bgcolor: "#37475a" },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: i18n.language === lang ? 700 : 400,
                          color: "white",
                          fontSize: "0.9rem",
                        }}
                      >
                        {lang === "fr" ? "Français (FR)" : "English (EN)"}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>

                <Button
                  color="inherit"
                  startIcon={<HelpIcon />}
                  onClick={() => navigate("/help")}
                  sx={buttonStyle}
                >
                  {t("help")}
                </Button>
                <Button
                  color="inherit"
                  startIcon={<ContactIcon />}
                  onClick={() => navigate("/contact")}
                  sx={buttonStyle}
                >
                  {t("Contact")}
                </Button>

                {isAuthenticated && (
                  <Button
                    color="inherit"
                    startIcon={<AccountIcon />}
                    onClick={() => navigate("/mon-compte")}
                    sx={buttonStyle}
                  >
                    Mon compte
                  </Button>
                )}

                {isAdmin && (
                  <Button
                    color="inherit"
                    startIcon={<AdminIcon />}
                    onClick={() => navigate("/admin")}
                    sx={{
                      ...buttonStyle,
                      color: amazonOrange,
                      fontWeight: 700,
                    }}
                  >
                    Admin
                  </Button>
                )}

                {!isAuthenticated ? (
                  <Button
                    color="inherit"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate("/login")}
                    sx={{
                      ...buttonStyle,
                      bgcolor: "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    {t("login")}
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    startIcon={<LogoutIcon sx={{ color: "#ff6b6b" }} />}
                    onClick={handleLogout}
                    sx={{
                      ...buttonStyle,
                      bgcolor: "rgba(231, 76, 60, 0.2)",
                      color: "#ff6b6b",
                      "&:hover": {
                        bgcolor: "rgba(231, 76, 60, 0.3)",
                        outline: "1px solid #ff6b6b",
                      },
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Box>
            )}

            {isMobile && (
              <IconButton
                size="large"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <CloseIcon sx={{ color: "white" }} />
                ) : (
                  <MenuIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Bloc menu mobile ici */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: amazonDark,
            zIndex: theme.zIndex.drawer,
            pt: "64px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            px: 2,
          }}
        >
          {/* ... le code du menu mobile inséré ici, voir réponse précédente ... */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: amazonDark,
              zIndex: theme.zIndex.drawer,
              pt: "64px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              px: 2,
            }}
          >
            {/* Bouton X pour fermer */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <IconButton onClick={() => setMobileMenuOpen(false)}>
                <CloseIcon sx={{ color: amazonTextLight }} />
              </IconButton>
            </Box>

            {/* Liens de navigation mobile */}
            {[
              {
                label: t("book_container"),
                icon: <ContainerIcon />,
                path: "/",
              },
              {
                label: t("parcel"),
                icon: <ParcelIcon />,
                path: "/colis",
              },
              {
                label: t("booking_history"),
                icon: <HistoryIcon />,
                path: "/mes-reservations",
              },
              {
                label: t("track_container"),
                icon: <TrackingIcon />,
                path: "/tracking",
              },
            ].map((item, i) => (
              <Button
                key={i}
                startIcon={item.icon}
                onClick={() => handleProtectedNavigation(item.path)}
                sx={{
                  justifyContent: "flex-start",
                  color: "white",
                  textTransform: "none",
                  py: 1.5,
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {item.label}
              </Button>
            ))}

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

            <Button
              startIcon={<HelpIcon />}
              onClick={() => {
                navigate("/help");
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", color: "white", py: 1.5 }}
            >
              {t("help")}
            </Button>

            <Button
              startIcon={<ContactIcon />}
              onClick={() => {
                navigate("/contact");
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", color: "white", py: 1.5 }}
            >
              {t("Contact")}
            </Button>

            {isAuthenticated && (
              <Button
                startIcon={<AccountIcon />}
                onClick={() => {
                  navigate("/mon-compte");
                  setMobileMenuOpen(false);
                }}
                sx={{ justifyContent: "flex-start", color: "white", py: 1.5 }}
              >
                Mon compte
              </Button>
            )}

            {isAdmin && (
              <Button
                startIcon={<AdminIcon />}
                onClick={() => {
                  navigate("/admin");
                  setMobileMenuOpen(false);
                }}
                sx={{
                  justifyContent: "flex-start",
                  color: amazonOrange,
                  py: 1.5,
                  fontWeight: 700,
                }}
              >
                Admin
              </Button>
            )}

            {!isAuthenticated ? (
              <Button
                startIcon={<LoginIcon />}
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                sx={{ justifyContent: "flex-start", color: "white", py: 1.5 }}
              >
                {t("login")}
              </Button>
            ) : (
              <Button
                startIcon={<LogoutIcon sx={{ color: "#ff6b6b" }} />}
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                sx={{
                  justifyContent: "flex-start",
                  color: "#ff6b6b",
                  py: 1.5,
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
