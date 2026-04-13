import React from 'react'
import { Box,Typography,Button,Grid, styled,IconButton } from '@mui/material'
import AirtelLogo from "../assets/Airtel-logo.png";
import { useEffect,useState } from 'react';
import { baseURL, getInvoicesEndpoint,updateStatus } from '../config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Navigate } from 'react-router-dom';
const AdminDashboard = () => {
      const[data,setData]=useState([])
      const[user,setUser]=useState()
      useEffect(()=>{
        const user=JSON.parse(localStorage.getItem('user'))
        if(user){
          axios.get(`${baseURL}${getInvoicesEndpoint}`,{
            headers: {
        Authorization:
          user.token
      },
          }).then((res)=>{
            console.log("data is",res.data.data)
            setData(res.data.data)
          })

        }

      },[])
    const UpdateStatus=(invoiceID,status)=>{
      const user=JSON.parse(localStorage.getItem('user'))
      const body={
        "status":status
      }
         axios.put(`${baseURL}${updateStatus(invoiceID)}`,body,{
            headers: {
        Authorization:
          user.token
      },
          }).then(()=>{
            window.location.reload()
          }).catch(err=>console.log("error is",err))

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
        </Box>
       <Box sx={{padding:'20px'}}> 

        <Grid container sx={{marginTop:'100px', padding:'20px',border:'1px solid #E0E0E0',borderRadius:'15px'}} rowSpacing={1} columnSpacing={1}>
          <Grid item size={1}><Typography className='tableHeading'>Invoice_id</Typography></Grid>
          <Grid item size={2}><Typography className='tableHeading'>Invoice Name</Typography></Grid>
          <Grid item size={2}><Typography className='tableHeading'>Description</Typography></Grid>
          <Grid item size={2}><Typography className='tableHeading'>Invoice Amount</Typography></Grid>
          <Grid item size={1}><Typography className='tableHeading'>GST</Typography></Grid>
          <Grid item size={2}><Typography className='tableHeading'>View Invoice</Typography></Grid>
          <Grid item size={2}><Typography className='tableHeading'>Status</Typography></Grid>
          <hr style={{border:'1px solid #E0E0E0',width:'100%'}}/>
          {data.length!=0&&
          data.map(item=>(
              <React.Fragment key={item.invoice_id}>
                  <Grid item size={1}><Typography className='tableBody'>{item.invoice_id}</Typography></Grid>
                  <Grid item size={2}><Typography className='tableBody'>{item.name}</Typography></Grid>
                  <Grid item size={2}><Typography className='tableBody'>{item.description}</Typography></Grid>
                  <Grid item size={2}><Typography className='tableBody'>{item.amount}</Typography></Grid>
                  <Grid item size={1}><Typography className='tableBody'>{item.GST}</Typography></Grid>
                  <Grid item size={2}><Typography className='tableBody'><Link to={`${item.file_url}`}>view invoice</Link></Typography></Grid>
                  <Grid item size={2}><Typography className='tableBody'>{item.status.toLowerCase()=="pending"?(<>
                         <Box sx={{display:'flex',gap:'5px'}}>
                                 <Box sx={{height:'30px',width:'30px',borderRadius:'5px',backgroundColor:'#fb838326',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                  <Box sx={{height:'20px',width:'20px',borderRadius:'5px', border:'2px solid #E15552', backgroundColor:'#fb838326',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <IconButton onClick={()=>UpdateStatus(item.invoice_id,"rejected")}><CloseIcon color='error' sx={{width:'15px',height:'15px'}}/></IconButton>
                                  </Box>
                                 </Box>
                                 <Box sx={{height:'30px',width:'30px',borderRadius:'5px',backgroundColor:'#61eda026',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                  <Box sx={{height:'20px',width:'20px',borderRadius:'5px', border:'2px solid #28C76F', backgroundColor:'#61eda026',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <IconButton onClick={()=>UpdateStatus(item.invoice_id,"approved")}><DoneIcon color='success' sx={{width:'15px',height:'15px'}}/></IconButton>
                                  </Box>
                                 </Box>
                         </Box>
                  
                  </>):(item.status.toLowerCase()==="approved"?(
                  <>
                  <Button sx={{padding:'5px',backgroundColor:'#a059e826',color:'#3b0554',textTransform:'capitalize'}}>Approved</Button></>
                  ):<Button sx={{padding:'5px',backgroundColor:'#ef3e3e26',color:'#540805',textTransform:'capitalize'}}>Rejected</Button>)}</Typography></Grid>
                  <hr style={{border:'1px solid #E0E0E0',width:'100%'}}/>
              </React.Fragment>

          ))
          }
        </Grid>
        </Box>

      </Box>


    </StyledWrapper>
  )
}
const StyledWrapper=styled(Box)(({theme})=>({
"& .mainContainer":{
  width:'100%',
  display:'flex',
  flexDirection:'column'
},
"& .headerContainer":{
  width:'100%',
  padding:'20px',
  backgroundColor: "#E0E0E0",
    position:'fixed',
},
"& .tableHeading":{
  fontFamily:'Nunito sans',
  fontSize:'18px',
  fontWeight:600,
},
"& .tableBody":{
  fontFamily:"Nunito sans",
  fontSize:'15px',
  fontWeight:400
}
}))
export default AdminDashboard