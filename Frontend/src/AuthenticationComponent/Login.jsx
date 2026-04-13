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
import { baseURL, loginEndpoint } from "../config";
const login = () => {
  const [password, setpassword] = useState(false);
  const[invalid,setvalid]=useState(false)
  const navigate = useNavigate();
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
      const body={
        username:values.username,
        password:values.password
      }
      axios.post(`${baseURL}${loginEndpoint}`,body).then(res=>{
        if(res.data.role.toLowerCase()=='user'){
       localStorage.setItem('user',JSON.stringify(res.data))
       navigate('/user')
        }
        if(res.data.role.toLowerCase()=='admin'){
           localStorage.setItem('user',JSON.stringify(res.data)) 
           navigate('/Admin')
        }

      }).catch(err=>{
        setvalid(true)
      })
    },
  });

  return (
    <StyledWrapper>
      <Box className="mainContainer">
        <Box
          className="subContainer"
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <img
            src={AirtelLogo}
            alt="airtel logo"
            style={{ width: "100px", height: "50px" }}
          />
          <Typography className="mainHeading">Login to your Account</Typography>
          <Typography className="subHeading">
            see what is Going on with your business
          </Typography>
             {invalid&&<Typography sx={{fontFamily:'Nunito sans',fontSize:'15px',color:'red'}}>Invalid Credentials!!</Typography>}
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
            <Button fullWidth className="loginBtn" type="submit">
              Login In
            </Button>
          </Box>

          <Box className="fieldContainer">
            <Box sx={{ display: "flex", gap: "5px", justifyContent: "center" }}>
              <Typography className="register-text">
                Not Registered Yet?
              </Typography>
              <Typography
                className="link"
                onClick={() => navigate("/signup")}
                sx={{ cursor: "pointer" }}
              >
                Register Now
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
    padding: "30px",
    border: "1px solid #E0E0E0",
    borderRadius: "10px",
    width: "60%",
    maxWidth: "700px",
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

export default login;
