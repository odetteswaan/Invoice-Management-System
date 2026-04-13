import {
  Box,
  Typography,
  styled,
  Button,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import AirtelLogo from "../assets/Airtel-logo.png";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {baseURL,uploadInvoice} from '../config' 
import axios from "axios";
import { CleaningServices } from "@mui/icons-material";
const validationSchema = Yup.object({
  invoice_id: Yup.string().required("Invoice ID is required"),
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be positive"),
  GST: Yup.number()
    .typeError("GST must be a number")
    .required("GST is required")
    .min(0, "GST cannot be negative"),
  file: Yup.mixed().required("File is required"),
});
const UserDashboard = () => {
  const [username, setName] = useState("");
  const formik = useFormik({
    initialValues: {
      invoice_id: "",
      name: "",
      description: "",
      amount: "",
      GST: "",
      file: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
      const user=JSON.parse(localStorage.getItem('user'))
      const formData = new FormData();

formData.append("invoice_id", values.invoice_id);
formData.append("name", values.name);
formData.append("description", values.description);
formData.append("amount", values.amount);
formData.append("GST", values.GST);
formData.append("file", values.file);
axios.post(`${baseURL}${uploadInvoice}`,formData,{
  headers:{
    Authorization:user.token
  }
}).then((res)=>{
console.log(res.data)
Alert("Invoice Submitted Sucessfully")
}).catch((err)=>{
  console.log(err)
})
        
    },
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setName(user.username);
  }, []);
  return (
    <StyledWrapper>
      <Box className="mainContainer">
        <Box className="headingContainer">
          <img
            src={AirtelLogo}
            alt="airtel logo"
            style={{ width: "100px", height: "50px" }}
          />
        </Box>
        <Box className="bodyContainer" component="form" onSubmit={formik.handleSubmit}>
          <Box sx={{ width: "60%" }}>
            <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <Typography className="heading">
                Hello {username == "" ? "User" : username}
              </Typography>
              <Typography className="subHeaing">
                {" "}
                Good to see you here !!
              </Typography>
            </Box>
            <Typography className="invoiceHeading">
              Fill your invoice details to Apply
            </Typography>

            <Box className="formContainer">
              <Box className="fieldContainer">
                <Typography className="fieldHeading">Invoice ID</Typography>
                <TextField
                  fullWidth
                  name="invoice_id"
                  value={formik.values.invoice_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.invoice_id &&
                    Boolean(formik.errors.invoice_id)
                  }
                  helperText={
                    formik.touched.invoice_id && formik.errors.invoice_id
                  }
                />
              </Box>
              <Box className="fieldContainer">
                <Typography className="fieldHeading">Name</Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Box>
              <Box className="fieldContainer">
                <Typography className="fieldHeading">Description</Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Box>
              <Box className="fieldContainer">
                <Typography className="fieldHeading">Amount</Typography>
                <TextField
                  fullWidth
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Box>
              <Box className="fieldContainer">
                <Typography className="fieldHeading">GST</Typography>
                <TextField
                  fullWidth
                  name="GST"
                  value={formik.values.GST}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.GST && Boolean(formik.errors.GST)}
                  helperText={formik.touched.GST && formik.errors.GST}
                />
              </Box>
              <Box className="fieldContainer">
                <Typography className="fieldHeading">
                  Upload Invoice File
                </Typography>
                <TextField
                  fullWidth
                  type="file"
                  name="file"
                  onChange={(event) => {
                    formik.setFieldValue("file", event.currentTarget.files[0]);
                  }}
                  error={formik.touched.file && Boolean(formik.errors.file)}
                  helperText={formik.touched.file && formik.errors.file}
                />
              </Box>
              <Box className="fieldContainer">
                <Button
                  type="submit"
                  fullWidth
                  className="loginBtn"
                  sx={{ marginTop: "15px" }}
                >
                 Submit Invoice
                </Button>
              </Box>
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
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
  },
  "& .headingContainer": {
    padding: "20px",
    backgroundColor: "#E0E0E0",
    position: "fixed",
    width: "100%",
  },
  "& .bodyContainer": {
    width: "100%",
    backgroundColor: "#F5F5F5",
    display: "flex",
    justifyContent: "center",
    marginTop: "90px",
    marginBottom:'50px',
  },
  "& .heading": {
    fontFamily: "Nunito sans",
    fontWeight: 700,
    fontSize: "30px",
    color: "#d57979",
  },
  "& .subHeaing": {
    fontFamily: "Nunito sans",
    fontSize: "15px",
    color: "#6c6a6a",
  },
  "& .invoiceHeading": {
    fontFamily: "Nunito sans",
    fontSize: "25px",
    color: "#549eed",
    marginTop: "15px",
  },
  "& .formContainer": {
    width: "100%",
    maxWidth: "700px",
    border: "1px solid #E0E0E0",
    borderRadius: "15px",
    padding: "30px",
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
}));
export default UserDashboard;
