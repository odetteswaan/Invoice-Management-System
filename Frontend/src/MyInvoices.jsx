import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  styled,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AirtelLogo from "./assets/Airtel-logo.png";
import axios from "axios";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { baseURL, myInvoices } from "./config";
import ChatbotUI from "./Chatbot";

const MyInvoices = () => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const handleState = () => {
    if (limit < total) {
      setLimit(limit + 10);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`${baseURL}${myInvoices}?limit=${limit}`, {
        headers: {
          Authorization: user?.token,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [limit]);

  const handleNavigate = (item) => {
    localStorage.setItem("item", JSON.stringify(item));
    navigate("/showInvoice");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <StyledWrapper>
      <Box className="mainContainer">
        {/* HEADER */}
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
              <Typography>My Invoices</Typography>
            </Link>
          </Box>

          <IconButton sx={{ marginRight: "100px" }} onClick={handleLogout}>
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>

        {/* TABLE BODY */}
        <Box className="bodyContainer">
          <TableContainer
            component={Paper}
            sx={{
              width: "90%",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Table>
              {/* HEADER */}
              <TableHead sx={{ backgroundColor: "#1f4037" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    GST
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* BODY */}
              <TableBody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.invoice_id} hover>
                      <TableCell>{item.invoice_id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.amount}$</TableCell>
                      <TableCell>{item.GST}%</TableCell>

                      {/* STATUS */}
                      <TableCell>
                        {item.status.toLowerCase() === "approved" ? (
                          <span style={{ color: "green", fontWeight: 600 }}>
                            {item.status}
                          </span>
                        ) : item.status.toLowerCase() === "rejected" ? (
                          <span style={{ color: "red", fontWeight: 600 }}>
                            {item.status}
                          </span>
                        ) : (
                          <span style={{ color: "orange", fontWeight: 600 }}>
                            {item.status}
                          </span>
                        )}
                      </TableCell>

                      {/* ACTION */}
                      <TableCell>
                        <IconButton onClick={() => handleNavigate(item)}>
                          <EditIcon sx={{ color: "#1976d2" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Invoices Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* SHOW MORE BUTTON */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleState}
            endIcon={<ExpandMoreIcon />}
            sx={
              limit >= total
                ? { display: "none" }
                : {
                    marginTop: "30px",
                    marginBottom: "30px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    padding: "10px 22px",
                    borderRadius: "30px",
                    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                    boxShadow: "0 4px 15px rgba(37, 117, 252, 0.4)",

                    "&:hover": {
                      background: "linear-gradient(135deg, #2575fc, #6a11cb)",
                      transform: "translateY(-2px)",
                    },
                  }
            }
          >
            Show More
          </Button>
        </Box>

        {/* CHATBOT */}
        <Box
          sx={{
            marginTop: "100px",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <ChatbotUI />
        </Box>
      </Box>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Box)(() => ({
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: "1",
  },
  "& .bodyContainer": {
    width: "100%",
    marginTop: "100px",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "30px",
  },
}));

export default MyInvoices;