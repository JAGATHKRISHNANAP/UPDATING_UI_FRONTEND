import React, { useState, useEffect } from "react";
import { Box, Grid} from "@mui/material";
import ViewDashboardSidebar from "../../components/dashboardViewCharts/ViewDashboardSidebar";
import DashboardDroppableArea from "../../components/dashboardViewCharts/dashboardDroppableArea";
import HomePage from '../HomePage';

function DashboardView() {
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} wrap="wrap">
          <HomePage/>
          <Grid item xs={12} md={12} style={{marginTop:'80px'}}>
            <DashboardDroppableArea />
          </Grid>
        </Grid>
      </Box>
  <Grid container sx={{
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    bgcolor: 'white',
    p: 1,
    maxHeight: '50px',
    marginBottom: '5px',
  }}justifyContent="center">
    <ViewDashboardSidebar />
  </Grid>
    </div>
  );
}

export default DashboardView;
