import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  styled,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AirtelLogo from "../assets/Airtel-logo.png";
import {
  baseURL,
  getInvoicesEndpoint,
  deleteInvoice,
} from "../config";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const handleIncrement = () => {
    const totalPages = Math.ceil(total / 10);
    if (page < totalPages) setPage(page + 1);
  };

  const handleDecrement = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      axios
        .get(`${baseURL}${getInvoicesEndpoint}?limit=10&page=${page}`, {
          headers: {
            Authorization: user.token,
          },
        })
        .then((res) => {
          setData(res.data.data);
          setTotal(res.data.total);
        })
        .catch((err) => console.log(err));
    }
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleNavigate = (item) => {
    localStorage.setItem("item", JSON.stringify(item));
    navigate("/ViewInvoice");
  };

  const handleDelete = (invoice_id) => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .delete(`${baseURL}${deleteInvoice(invoice_id)}`, {
        headers: {
          Authorization: user.token,
        },
      })
      .then(() => {
        // remove deleted row without reload
        setData((prev) =>
          prev.filter((item) => item.invoice_id !== invoice_id)
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <StyledWrapper>
      <Box className="mainContainer">
        {/* HEADER */}
        <Box className="headerContainer">
          <img
            src={AirtelLogo}
            alt="airtel logo"
            style={{ width: "100px", height: "50px" }}
          />
          <IconButton sx={{ marginRight: "50px" }} onClick={handleLogout}>
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>

        {/* TABLE */}
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
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Description</TableCell>
                  <TableCell sx={{ color: "white" }}>Amount</TableCell>
                  <TableCell sx={{ color: "white" }}>GST</TableCell>
                  <TableCell sx={{ color: "white" }}>View</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Delete</TableCell>
                </TableRow>
              </TableHead>

              {/* BODY */}
              <TableBody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.invoice_id} hover>
                      <TableCell
                        sx={{ cursor: "pointer", color: "#1976d2" }}
                        onClick={() => handleNavigate(item)}
                      >
                        {item.invoice_id}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.GST}</TableCell>

                      {/* VIEW */}
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleNavigate(item)}
                        >
                          View
                        </Button>
                      </TableCell>
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
                      {/* DELETE */}
                      <TableCell>
                        <IconButton
                          onClick={() => handleDelete(item.invoice_id)}
                        >
                          <DeleteIcon sx={{ color: "red" }} />
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

        {/* PAGINATION */}
        <Box className="pagination">
          <Button onClick={handleDecrement}>{"<"}</Button>
          <Button onClick={handleIncrement}>{">"}</Button>
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
  },
  "& .headerContainer": {
    width: "100%",
    padding: "20px",
    backgroundColor: "#E0E0E0",
    position: "fixed",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  "& .bodyContainer": {
    marginTop: "100px",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },
  "& .pagination": {
    display: "flex",
    justifyContent: "flex-end",
    padding: "20px",
    gap: "10px",
  },
}));

export default AdminDashboard;