import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLocationAltTwoToneIcon from "@mui/icons-material/AddLocationAltTwoTone";
import AddHomeWorkTwoToneIcon from "@mui/icons-material/AddHomeWorkTwoTone";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import AddAreaForm from "../components/AreaAddForm";
import AddPlaceForm from "../components/PlaceAddForm";
import AddCategoryForm from "../components/CategoryAddForm";
import EditAreaForm from "../components/AreaEditForm";
import EditCategoryForm from "../components/CategoryEditForm";
import EditPlaceForm from "../components/PlaceEditForm";

import { getAreas, deleteArea } from "../utils/api_area";
import { getPlaces, deletePlace } from "../utils/api_places";
import { getCategories, deleteCategory } from "../utils/api_categories";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [areas, setAreas] = useState([]);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [, , removeCookie] = useCookies(["currentuser"]);
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [reload, setReload] = useState(false);

  // dialog states
  const [openAddArea, setOpenAddArea] = useState(false);
  const [openEditArea, setOpenEditArea] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openAddPlace, setOpenAddPlace] = useState(false);
  const [openEditPlace, setOpenEditPlace] = useState(false);

  // fetch data
  useEffect(() => {
    async function fetchData() {
      const [areasData, placesData, categoriesData] = await Promise.all([
        getAreas(),
        getPlaces(),
        getCategories(),
      ]);
      setAreas(areasData);
      setPlaces(placesData);
      setCategories(categoriesData);
    }
    fetchData();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
    setOpenAddArea(false);
    setOpenEditArea(false);
    setOpenAddCategory(false);
    setOpenEditCategory(false);
    setOpenAddPlace(false);
    setOpenEditPlace(false);
  };

  // delete handlers
  const handleAreaDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the area!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteArea(id);
        setAreas(await getAreas());
        toast.success("Area deleted");
      }
    });
  };

  const handleCategoryDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategory(id);
        setCategories(await getCategories());
        toast.success("Category deleted");
      }
    });
  };

  const handlePlacesDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the place!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deletePlace(id);
        setPlaces(await getPlaces());
        toast.success("Place deleted");
      }
    });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        mb={4}
        textAlign="center"
        sx={{ fontFamily: "monospace" }}
      >
        Admin Panel
      </Typography>

      <Grid container spacing={2}>
        {/* LEFT SIDE (50%) */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Categories */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" mb={2} sx={{ fontFamily: "monospace" }}>
              Categories
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => setOpenAddCategory(true)}
              >
                <AddBoxTwoToneIcon />
              </IconButton>
            </Typography>
            <Paper sx={{ p: 2 }}>
              {categories.length === 0 ? (
                <Typography>No categories yet.</Typography>
              ) : (
                categories.map((cat) => {
                  const isUsed = places.some(
                    (place) => place.category?._id === cat._id
                  );
                  return (
                    <Typography
                      key={cat._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {cat.name}
                      <Box>
                        <IconButton
                          onClick={() => {
                            setSelectedCategory(cat);
                            setOpenEditCategory(true);
                          }}
                        >
                          <EditTwoToneIcon />
                        </IconButton>
                        <IconButton
                          disabled={isUsed}
                          onClick={() => handleCategoryDelete(cat._id)}
                        >
                          <DeleteTwoToneIcon />
                        </IconButton>
                      </Box>
                    </Typography>
                  );
                })
              )}
            </Paper>
          </Box>

          {/* Areas */}
          <Box>
            <Typography variant="h5" mb={2} sx={{ fontFamily: "monospace" }}>
              Areas
              <IconButton sx={{ ml: 1 }} onClick={() => setOpenAddArea(true)}>
                <AddLocationAltTwoToneIcon />
              </IconButton>
            </Typography>
            <Paper sx={{ p: 2 }}>
              {areas.length === 0 ? (
                <Typography>No areas yet.</Typography>
              ) : (
                Array.from(new Set(areas.map((a) => a.country))).map(
                  (country) => {
                    const countryAreas = areas.filter(
                      (a) => a.country === country
                    );

                    return (
                      <Box key={country} sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 1, color: "primary.main" }}
                        >
                          {country}
                        </Typography>

                        {countryAreas.map((area) => {
                          const isUsed = places.some(
                            (place) => place.area?._id === area._id
                          );

                          return (
                            <Typography
                              key={area._id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                pl: 2,
                              }}
                            >
                              {area.state} / {area.city}
                              <Box>
                                <IconButton
                                  onClick={() => {
                                    setSelectedArea(area);
                                    setOpenEditArea(true);
                                  }}
                                >
                                  <EditTwoToneIcon />
                                </IconButton>
                                <IconButton
                                  disabled={isUsed}
                                  onClick={() => handleAreaDelete(area._id)}
                                >
                                  <DeleteTwoToneIcon />
                                </IconButton>
                              </Box>
                            </Typography>
                          );
                        })}
                      </Box>
                    );
                  }
                )
              )}
            </Paper>
          </Box>
        </Grid>

        {/* RIGHT SIDE (50%) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" mb={2} sx={{ fontFamily: "monospace" }}>
            Places
            <IconButton sx={{ ml: 1 }} onClick={() => setOpenAddPlace(true)}>
              <AddHomeWorkTwoToneIcon />
            </IconButton>
          </Typography>

          <Paper sx={{ p: 2 }}>
            {places.length === 0 ? (
              <Typography>No places yet.</Typography>
            ) : (
              // Group by country
              Array.from(new Set(places.map((p) => p.area?.country))).map(
                (country) => {
                  const countryPlaces = places.filter(
                    (p) => p.area?.country === country
                  );

                  return (
                    <Box key={country} sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 1, color: "primary.main" }}
                      >
                        {country}
                      </Typography>

                      {/* Group by state */}
                      {Array.from(
                        new Set(countryPlaces.map((p) => p.area?.state))
                      ).map((state) => {
                        const statePlaces = countryPlaces.filter(
                          (p) => p.area?.state === state
                        );

                        return (
                          <Box key={state} sx={{ mb: 3, ml: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                              {state}
                            </Typography>

                            {/* Group by category inside each state */}
                            {Array.from(
                              new Set(statePlaces.map((p) => p.category?.name))
                            ).map((categoryName) => {
                              const categoryPlaces = statePlaces.filter(
                                (p) => p.category?.name === categoryName
                              );

                              return (
                                <Box key={categoryName} sx={{ mb: 2, ml: 3 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ mb: 1, color: "text.secondary" }}
                                  >
                                    {categoryName || "Uncategorized"}
                                  </Typography>

                                  {/* List of places */}
                                  {categoryPlaces.map((place) => (
                                    <Typography
                                      key={place._id}
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        pl: 3,
                                      }}
                                    >
                                      {place.name} ({place.area?.city})
                                      <Box>
                                        <IconButton
                                          onClick={() => {
                                            setSelectedPlaces(place);
                                            setOpenEditPlace(true);
                                          }}
                                        >
                                          <EditTwoToneIcon />
                                        </IconButton>
                                        <IconButton
                                          onClick={() =>
                                            handlePlacesDelete(place._id)
                                          }
                                        >
                                          <DeleteTwoToneIcon />
                                        </IconButton>
                                      </Box>
                                    </Typography>
                                  ))}
                                </Box>
                              );
                            })}
                          </Box>
                        );
                      })}
                    </Box>
                  );
                }
              )
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <Dialog
        open={openAddArea}
        onClose={() => setOpenAddArea(false)}
        fullWidth
      >
        <DialogTitle>
          <IconButton
            onClick={() => setOpenAddArea(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddAreaForm onSuccess={handleReload} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEditArea}
        onClose={() => setOpenEditArea(false)}
        fullWidth
      >
        <DialogTitle>
          <IconButton
            onClick={() => setOpenEditArea(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EditAreaForm area={selectedArea} onSuccess={handleReload} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
        fullWidth
      >
        <DialogTitle>
          <IconButton
            onClick={() => setOpenAddCategory(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddCategoryForm onSuccess={handleReload} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEditCategory}
        onClose={() => setOpenEditCategory(false)}
        fullWidth
      >
        <DialogTitle>
          <IconButton
            onClick={() => setOpenEditCategory(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EditCategoryForm
            category={selectedCategory}
            onSuccess={handleReload}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAddPlace}
        onClose={() => setOpenAddPlace(false)}
        fullWidth
      >
        <DialogTitle>
          <IconButton
            onClick={() => setOpenAddPlace(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddPlaceForm
            onSuccess={handleReload}
            areas={areas}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEditPlace}
        onClose={() => setOpenEditPlace(false)}
        fullWidth
      >
        <DialogTitle>
          <IconButton
            onClick={() => setOpenEditPlace(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EditPlaceForm
            place={selectedPlaces}
            onSuccess={handleReload}
            areas={areas}
            categories={categories}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
