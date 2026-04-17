import {
  Box,
  Typography,
  styled,
  Button,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import AirtelLogo from "./assets/Airtel-logo.png";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {baseURL,updateInvoice} from './config' 
import axios from "axios";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
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



const handleLogout = () => {
  localStorage.removeItem("user");
  
  window.location.href = "/";
};
const ShowInvoice = () => {
  const [username, setName] = useState("");
  const[valid,setValid]=useState()
  const[item,setItem]=useState()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setName(user.username);
    const item=JSON.parse(localStorage.getItem('item'))
    setItem(item)
  }, []);
  const formik = useFormik({
    initialValues: {
      invoice_id: item?item.invoice_id:'',
      name: item?item.name:'',
      description: item?item.description:"",
      amount: item?item.amount:"",
      GST: item?item.GST:"",
      file: null,
    },
    enableReinitialize: true,
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
      axios.put(`${baseURL}${updateInvoice(values.invoice_id)}`,formData,{
        headers:{
          Authorization:user.token
        }
      }).then((res)=>{
    console.log(res.data)
    setValid(1)
    
  }).catch((err)=>{
      console.log(err)
      setValid(2)
    })
    
  },
});
return (
  <StyledWrapper>
    
      <Box className="mainContainer">
        <Box className="headingContainer">
          <img
            src={AirtelLogo}
            alt="airtel logo"
            style={{ width: "100px", height: "50px" }}
            />
          <IconButton sx={{marginRight:"100px"}} onClick={handleLogout}>
            <LogoutOutlinedIcon/>
          </IconButton>
        </Box>
             <Box sx={{marginTop:'90px'}}>
            {(valid==1)&& <Alert severity="success">Data updated Successfully</Alert>}
            {(valid==2)&& <Alert severity="error">Data Updation failed failed please check you data and files</Alert>}

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
              Edit this Invoice
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
}
const StyledWrapper = styled(Box)(({ theme }) => ({
  "& .mainContainer": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #3a1c71, #1f4037)",
  },
  "& .headingContainer": {
    padding: "20px",
    backgroundColor: "#E0E0E0",
    position: "fixed",
    width: "100%",
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    zIndex:'1'
    
  },
  "& .bodyContainer": {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "90px",
    marginBottom:'50px',
    background: "linear-gradient(135deg, #3a1c71, #1f4037)",
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
    backgroundColor: "#F5F5F5",
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
export default ShowInvoice