import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const area = [
  {
    value: "HECTARE",
    label: "ha",
  },
  {
    value: "ACRE",
    label: "ac",
  },
];

const crops = [
  {
    value: "Barley",
    label: "Barley"
  },
  {
    value: "Brinjal",
    label: "Brinjal"
  },
  {
    value: "Carrot",
    label: "Carrot"
  },
  {
    value: "Cauliflower",
    label: "Cauliflower"
  },
  {
    value: "Chickpea",
    label: "Chickpea",
  },
  {
    value: "Mustard",
    label: "Mustard",
  },
  {
    value: "Onion",
    label: "Onion",
  },
  {
    value: "Potato",
    label: "Potato",
  },
  {
    value: "Radish",
    label: "Radish",
  },
  {
    value: "Rice",
    label: "Rice",
  },
  {
    value: "Tomato",
    label: "Tomato",
  },
  {
    value: "Wheat",
    label: "Wheat",
  },
];

const Services = () => {
  //States
  // //For setting crop
  const [userCropInfo, setUserCropInfo] = useState({
    cropName: "",
    area: "",
    unit: "",
  });

  // const [cropinfo, setCropInfo] = useState(null);

  const handleChange = (e) => {
    setUserCropInfo({ ...userCropInfo, [e.target.name]: e.target.value });
  };

  // Function for Dose calculation -> called when calculate button is clicked.

  const updateAnswer = (e) => {
    var acreArea = 0, answer = {};

    // Converting area to Acres for easy calculation.
    if (userCropInfo.unit === "HECTARE")
      acreArea = userCropInfo.area * 2.47105;
    else
      acreArea = userCropInfo.area;


    // Conditional implementation of calculation
    if (userCropInfo.cropName === "Barley") {
      //Values as per standards
      let lBound = ((5.055 - 1) * acreArea).toFixed(2);
      let uBound = ((5.055 + 1) * acreArea).toFixed(2);
      answer.manures = {};
      answer.manures.FYM = `${lBound} - ${uBound} t`;
      answer.manures.urea = `${(55 * acreArea).toFixed(2)} Kg`;
      answer.seedRate = `43.54 - 54.43 Kg/Acre`;
      answer.seedsRequired = `${(43.54 * acreArea).toFixed(2)} - ${(54.43 * acreArea).toFixed(2)} Kgs`;
      answer.manures.phosphate = `${(12 * acreArea).toFixed(2)} Kg`;
      answer.manures.pottasium = `${(6 * acreArea).toFixed(2)} Kg`;
    }

    else if (userCropInfo.cropName === "Brinjal") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Carrot") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Cauliflower") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Chickpea") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Mustard") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Onion") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Potato") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Radish") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Rice") {
      // answer.FYM = 15 * acreArea;
    }

    else if (userCropInfo.cropName === "Tomato") {
      // answer.FYM = 15 * acreArea;
    }

    //If nothing above matched then default will be as same as Wheat
    else {
      answer.FYM = 15 * acreArea;
    }


    console.log(answer);
  }
  //Logic for dose calculation ends.

  return (
    <Container sx={{ mt: { xs: 6, sm: 8 }, padding: "5vmax" }}>
      <Typography
        variant="h2"
        color="cropHeading.main"
        fontFamily="Roboto"
        fontWeight="bold"
      >
        DOSE CALCULATOR
      </Typography>
      <Typography
        paddingTop={3}
        align="left"
        variant="h6"
        color="primary"
        fontFamily="Roboto"
        fontWeight="bold"
      >
        FarmHub  brings to you a unique feature on this website – Dose Calculator. <br/>
        Now, you can calculate the exact amount of fertilisers based on fertiliser application, growth phase of crop and acreage.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Crop name  */}
          <Typography
            paddingTop={5}
            align="left"
            variant="h5"
            color="cropHeading.main"
            fontFamily="Roboto"
            fontWeight="bold"
          >
            Crop Name
          </Typography>

          <Box
            component="form"
            ml="0"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "80%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-select-currency"
                select
                label="Crop name"
                name="cropName"
                onChange={handleChange}
                helperText="Select your crop name"
              >
                {crops.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Box>

          {/* Land area */}
          <Typography
            paddingTop={2}
            align="left"
            variant="h5"
            color="cropHeading.main"
            fontFamily="Roboto"
            fontWeight="bold"
          >
            Land area
          </Typography>

          <Box
            component="form"
            ml="0"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "80%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Area"
                name="area"
                onChange={handleChange}
                helperText="Select the area"
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Unit"
                name="unit"
                onChange={handleChange}
                helperText="Select the unit"
              >
                {area.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Box>

          <Button
            size="large"
            sx={{ marginTop: "1rem", width: "80%", textTransform: "none" }}
            color="tertiary"
            variant="contained"
            onClick={updateAnswer}
          >
            Calculate
          </Button>
        </Grid>

        <Grid item xs={6} display="block">
          <Typography
            id="dose-calculator-output"
            paddingTop={25}
            align="center"
            variant="h5"
            color="cropHeading.main"
            fontFamily="Roboto"
            fontWeight="bold"
          >
            UNDER DEVLOPMENT1⚠️
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Services;
