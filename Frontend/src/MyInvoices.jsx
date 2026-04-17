import React from "react";
import { Box, Typography, styled, IconButton, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AirtelLogo from "./assets/Airtel-logo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { baseURL, myInvoices } from "./config";
import { useNavigate } from "react-router-dom";
import ChatbotUI from "./Chatbot";
const MyInvoices = () => {
  const [data, setData] = useState();
  const[limit,setLimit]=useState(10)
  const Navigate = useNavigate();
  const[total, setTotal]=useState()
  const handleState=()=>{
    if(limit<total){
      setLimit(limit+10);
 }
    }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .get(`${baseURL}${myInvoices}?limit=${limit}`, {
        headers: {
          Authorization: user.token,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [limit]);

  const handleNavigate = (item) => {
    localStorage.setItem("item", JSON.stringify(item));
    Navigate("/showInvoice");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    window.location.href = "/";
  };
  return (
    <StyledWrapper>
      <Box className="mainContainer">
        <Box className="headingContainer">
          <img
            src={AirtelLogo}
            alt="airtel logo"
            style={{ width: "100px", height: "50px" }}
          />
          <Box
            sx={{
              width: "300px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link to="/user">
              <Typography>Upload Invoice</Typography>
            </Link>
            <Link to="/my-invoice">
              {" "}
              <Typography>My Invoices</Typography>
            </Link>
          </Box>
          <IconButton sx={{ marginRight: "100px" }} onClick={handleLogout}>
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>
        <Box
          className="bodyContainer"
          sx={data && data.length <= 3 ? { height: "81.3vh" } : {}}
        >
          {data &&
            data.map((item) => (
              <Box className="cardContainer">
                <Box className="cardHeading">
                  <Typography className="heading">
                    Invoice ID :{item.invoice_id}
                  </Typography>
                </Box>
                <Box className="cardBody">
                  <Typography className="invoiceDetail">
                    Invoice Name : {item.name}
                  </Typography>
                  <Typography className="invoiceDetail">
                    Invoice Description: {item.description}
                  </Typography>
                </Box>
                <Box className="cardBody">
                  <Typography className="invoiceDetail">
                    Invoice Amount : {item.amount}$
                  </Typography>
                  <Typography className="invoiceDetail">
                    Invoice GST : {item.GST}%
                  </Typography>
                </Box>
                <Box className="cardBody">
                  <Typography className="invoiceDetail">
                    Edit Invoice :{" "}
                    <IconButton onClick={() => handleNavigate(item)}>
                      <EditIcon
                        sx={{ color: "red", height: "30px", width: "30px" }}
                      />
                    </IconButton>
                  </Typography>
                  <Typography className="invoiceDetail">
                    Status:{" "}
                    {item.status.toLowerCase() == "approved" ? (
                      <span style={{ color: "green" }}>{item.status}</span>
                    ) : item.status.toLowerCase() === "rejected" ? (
                      <span style={{ color: "red" }}>{item.status}</span>
                    ) : (
                      <span style={{ color: "yellow" }}>{item.status}</span>
                    )}
                  </Typography>
                </Box>
              </Box>
            ))}
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleState}
            endIcon={<ExpandMoreIcon />}
            sx={limit>=total?{display:'none'}:
              {
              marginTop:'30px',
              marginBottom:'30px',
              textTransform: "none",
              fontWeight: 600,
              fontSize: "16px",
              padding: "10px 22px",
              borderRadius: "30px",
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              boxShadow: "0 4px 15px rgba(37, 117, 252, 0.4)",
              transition: "all 0.3s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #2575fc, #6a11cb)",
                boxShadow: "0 6px 20px rgba(37, 117, 252, 0.6)",
                transform: "translateY(-2px)",
              },

              "&:active": {
                transform: "scale(0.96)",
              },
            }
          }
          >
            Show More
          </Button>
        </Box>
        <Box sx={{marginTop:'100px',width:'100%',display:'flex',jystifyContent:'flex-end'}}>
          <ChatbotUI/>

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
    background: "linear-gradient(135deg, #3a1c71, #1f4037)",
  },
  "& .headingContainer": {
    padding: "20px",
    backgroundColor: "#E0E0E0",
    position: "fixed",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: "1",
  },
  "& .bodyContainer": {
    width: "100%",
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "50px",
    paddingBottom: "30px",
  },
  "& .cardContainer": {
    padding: "10px",
    backgroundColor: "white",
    width: "60%",
    maxWidth: "700px",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
  },

  "& .cardHeading": {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  "& .heading": {
    fontFamily: "Nunito sans",
    fontSize: "24px",
    fontWeight: 700,
  },
  "& .cardBody": {
    width: "100%",
    paddingTop: "10px",
    paddingBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  "& .invoiceDetail": {
    fontFamily: "Nunito sans",
    fontSize: "16px",
    fontWeight: 600,
    color: "#6B7280",
  },
}));

export default MyInvoices;
