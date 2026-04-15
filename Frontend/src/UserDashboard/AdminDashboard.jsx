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
import { baseURL, getInvoicesEndpoint, updateStatus,deleteInvoice } from "../config";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const Navigate=useNavigate()
  const handleIncrement = () => {
    const totalPages = Math.ceil(total / 10);
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const handleDecrement = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios
        .get(`${baseURL}${getInvoicesEndpoint}?limit=${10}&page=${page}`, {
          headers: {
            Authorization: user.token,
          },
        })
        .then((res) => {
          console.log("data is", res.data.data);
          setData(res.data.data);
          setTotal(res.data.total);
        });
    }
  }, [page]);
  const handleLogout = () => {
    localStorage.removeItem("user");

    window.location.href = "/";
  };
  const handleNavigate=(item)=>{
        localStorage.setItem('item',JSON.stringify(item))
        Navigate('/showInvoice')

  }
const handleDelete=(invoice_id)=>{
  const user = JSON.parse(localStorage.getItem("user"));
axios.delete(`${baseURL}${deleteInvoice(invoice_id)}`,{
  headers: {
            Authorization: user.token,
          },
}).then((res)=>{
  console.log(res.data);
  window.location.reload();
}).catch(err=>console.log(err))
}
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
        <Box sx={{ padding: "20px" }}>
          <Grid
            container
            sx={{
              marginTop: "100px",
              padding: "20px",
              border: "1px solid #E0E0E0",
              borderRadius: "15px",
            }}
            rowSpacing={1}
            columnSpacing={1}
          >
            <Grid item size={1}>
              <Typography className="tableHeading">Invoice_id</Typography>
            </Grid>
            <Grid item size={2}>
              <Typography className="tableHeading">Invoice Name</Typography>
            </Grid>
            <Grid item size={2}>
              <Typography className="tableHeading">Description</Typography>
            </Grid>
            <Grid item size={2}>
              <Typography className="tableHeading">Invoice Amount</Typography>
            </Grid>
            <Grid item size={1}>
              <Typography className="tableHeading">GST</Typography>
            </Grid>
            <Grid item size={2}>
              <Typography className="tableHeading">View Invoice</Typography>
            </Grid>
            <Grid item size={2}>
              <Typography className="tableHeading">Delete Invoice</Typography>
            </Grid>
            <hr style={{ border: "1px solid #E0E0E0", width: "100%" }} />
            {data.length != 0 &&
              data.map((item) => (
                <React.Fragment key={item.invoice_id}>
                  <Grid item size={1}>
                    <Typography className="tableBody" sx={{cursor:"pointer"}}
                    onClick={()=>handleNavigate(item)}
                    >
                      <Link onClick={()=>handleNavigate(item)}>{item.invoice_id}</Link>
                    </Typography>
                  </Grid>
                  <Grid item size={2}>
                    <Typography className="tableBody">{item.name}</Typography>
                  </Grid>
                  <Grid item size={2}>
                    <Typography className="tableBody">
                      {item.description}
                    </Typography>
                  </Grid>
                  <Grid item size={2}>
                    <Typography className="tableBody">{item.amount}</Typography>
                  </Grid>
                  <Grid item size={1}>
                    <Typography className="tableBody">{item.GST}</Typography>
                  </Grid>
                  <Grid item size={2}>
                    <Typography className="tableBody">
                      <Link to="/ViewInvoice" onClick={() => localStorage.setItem('item', JSON.stringify(item))}>view invoice</Link>
                    </Typography>
                  </Grid>
                  <Grid item size={2}>
                    <Box sx={{width:'100px',display:'flex',justifyContent:'center'}}>
                      <IconButton onClick={()=>handleDelete(item.invoice_id)}>
                        <DeleteIcon sx={{color:'red',height:'20px',width:'20px'}}/>
                      </IconButton>

                    </Box>
                  </Grid>
                  <hr style={{ border: "1px solid #E0E0E0", width: "100%" }} />
                </React.Fragment>
              ))}
          </Grid>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}
        >
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              sx={{ backgroundColor: "blue", color: "white" }}
              onClick={handleDecrement}
            >
              {"<"}
            </Button>
            <Button
              sx={{ backgroundColor: "blue", color: "white" }}
              onClick={handleIncrement}
            >
              {">"}
            </Button>
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
  "& .tableHeading": {
    fontFamily: "Nunito sans",
    fontSize: "18px",
    fontWeight: 600,
  },
  "& .tableBody": {
    fontFamily: "Nunito sans",
    fontSize: "15px",
    fontWeight: 400,
  },
}));
export default AdminDashboard;
