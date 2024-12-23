// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setFile, uploadCsv } from '../../features/csvFile/csvFileSlice';
// import CssBaseline from '@mui/material/CssBaseline';
// import SaveIcon from '@mui/icons-material/Save';
// import LoadingButton from '@mui/lab/LoadingButton';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { styled } from '@mui/material/styles';
// import { Button, TextField,Grid, Box, Container } from '@mui/material';
// import HomePage from '../HomePage';
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

//   // const company_database=localStorage.getItem('company_database');

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.type === 'text/csv') {
//         dispatch(setFile(selectedFile));
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
//           <form onSubmit={handleSubmit} className="excel-upload-form">
//             <Grid container item xs={12} md={12} style={{height: '10vh', flexWrap: 'wrap', gap: '20px', justifyContent: 'center',marginTop:'80px' }}>
//             <HomePage/>
//               <Grid item xs={12} md={9} style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px' }}>
//                 <Grid item sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginLeft: '10px' }}>
//                 <Button component="label" variant="contained" sx={{
//       padding: '10px 18px', // Increase padding
     
//     }} startIcon={<CloudUploadIcon />}>
//                 Choose File
//                 <VisuallyHiddenInput type="file" onChange={handleFileChange} />
//               </Button>
//               <TextField
//                 label="File Name"
//                 value={fileName}
//                 InputProps={{ readOnly: true }}
//                 variant="filled"
//                 size="small"
//               />
//               <LoadingButton
//                 disabled={!file || uploading}
//                 color="secondary"
//                 onClick={handleSubmit}
//                 loading={uploading}
//                 loadingPosition="start"
//                 startIcon={<SaveIcon />}
//                 variant="contained"
//               >
//                 {uploading ? 'Uploading...' : 'Upload'}
//               </LoadingButton>
              
//             {uploadError && <p className="excel-upload-error">{uploadError}</p>}
//             {uploadSuccess && <p className="excel-upload-success">File uploaded successfully...</p>}
          
//           </Grid>
//       </Grid>
//       </Grid>
//       </form>
//     </React.Fragment>
//   );
// };

// export default CsvUpload;




import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFile, uploadCsv } from '../../features/csvFile/csvFileSlice';
import CssBaseline from '@mui/material/CssBaseline';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Button, TextField, Grid, Box, Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import HomePage from '../HomePage';
import Papa from 'papaparse';

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

const CsvUpload = () => {
  const dispatch = useDispatch();
  const { file, uploading, uploadSuccess, uploadError, fileName } = useSelector((state) => state.csvFile);
  const [previewData, setPreviewData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        dispatch(setFile(selectedFile));

        // Read the file content
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvData = event.target.result;

          // Parse CSV using PapaParse
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const rows = result.data.slice(0, 5); // Extract first 5 rows
              setPreviewData(rows);
            },
          });
        };
        reader.readAsText(selectedFile);
      } else {
        dispatch(setFile(null));
        alert('Please select a CSV file.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      dispatch(uploadCsv(file));
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <form onSubmit={handleSubmit} className="excel-upload-form">
        <Grid container item xs={12} md={12} style={{ height: '10vh', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '80px' }}>
          <HomePage />
          <Grid item xs={9} md={11} style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', marginLeft: '0px' }}>
            <Grid item sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginLeft: '10px' }}>
              <Button
                component="label"
                variant="contained"
                sx={{
                  padding: '10px 18px', // Increase padding
                }}
                startIcon={<CloudUploadIcon />}
              >
                Choose File
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
              <TextField
                label="File Name"
                value={fileName}
                InputProps={{ readOnly: true }}
                variant="filled"
                size="small"
              />
              <LoadingButton
                disabled={!file || uploading}
                color="secondary"
                onClick={handleSubmit}
                loading={uploading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </LoadingButton>

              {uploadError && <p className="excel-upload-error">{uploadError}</p>}
              {uploadSuccess && <p className="excel-upload-success">File uploaded successfully...</p>}
            </Grid>
          </Grid>
        </Grid>

        {/* Display preview of the first 5 rows */}
        {previewData.length > 0 && (
           <Grid container item xs={12} md={12} style={{ height: '10vh', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
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
                  {Object.keys(previewData[0]).map((key) => (
                    <TableCell key={key}  style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderRight: '1px solid #ddd',
                    }}>
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}  style={{
                    borderBottom: '1px solid #ddd',
                    '&:last-child': {
                      borderBottom: 0,
                    },
                  }}>
                    {Object.values(row).map((value, idx) => (
                      <TableCell key={idx}  style={{
                        padding: '10px',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                      }}>
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          </Grid>
        )}
      </form>
    </React.Fragment>
  );
};

export default CsvUpload;


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
