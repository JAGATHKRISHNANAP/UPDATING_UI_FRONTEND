import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFile, setColumnHeadings, setPrimaryKeyColumn, uploadExcel } from '../../features/excelFileSlice/excelFileSlice';
import CssBaseline from '@mui/material/CssBaseline';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Button, TextField, Typography, Grid, Snackbar, Alert, Table, TableHead, TableBody, Dialog, DialogTitle, DialogContent, DialogActions,TableRow, TableCell,Select, MenuItem, InputLabel } from '@mui/material';
import * as XLSX from 'xlsx';
import { fetchTableNamesAPI } from '../../utils/api';
import { PieChart } from '@mui/x-charts/PieChart';
import HomePage from '../HomePage';
import Chip from '@mui/material/Chip';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1 GB limit
const ExcelUpload = () => {
  const dispatch = useDispatch();
  const { file, uploading, uploadSuccess, uploadError, fileName, columnHeadings, primaryKeyColumn } = useSelector((state) => state.excelFile);
  const [user_id, setUser_Id] = React.useState(localStorage.getItem('user_id'));
  const [totalRows, setTotalRows] = React.useState(0);
  const [totalColumns, setTotalColumns] = React.useState(0);
  const [excelData, setExcelData] = React.useState([]);
  const [sheetNames, setSheetNames] = React.useState([]);
  const [selectedSheet, setSelectedSheet] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [confirmationChoice, setConfirmationChoice] = React.useState(null);
  const company_database = localStorage.getItem('company_name');
  const databaseName = localStorage.getItem('company_name');
  React.useEffect(() => {
    if (uploadError) {
      setSnackbarMessage(uploadError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else if (uploadSuccess) {
      setSnackbarMessage('File uploaded successfully...');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  }, [uploadError, uploadSuccess]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
      return;
    }
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        dispatch(setFile(selectedFile));
        const reader = new FileReader();
        reader.onload = (event) => {
          const arrayBuffer = event.target.result;
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
          setSheetNames(workbook.SheetNames);
        };
        reader.readAsArrayBuffer(selectedFile); // Use readAsArrayBuffer
      } else {
        dispatch(setFile(null));
        alert('Please upload a valid Excel file');
      }
    }
  };

  const handleSheetSelection = (sheetName) => {
    setSelectedSheet(sheetName);
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheet = workbook.Sheets[sheetName];
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      setTotalColumns(headers.length);
      setExcelData([headers, ...data.slice(1, 6)]); // Include headers in the displayed data
      dispatch(setColumnHeadings(headers.map((header) => header.toLowerCase().replace(/\s+/g, '_'))));
      setTotalRows(data.length - 1);
    };
  
    if (file) {
      reader.readAsArrayBuffer(file); // Ensure file is read as ArrayBuffer
    } else {
        dispatch(setFile(null));
      alert('Invalid file type. Please upload an Excel file (.xlsx or .xls).');


    }
  };
  

  const handleConfirmationChoice = (choice) => {
    setConfirmationChoice(choice);
    setConfirmationOpen(false);

    // If the user selects to update, proceed with the upload
    if (choice === 'update' && file && selectedSheet) {
      if (primaryKeyColumn !== null && columnHeadings[primaryKeyColumn]) {
        dispatch(uploadExcel({
          user_id,
          file,
          primaryKeyColumnName: columnHeadings[primaryKeyColumn],
          company_database,
          selectedSheet
        }));
      } else {
        alert("Please select a primary key column before uploading.");
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!primaryKeyColumn && excelData.length > 1) {
      const newHeaders = ['id', ...excelData[0]];  // Add the "id" column at the start
      const newData = excelData.slice(1).map((row, index) => [index + 1, ...row]); // Assign unique ID starting from 1
      setExcelData([newHeaders, ...newData]);
      dispatch(setPrimaryKeyColumn(0));
    }
  
    if (file && selectedSheet) {
      if (primaryKeyColumn !== null && columnHeadings[primaryKeyColumn]) {
        const existingTableNames = await fetchTableNamesAPI(databaseName);
        const currentTableName = selectedSheet.toLowerCase().replace(/\s+/g, '_');
        if (existingTableNames.includes(currentTableName)) {
          const userChoice = window.confirm(
            `Table "${currentTableName}" already exists. Do you want to update it?`
          );
          if (!userChoice) {
            alert("Table creation skipped.");
            return;
          }
        }
        dispatch(
          uploadExcel({
            user_id,
            file,
            primaryKeyColumnName: columnHeadings[primaryKeyColumn],
            company_database,
            selectedSheet,
          })
        );
      } else {
        alert("Please select a primary key column before uploading.");
      }
    } else {
      alert("Please upload a file and select a sheet.");
    }
  };
  
  return (
    <React.Fragment>
      <CssBaseline />
      <form onSubmit={handleSubmit} className="excel-upload-form">
         <Grid container item xs={12} md={12} style={{height: '10vh', flexWrap: 'wrap', gap: '20px', justifyContent: 'center',marginTop:'80px'}}>
          <HomePage/>
           <Grid item xs={12} md={9} style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px'}}>
             <Grid item sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginLeft: '10px' }}>
  <Button component="label" variant="contained" sx={{
      padding: '10px 18px', // Increase padding
     
    }} startIcon={<CloudUploadIcon />}>
    Choose File
    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
  </Button>

  <TextField
    label="File Name"
    value={fileName}
    InputProps={{ readOnly: true }}
    variant="filled"
    size="small"
    style={{ flexGrow: 2 , minWidth: '200px'}} // Ensures consistent width
  />

  <LoadingButton
    disabled={!file || !selectedSheet || uploading}
    color="secondary"
    loading={uploading}
    startIcon={<SaveIcon />}
    type="submit"
    variant="contained"
    sx={{
      padding: '11px 18px', // Increase padding
      minWidth: '120px', // Minimum button width
    }}
  >
    {uploading ? 'Uploading...' : 'Upload'}
  </LoadingButton>
</Grid>

{/* Reserve space for sheet dropdown */}
<Grid  item  xs={2}  style={{    minHeight: '30px' }}>
{sheetNames.length > 0 && (
  <>
    {/* <Typography>Select a sheet:</Typography> */}
    <Select
      value={selectedSheet}
      onChange={(e) => handleSheetSelection(e.target.value)}
      displayEmpty
      fullWidth
      variant="outlined"
      sx={{ height: 50 }} // Adjust height here (for MUI v5)
      renderValue={(selected) => {
        if (!selected) {
          return <span>-- Select a sheet --</span>;
        }
        return (
          <Chip
            label={selected}
            color="primary"
            sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
          />
        );
      }}
    >
      <MenuItem value="" disabled>
        -- Select a sheet --
      </MenuItem>
      {sheetNames.map((sheetName, index) => (
        <MenuItem key={index} value={sheetName}>
          {sheetName}
        </MenuItem>
      ))}
    </Select>
  </>
)}



</Grid>
{excelData.length > 0 && (
  <Grid item xs={4}>
    {/* <Typography>Select a Primary Key Column:</Typography> */}
    <Select
      value={primaryKeyColumn !== null && primaryKeyColumn !== undefined ? primaryKeyColumn : ''}
      onChange={(e) => dispatch(setPrimaryKeyColumn(e.target.value))}
      displayEmpty
      fullWidth
      variant="outlined"
      sx={{ height: 50 }} // Adjust height here (for MUI v5)
      renderValue={(selected) => {
        if (selected === '' || selected === null || selected === undefined) {
          return <span>-- Select a Column --</span>;
        }
        return (
          <Chip
            label={excelData[0][selected]}
            color="primary"
            sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
          />
        );
      }}
    >
      <MenuItem value="" disabled>
        -- Select a Column --
      </MenuItem>
      {excelData[0].map((header, index) => (
        <MenuItem key={index} value={index}>
          {header}
        </MenuItem>
      ))}
    </Select>
  </Grid>
)}

</Grid>       
        <Grid item xs={12} md={2} style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: totalColumns },
                      { id: 1, value: totalRows },
                    ],
                  },
                ]}
                width={200}
                height={100}
              />
            </div>
          </Grid>
        </Grid>
  {excelData.length > 0 && (
    <Grid
      item
      xs={12}
      style={{
        margin: '40px',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflowX: 'auto',
      }}
    >
      <Table style={{ border: '1px solid #ddd', width: '100%', borderRadius: '10px' }}>
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            {excelData[0].map((header, index) => (
              <TableCell
                key={index}
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  borderRight: '1px solid #ddd',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {excelData.slice(1).map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              style={{
                borderBottom: '1px solid #ddd',
                '&:last-child': {
                  borderBottom: 0,
                },
              }}
            >
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    borderRight: '1px solid #ddd',
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Grid>
  )}
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Table Already Exists</DialogTitle>
        <DialogContent>
          <Typography>Do you want to update the existing table or skip this upload?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoice('skip')} color="primary">Skip</Button>
          <Button onClick={() => handleConfirmationChoice('update')} color="secondary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default ExcelUpload;

























// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setFile, uploadCsv } from '../../features/csvFile/csvFileSlice';
// import CssBaseline from '@mui/material/CssBaseline';
// import SaveIcon from '@mui/icons-material/Save';
// import LoadingButton from '@mui/lab/LoadingButton';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { styled } from '@mui/material/styles';
// import { Button, TextField, Grid, Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
// import HomePage from '../HomePage';
// import Papa from 'papaparse';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

// const CsvUpload = () => {
//   const dispatch = useDispatch();
//   const { file, uploading, uploadSuccess, uploadError, fileName } = useSelector((state) => state.csvFile);
//   const [previewData, setPreviewData] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.type === 'text/csv') {
//         dispatch(setFile(selectedFile));

//         // Read the file content
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           const csvData = event.target.result;

//           // Parse CSV using PapaParse
//           Papa.parse(csvData, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//               const rows = result.data.slice(0, 5); // Extract first 5 rows
//               setPreviewData(rows);
//             },
//           });
//         };
//         reader.readAsText(selectedFile);
//       } else {
//         dispatch(setFile(null));
//         alert('Please select a CSV file.');
//       }
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (file) {
//       dispatch(uploadCsv(file));
//     }
//   };

//   return (
//     <React.Fragment>
//       <CssBaseline />
//       <Box sx={{ padding: '16px' }}>
//         <HomePage />
//         <form onSubmit={handleSubmit}>
//           <Grid
//             container
//             spacing={2}
//             sx={{
//               marginTop: '20px',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <Grid item xs={12} md={6}>
//               <Button
//                 component="label"
//                 variant="contained"
//                 startIcon={<CloudUploadIcon />}
//                 sx={{ width: '100%' }}
//               >
//                 Choose File
//                 <VisuallyHiddenInput type="file" onChange={handleFileChange} />
//               </Button>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="File Name"
//                 value={fileName}
//                 InputProps={{ readOnly: true }}
//                 variant="filled"
//                 size="small"
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <LoadingButton
//                 disabled={!file || uploading}
//                 color="secondary"
//                 onClick={handleSubmit}
//                 loading={uploading}
//                 loadingPosition="start"
//                 startIcon={<SaveIcon />}
//                 variant="contained"
//                 fullWidth
//               >
//                 {uploading ? 'Uploading...' : 'Upload'}
//               </LoadingButton>
//             </Grid>
//           </Grid>

//           {uploadError && (
//             <Box sx={{ color: 'red', textAlign: 'center', marginTop: '16px' }}>
//               {uploadError}
//             </Box>
//           )}
//           {uploadSuccess && (
//             <Box sx={{ color: 'green', textAlign: 'center', marginTop: '16px' }}>
//               File uploaded successfully...
//             </Box>
//           )}
//         </form>

//         {previewData.length > 0 && (
//           <Box
//             sx={{
//               marginTop: '40px',
//               backgroundColor: '#ffffff',
//               borderRadius: '10px',
//               boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//               overflowX: 'auto',
//             }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   {Object.keys(previewData[0]).map((key) => (
//                     <TableCell key={key} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                       {key}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {previewData.map((row, index) => (
//                   <TableRow key={index}>
//                     {Object.values(row).map((value, idx) => (
//                       <TableCell key={idx} sx={{ textAlign: 'center' }}>
//                         {value}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Box>
//         )}
//       </Box>
//     </React.Fragment>
//   );
// };

// export default CsvUpload;
