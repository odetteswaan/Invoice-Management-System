import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  styled,
  IconButton,
} from "@mui/material";
import AirtelLogo from "../assets/Airtel-logo.png";
import { useEffect, useState } from "react";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { baseURL, getInvoicesEndpoint, updateStatus } from "../config";
import axios from "axios";
const ViewInvoice = () => {
    const [item,setItem]=useState()
    const handleLogout = () => {
        localStorage.removeItem("user");
    
        window.location.href = "/";
      };

useEffect(()=>{
const item=JSON.parse(localStorage.getItem('item'))
setItem(item)


},[])

 const UpdateStatus = (invoiceID, status) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("i got triggered")
    const body = {
      status: status,
    };
    axios
      .put(`${baseURL}${updateStatus(invoiceID)}`, body, {
        headers: {
          Authorization: user.token,
        },
      })
      .then(() => {
        const newItem=item;
        newItem.status=status;
        localStorage.setItem('item',JSON.stringify(newItem))
        window.location.reload();
      })
      .catch((err) => console.log("error is", err));
  };
  return (
    <StyledWrapper>
    <Box className="mainContainer">
    <Box className="headerContainer">
              <img
                src={AirtelLogo}
                alt="airtel logo"
                style={{ width: "100px", height: "50px" }}
              />
              <IconButton sx={{ marginRight: "50px" }} onClick={handleLogout}>
                <LogoutOutlinedIcon color="black" />
              </IconButton>
            </Box>

    <Box className="bodyContainer">
        <Box className="cardContainer">
            <Box className="cardHeading">
                <Typography className="heading">Invoice Detail</Typography>
            </Box>
            <Box className="cardBody">
             <Typography className="invoiceDetail">Invoice ID : {item&&item.invoice_id}</Typography>
             <Typography className="invoiceDetail">Invoice Name :  {item&&item.name}</Typography>
            </Box>
            <Box className="cardBody">
             <Typography className="invoiceDetail">Invoice Description : {item&&item.description}</Typography>
             <Typography className="invoiceDetail">Invoice Amount : {item&&item.amount}</Typography>
            </Box>

            <Box className="cardBody">
             <Typography className="invoiceDetail">Invoice GST : {item&&item.GST}%</Typography>
            </Box>
            {item&&item.status.toLowerCase()=='pending'&&
            <Box className="cardBody">
                 <Button className="approveBtn" startIcon={<DoneIcon/>}
                 onClick={()=>UpdateStatus(item.invoice_id,'approved')}
                 >Approve</Button>
                 <Button className="rejectBtn" startIcon={<CloseIcon/>}
                 onClick={()=>UpdateStatus(item.invoice_id,'rejected')}
                 > Reject</Button>

            </Box>}
            {item&&item.status.toLowerCase()=='approved'&&
            <Box className="cardBody">
                 <Button className="approvedBtn" startIcon={<CheckCircleIcon/>} disabled>Approved</Button>

            </Box>}
            {item&&item.status.toLowerCase()=='rejected'&&
            <Box className="cardBody">
                 <Button className="rejectedBtn" startIcon={<CancelIcon/>} disabled>Rejected</Button>

            </Box>}


        </Box>
    </Box>

    </Box>
    

    </StyledWrapper>
  )
}
const StyledWrapper = styled(Box)(({ theme }) => ({
  "& .mainContainer": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: 'linear-gradient(135deg, #3a1c71, #1f4037)',
    height:'100vh'
  },
  "& .headerContainer": {
    width: "100%",
    padding: "20px",
    backgroundColor: "#E0E0E0",
    position: "fixed",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "& .bodyContainer":{
          marginTop:'90px',
          width:'100%',
          height:'90vh',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
  },
  "& .cardContainer":{
    padding:'30px',
    backgroundColor:'white',
    width:"60%",
    maxWidth:'700px',
    minWidth:'300px',
    display:'flex',
    flexDirection:'column',
    borderRadius:'20px'
  },
  "& .cardHeading":{
    width:'100%',
    display:'flex',
    justifyContent:'center'
  },
  "& .heading":{
   fontFamily:'Nunito sans',
   fontSize:'24px',
   fontWeight:700 
  },
  "& .cardBody":{
    width:'100%',
    paddingTop:'10px',
    paddingBottom:"10px",
    display:'flex',
    justifyContent:'space-between'
  },
  "& .invoiceDetail":{
    fontFamily:'Nunito sans',
    fontSize:'16px',
    fontWeight:600
  },
  "& .approveBtn":{
    background: "linear-gradient(135deg, #00c853, #64dd17)",
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "10px",
    padding: "8px 18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "0.3s",
    "&:hover": {
      background: "linear-gradient(135deg, #00b248, #52c41a)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
    },
  },
  "& .rejectBtn":{
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "10px",
    padding: "8px 18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "0.3s",
    "&:hover": {
      background: "linear-gradient(135deg, #e53935, #d32f2f)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
    }, 
  },
  "& .approvedBtn":{
    background: "linear-gradient(135deg, #28C76F, #81FBB8)",
    width:'100%',
    height:'50px',
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "12px",
    padding: "6px 16px",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(40, 199, 111, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #20b864, #5ee7a0)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(40, 199, 111, 0.4)",
    },
  },
  "& .rejectedBtn":{
    background: "linear-gradient(135deg, #FF4B2B, #FF416C)",
    width:'100%',
    height:'50px',
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "12px",
    padding: "6px 16px",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(255, 65, 108, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #e53935, #d32f2f)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(255, 65, 108, 0.4)",
    },
  }



}))
export default ViewInvoice