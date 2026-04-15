import {
  Box,
  Typography,
  Button,
  styled,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import AirtelLogo from "../assets/Airtel-logo.png";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseURL, signupEndpoint } from "../config";
const Signup = () => {
  const [password, setpassword] = useState(false);
  const[valid,setValid]=useState(false)
  const navigate=useNavigate()
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: (values) => {
      const body = {
        username: values.username,
        password: values.password,
      };
          axios.post(`${baseURL}${signupEndpoint}`,body).then((res)=>{
                 navigate('/') 
          }).catch(err=>{
            setValid(true)
          })
    },
  });
  return (
    <StyledWrapper>
      <Box
        className="mainContainer"
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Box className="subContainer">
          <img
            src={AirtelLogo}
            alt="airtel logo"
            style={{ width: "100px", height: "50px" }}
          />
          <Typography className="mainHeading">Get Started Now</Typography>
          <Typography className="subHeading">
            Create Your Business Account Today
          </Typography>
          {valid&&<Typography sx={{fontFamily:'Nunito sans',fontSize:'15px',color:'red'}}>Username already exist , Please enter different username</Typography>}

          <Box className="fieldContainer">
            <Typography className="fieldHeading">Username</Typography>
            <TextField
              fullWidth
              name="username"
              className="inputfield"
              placeholder="Enter your username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person2Icon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box className="fieldContainer">
            <Typography className="fieldHeading">Password</Typography>
            <TextField
              type={password ? "text" : "password"}
              fullWidth
              name="password"
              className="inputfield"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {password ? (
                        <IconButton onClick={() => setpassword(false)}>
                          <VisibilityIcon />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => setpassword(true)}>
                          <VisibilityOffIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box className="fieldContainer">
            <Button fullWidth className="loginBtn"  type="submit">
              Register
            </Button>
          </Box>

          <Box className="fieldContainer">
            <Box sx={{ display: "flex", gap: "5px", justifyContent: "center" }}>
              <Typography className="register-text">
                Already have Account?
              </Typography>
              <Typography
                className="link"
                onClick={() => navigate("/")}
                sx={{ cursor: "pointer" }}
              >
                Login Now
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Box)(({ theme }) => ({
  "& .mainContainer": {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  "& .subContainer": {
    width: "60%",
    maxWidth: "700px",
    padding: "30px",
    border: "1px solid #E0E0E0",
    borderRadius: "15px",
  },
  "& .mainHeading": {
    fontFamily: "Nunito Sans",
    fontWeight: 600,
    fontSize: "30px",
    color: "#6b6b6b",
  },
  "& .subHeading": {
    fontFamily: "Nunito Sans",
    fontWeight: 400,
    fontSize: "10px",
    color: "#6b6b6b",
  },
  "& .fieldHeading": {
    fontFamily: "Nunito Sans",
    fontWeight: 400,
    fontSize: "17px",
    color: "#6b6b6b",
  },
  "& .fieldContainer": {
    marginTop: "10px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
  "& .loginBtn": {
    borderRadius: "10px",
    backgroundColor: "#7F265B",
    color: "white",
    height: "50px",
  },
  "& .register-text": {
    fontFamily: "Nunito Sans",
    fontSize: "18px",
    color: "#6b6b6b",
  },
  "& .link": {
    fontFamily: "Nunito Sans",
    fontSize: "18px",
    color: "#7F265B",
  },
}));
export default Signup;
