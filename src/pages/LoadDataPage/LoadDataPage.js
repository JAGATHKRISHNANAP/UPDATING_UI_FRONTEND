import React from "react";

import {  Grid} from "@mui/material";
import LoadData from '../../components/load/LoadData';
import HomePage from '../HomePage';


function LoadDataPage() {
  return (
    <div className="App">
        <HomePage/>
          <Grid item xs={12} md={10}>
            <LoadData />
          </Grid>
    </div>
  );
}

export default LoadDataPage;



