import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, ButtonGroup, CssBaseline, ListItemIcon, Menu, MenuItem, MuiAppBar, Toolbar, Box } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { SketchPicker } from 'react-color';
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { BiSolidFileJson } from "react-icons/bi";
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar} from '@mui/material';


const SecondNavbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const buttonRef = React.useRef(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!sessionStorage.getItem('session_id'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [viewMenuAnchorEl, setViewMenuAnchorEl] = React.useState(null);
    const [openViewMenu, setOpenViewMenu] = React.useState(false);
    const [activeRoute, setActiveRoute] = React.useState('');
    const [menuWidth, setMenuWidth] = React.useState(null);
    const [appBarColor, setAppBarColor] = React.useState(localStorage.getItem('theamColor') || '#1976d2'); 
    const [showColorPicker, setShowColorPicker] = React.useState(false); // Toggle for color picker

  
  
  
    const [openDesignMenu, setOpenDesignMenu] = React.useState(false);
    const [designMenuAnchorEl, setDesignMenuAnchorEl] = React.useState(null);
    

    // const location = useLocation();
    const navigate = useNavigate();
    // const buttonRef = React.useRef(null);


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
    if (buttonRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth;
      setMenuWidth(buttonWidth);
    }
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
    setAnchorEl(null);
  };

  const disableBackButton = () => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
  };
  
  React.useEffect(() => {
    if (!isLoggedIn) {
      disableBackButton();
    }
  }, [isLoggedIn]);
  
  const handleViewMenuClick = (event) => {
    setViewMenuAnchorEl(event.currentTarget);
    setOpenViewMenu(true);
  };

  const handleViewMenuClose = () => {
    setOpenViewMenu(false);
    setViewMenuAnchorEl(null);
  };


  

  const handleDesignMenuClick = (event) => {
    setDesignMenuAnchorEl(event.currentTarget);
    setOpenDesignMenu(true);
  };
  
  const handleDesignMenuClose = () => {
    setDesignMenuAnchorEl(null);
    setOpenDesignMenu(false);
  };
  


  const handleNavigation = (route) => {
    setActiveRoute(route); 
    navigate(route);
    handleMenuClose();
    handleViewMenuClose();

  };




  const handleColorChange = (color) => {
    setAppBarColor(color.hex);
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        top: '40px',
        height: '25px',
        backgroundColor: '#ffffff',
        color: '#1976d2',
        display: 'flex',
        justifyContent: 'center',
        zIndex: theme.zIndex.appBar + 1
      }}
    >
      <CssBaseline />
      <Toolbar>
        <ButtonGroup variant="text" aria-label="Basic button group" sx={{ height: '25px', display: 'flex' }}>
          <Button
            aria-controls={openMenu ? 'data-source-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            onClick={handleMenuClick}
            ref={buttonRef}
            sx={{
              backgroundColor: activeRoute === '/excel_upload' || activeRoute === '/csv_upload' || activeRoute === '/Audio_upload' ? '#c5c5c9' : 'inherit',
              maxWidth: '150px',
              alignItems: 'center',
              color: 'inherit',
            }}
          >
            <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', width: '150px', color: '#000000' }}>
              Data Source <ArrowDropDownCircleIcon sx={{ color: appBarColor }} />
            </ListItemIcon>
          </Button>
          <Menu
            id="data-source-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: menuWidth || 'auto',
                backgroundColor: '#424242',
                color: '#fff',
              },
            }}
          >
            <MenuItem onClick={() => handleNavigation('/excel_upload')}>
              <FaFileExcel style={{ marginRight: 8 }} /> Excel
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/csv_upload')}>
              <FaFileCsv style={{ marginRight: 8 }} /> CSV
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/Audio_upload')}>
              <AudioFileIcon style={{ marginRight: 8 }} /> Audio
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/json_upload')}>
              <BiSolidFileJson style={{ marginRight: 8, fontSize: 20 }} /> Json
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/custom_data_source')}>
              <DashboardCustomizeIcon style={{ marginRight: 8, fontSize: 20 }} /> CustomJoin
            </MenuItem>
          </Menu>

          <Button
            aria-controls={openDesignMenu ? 'design-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openDesignMenu ? 'true' : undefined}
            onClick={handleDesignMenuClick}
            sx={{
              backgroundColor:
                location.pathname === '/load_data' ||
                location.pathname === '/Create_Dashboard'
                  ? '#c5c5c9'
                  : 'inherit',
              alignItems: 'center',
            }}
          >
            <ListItemIcon
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '150px',
                justifyContent: 'center',
                color: '#000000',
              }}
            >
              Design <ArrowDropDownCircleIcon sx={{ color: appBarColor }} />
            </ListItemIcon>
          </Button>
          <Menu
            id="design-menu"
            anchorEl={designMenuAnchorEl}
            open={openDesignMenu}
            onClose={handleDesignMenuClose}
            PaperProps={{
              sx: {
                width: menuWidth || 'auto',
                backgroundColor: '#424242',
                color: '#fff',
              },
            }}
          >
            <MenuItem onClick={() => handleNavigation('/load_data')}>
              Load Data
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/Create_Dashboard')}>
              Charts
            </MenuItem>
          </Menu>

          <Button
            onClick={() => handleNavigation('/Edit_Chart')}
            sx={{
              backgroundColor: location.pathname === '/Edit_Chart' ? '#c5c5c9' : 'inherit',
              alignItems: 'center',
            }}
          >
            <ListItemIcon sx={{ display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'center', color: '#000000' }}>
              edit
            </ListItemIcon>
          </Button>

          <Button
            aria-controls={openViewMenu ? 'view-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openViewMenu ? 'true' : undefined}
            onClick={handleViewMenuClick}
            sx={{
              backgroundColor: location.pathname === '/Create_Dashboard' || location.pathname === '/dashboard_view' ? '#c5c5c9' : 'inherit',
              maxWidth: '150px',
              alignItems: 'center',
              color: 'inherit',
            }}
          >
            <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', width: '150px', color: '#000000' }}>
              View <ArrowDropDownCircleIcon sx={{ color: appBarColor }} />
            </ListItemIcon>
          </Button>

          <Menu
            id="view-menu"
            anchorEl={viewMenuAnchorEl}
            open={openViewMenu}
            onClose={handleViewMenuClose}
            PaperProps={{
              sx: {
                width: menuWidth || 'auto',
                backgroundColor: '#424242',
                color: '#fff',
              },
            }}
          >
            <MenuItem onClick={() => handleNavigation('/Charts_view')}>Charts</MenuItem>
            <MenuItem onClick={() => handleNavigation('/dashboard_view')}>Dashboard</MenuItem>
          </Menu>
        </ButtonGroup>

        {showColorPicker && (
          <Box sx={{ position: 'absolute', top: '50px', right: '10px', zIndex: 0 }}>
            <SketchPicker color={appBarColor} onChangeComplete={handleColorChange} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default SecondNavbar;


// import React from 'react';
// import { useTheme } from '@mui/material/styles';
// import {
//   Button,
//   ButtonGroup,
//   CssBaseline,
//   ListItemIcon,
//   Menu,
//   MenuItem,
//   Toolbar,
//   Box,
//   useMediaQuery,
//   IconButton
// } from '@mui/material';
// import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
// import MenuIcon from '@mui/icons-material/Menu';
// import { SketchPicker } from 'react-color';
// import { FaFileExcel, FaFileCsv } from "react-icons/fa";
// import AudioFileIcon from '@mui/icons-material/AudioFile';
// import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
// import { BiSolidFileJson } from "react-icons/bi";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { AppBar } from '@mui/material';

// const SecondNavbar = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const location = useLocation();
//   const buttonRef = React.useRef(null);
//   const [isLoggedIn, setIsLoggedIn] = React.useState(!!sessionStorage.getItem('session_id'));
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [openMenu, setOpenMenu] = React.useState(false);
//   const [viewMenuAnchorEl, setViewMenuAnchorEl] = React.useState(null);
//   const [openViewMenu, setOpenViewMenu] = React.useState(false);
//   const [activeRoute, setActiveRoute] = React.useState('');
//   const [menuWidth, setMenuWidth] = React.useState(null);
//   const [appBarColor, setAppBarColor] = React.useState(localStorage.getItem('theamColor') || '#1976d2');
//   const [showColorPicker, setShowColorPicker] = React.useState(false);
//   const [openDesignMenu, setOpenDesignMenu] = React.useState(false);
//   const [designMenuAnchorEl, setDesignMenuAnchorEl] = React.useState(null);

//   const navigate = useNavigate();

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     setOpenMenu(true);
//     if (buttonRef.current) {
//       const buttonWidth = buttonRef.current.offsetWidth;
//       setMenuWidth(buttonWidth);
//     }
//   };

//   const handleMenuClose = () => {
//     setOpenMenu(false);
//     setAnchorEl(null);
//   };

//   const disableBackButton = () => {
//     window.history.pushState(null, null, window.location.href);
//     window.onpopstate = () => {
//       window.history.pushState(null, null, window.location.href);
//     };
//   };

//   React.useEffect(() => {
//     if (!isLoggedIn) {
//       disableBackButton();
//     }
//   }, [isLoggedIn]);

//   const handleViewMenuClick = (event) => {
//     setViewMenuAnchorEl(event.currentTarget);
//     setOpenViewMenu(true);
//   };

//   const handleViewMenuClose = () => {
//     setOpenViewMenu(false);
//     setViewMenuAnchorEl(null);
//   };

//   const handleDesignMenuClick = (event) => {
//     setDesignMenuAnchorEl(event.currentTarget);
//     setOpenDesignMenu(true);
//   };

//   const handleDesignMenuClose = () => {
//     setDesignMenuAnchorEl(null);
//     setOpenDesignMenu(false);
//   };

//   const handleNavigation = (route) => {
//     setActiveRoute(route);
//     navigate(route);
//     handleMenuClose();
//     handleViewMenuClose();
//   };

//   const handleColorChange = (color) => {
//     setAppBarColor(color.hex);
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         top: '40px',
//         height: isMobile ? 'auto' : '25px',
//         backgroundColor: '#ffffff',
//         color: '#1976d2',
//         display: 'flex',
//         justifyContent: 'center',
//         zIndex: theme.zIndex.appBar + 1,
//         padding: isMobile ? '10px' : '0',
//       }}
//     >
//       <CssBaseline />
//       <Toolbar sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: isMobile ? 'space-between' : 'start' }}>
//         {isMobile && (
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             onClick={handleMenuClick}
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//         )}

//         <ButtonGroup
//           variant="text"
//           aria-label="Basic button group"
//           sx={{
//             height: '25px',
//             display: isMobile ? 'none' : 'flex',
//             flexDirection: isMobile ? 'column' : 'row',
//           }}
//         >
//           <Button
//             aria-controls={openMenu ? 'data-source-menu' : undefined}
//             aria-haspopup="true"
//             aria-expanded={openMenu ? 'true' : undefined}
//             onClick={handleMenuClick}
//             ref={buttonRef}
//             sx={{
//               backgroundColor:
//                 activeRoute === '/excel_upload' ||
//                 activeRoute === '/csv_upload' ||
//                 activeRoute === '/Audio_upload'
//                   ? '#c5c5c9'
//                   : 'inherit',
//               maxWidth: '150px',
//               alignItems: 'center',
//               color: 'inherit',
//             }}
//           >
//             {/* <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', width: '150px', color: '#000000' }}>
//               Data Source <ArrowDropDownCircleIcon sx={{ color: appBarColor }} />
//             </ListItemIcon> */}
//           </Button>
//           <Menu
//             id="data-source-menu"
//             anchorEl={anchorEl}
//             open={openMenu}
//             onClose={handleMenuClose}
//             PaperProps={{
//               sx: {
//                 width: menuWidth || 'auto',
//                 backgroundColor: '#424242',
//                 color: '#fff',
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleNavigation('/excel_upload')}>
//               <FaFileExcel style={{ marginRight: 8 }} /> Excel
//             </MenuItem>
//             <MenuItem onClick={() => handleNavigation('/csv_upload')}>
//               <FaFileCsv style={{ marginRight: 8 }} /> CSV
//             </MenuItem>
//             <MenuItem onClick={() => handleNavigation('/Audio_upload')}>
//               <AudioFileIcon style={{ marginRight: 8 }} /> Audio
//             </MenuItem>
//             <MenuItem onClick={() => handleNavigation('/json_upload')}>
//               <BiSolidFileJson style={{ marginRight: 8, fontSize: 20 }} /> Json
//             </MenuItem>
//             <MenuItem onClick={() => handleNavigation('/custom_data_source')}>
//               <DashboardCustomizeIcon style={{ marginRight: 8, fontSize: 20 }} /> CustomJoin
//             </MenuItem>
//           </Menu>

//           <Button
//             aria-controls={openDesignMenu ? 'design-menu' : undefined}
//             aria-haspopup="true"
//             aria-expanded={openDesignMenu ? 'true' : undefined}
//             onClick={handleDesignMenuClick}
//             sx={{
//               backgroundColor:
//                 location.pathname === '/load_data' ||
//                 location.pathname === '/Create_Dashboard'
//                   ? '#c5c5c9'
//                   : 'inherit',
//               alignItems: 'center',
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 width: '150px',
//                 justifyContent: 'center',
//                 color: '#000000',
//               }}
//             >
//               Design <ArrowDropDownCircleIcon sx={{ color: appBarColor }} />
//             </ListItemIcon>
//           </Button>
//           <Menu
//             id="design-menu"
//             anchorEl={designMenuAnchorEl}
//             open={openDesignMenu}
//             onClose={handleDesignMenuClose}
//             PaperProps={{
//               sx: {
//                 width: menuWidth || 'auto',
//                 backgroundColor: '#424242',
//                 color: '#fff',
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleNavigation('/load_data')}>
//               Load Data
//             </MenuItem>
//             <MenuItem onClick={() => handleNavigation('/Create_Dashboard')}>
//               Charts
//             </MenuItem>
//           </Menu>

//           <Button
//             onClick={() => handleNavigation('/Edit_Chart')}
//             sx={{
//               backgroundColor: location.pathname === '/Edit_Chart' ? '#c5c5c9' : 'inherit',
//               alignItems: 'center',
//             }}
//           >
//             <ListItemIcon sx={{ display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'center', color: '#000000' }}>
//               edit
//             </ListItemIcon>
//           </Button>

//           <Button
//             aria-controls={openViewMenu ? 'view-menu' : undefined}
//             aria-haspopup="true"
//             aria-expanded={openViewMenu ? 'true' : undefined}
//             onClick={handleViewMenuClick}
//             sx={{
//               backgroundColor:
//                 location.pathname === '/Create_Dashboard' ||
//                 location.pathname === '/dashboard_view'
//                   ? '#c5c5c9'
//                   : 'inherit',
//               maxWidth: '150px',
//               alignItems: 'center',
//               color: 'inherit',
//             }}
//           >
//             <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', width: '150px', color: '#000000' }}>
//               View <ArrowDropDownCircleIcon sx={{ color: appBarColor }} />
//             </ListItemIcon>
//           </Button>

//           <Menu
//             id="view-menu"
//             anchorEl={viewMenuAnchorEl}
//             open={openViewMenu}
//             onClose={handleViewMenuClose}
//             PaperProps={{
//               sx: {
//                 width: menuWidth || 'auto',
//                 backgroundColor: '#424242',
//                 color: '#fff',
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleNavigation('/Charts_view')}>Charts</MenuItem>
//             <MenuItem onClick={() => handleNavigation('/dashboard_view')}>Dashboard</MenuItem>
//           </Menu>
//         </ButtonGroup>

//         {showColorPicker && (
//           <Box sx={{ position: 'absolute', top: '50px', right: '10px', zIndex: 0 }}>
//             <SketchPicker color={appBarColor} onChangeComplete={handleColorChange} />
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default SecondNavbar;
