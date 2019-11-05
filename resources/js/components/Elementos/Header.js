import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import ListAltIcon from "@material-ui/icons/ListAlt";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import BarChartIcon from "@material-ui/icons/BarChart";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

//Componentes sistema
import Bitacora from "../Bitacora/BitacoraMain";
import Historico from "../Historicos/Historicos";
import MaterialTable from "../Tablas/Tabla";
import Boveda from "../Boveda/Boveda";
import Lco from "../Lco/Lco";
import Inscritos from "../Lco/Inscritos";
import Totales from "../Totales/Totales";
import Cancelados from "../Cancelacion/MainCancelacion.js";
//Fin componentes

//import NewTabla from "../Tablas/NewTabla";
function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func
};

export default function Header(props) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [usuario, setUsuario] = React.useState("");
    const [timbrado, setTimbrado] = React.useState("");
    const [postpago, setPostpago] = React.useState("");
    const [contrasena, setPassword] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        let url1 =
            "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerUsuario";
        fetch(url1)
            .then(response => response.json())
            .then(datosUsuario => {

                setUsuario(datosUsuario.usuario);
                setPassword(datosUsuario.contrasena);
                setPostpago(datosUsuario.postpago);
                setTimbrado(datosUsuario.timbresDispo);

            });
    },[]);

    function handleDrawerOpen() {
        setOpen(false);
    }

    function handleDrawerClose() {
        setOpen(false);
    }
    const classes = useStyles();

    const cerrarSesion = () => {
        window.location.href = "https://timreports.expidetufactura.com.mx/tboreport/public/logout";
    };
    const salir = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <React.Fragment>
                <Router>
                    <CssBaseline />

                    <AppBar
                        position="fixed"
                        color="primary"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: open
                        })}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, {
                                    [classes.hide]: open
                                })}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.texto}>
                                TIMREPORTS
                            </Typography>
                            {postpago ? (<b />) : (<Typography className={classes.timbres}>Timbrado Disponible: {timbrado}</Typography>)}
                            <Button color="inherit" onClick={salir}>
                            <b>{usuario}</b> <ArrowDropDownIcon />
                            </Button>
                            <Menu
                                id="fade-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={openMenu}
                                onClose={handleCloseMenu}
                                TransitionComponent={Fade}
                            >
                                <MenuItem onClick={cerrarSesion}>Salir</MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        variant="permanent"
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open
                            })
                        }}
                        open={open}
                    >
                        <div className={classes.toolbar}>
                            <img src="https://timbrado33.expidetufactura.com.mx:8447/control33Produccion/resources/imgs/logo.svg" />
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === "rtl" ? (
                                    <ChevronRightIcon />
                                ) : (
                                    <ChevronLeftIcon />
                                )}
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="Resumen Histórico" placement="right">
                                <Link to="/tboreport/public/principal">
                                    <ListItemIcon>
                                        <BarChartIcon />
                                    </ListItemIcon>
                                </Link>
                                </Tooltip>
                            </ListItem>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="Bitácora" placement="right">
                                <Link to="/tboreport/public/Bitacora">
                                    <ListItemIcon>
                                        <ListAltIcon />
                                    </ListItemIcon>
                                </Link>
                             </Tooltip>   
                            </ListItem>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="Cancelados" placement="right">
                                <Link to="/tboreport/public/Cancelados">
                                    <ListItemIcon>
                                        <CancelPresentationIcon />
                                    </ListItemIcon>
                                </Link>
                             </Tooltip>   
                            </ListItem>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="Bóveda" placement="right">
                                <Link Link to="/tboreport/public/Boveda">
                                    <ListItemIcon>
                                        <BusinessCenterIcon />
                                    </ListItemIcon>
                                </Link>
                             </Tooltip>   
                            </ListItem>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="L C O" placement="right">
                                <Link Link to="/tboreport/public/Lco">
                                    <ListItemIcon>
                                        <VideoLabelIcon />
                                    </ListItemIcon>
                                </Link>
                                </Tooltip>
                            </ListItem>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="RFC'S Inscritos" placement="right">
                                <Link Link to="/tboreport/public/Inscritos">
                                    <ListItemIcon>
                                        <AssignmentIcon />
                                    </ListItemIcon>
                                </Link>
                                </Tooltip>
                            </ListItem>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="Reportes Subcuentas" placement="right">
                                <Link Link to="/tboreport/public/Reportes">
                                    <ListItemIcon>
                                        <SupervisorAccountIcon />
                                    </ListItemIcon>
                                </Link>
                             </Tooltip>   
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}  title="Administrar Subcuentas" placement="right">
                                <Link to="/tboreport/public/AdmonSub">
                                    <ListItemIcon>
                                        <SettingsApplicationsIcon />
                                    </ListItemIcon>
                                </Link>
                             </Tooltip>   
                            </ListItem>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />

                        <Route
                            path="/tboreport/public/principal"
                            exact
                            render={() => <Historico />}
                        />
                        <Route
                            path="/tboreport/public/Bitacora"
                            render={() => <Bitacora />}
                        />
                        <Route
                            path="/tboreport/public/Cancelados"
                            render={() => <Cancelados user={usuario} password={contrasena} />}
                        />
                        <Route
                            path="/tboreport/public/Boveda"
                            render={() => <Boveda />}
                        />
                        <Route
                            path="/tboreport/public/Lco"
                            render={() => <Lco />}
                        />
                        <Route
                            path="/tboreport/public/Inscritos"
                            render={() => <Inscritos />}
                        />
                        <Route
                            path="/tboreport/public/Reportes"
                            render={() => <Totales />}
                        />
                        <Route
                            path="/tboreport/public/AdmonSub"
                            render={() => <MaterialTable />}
                        />
                    </main>
                </Router>
            </React.Fragment>
        </div>
    );
}
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    appBar: {
        background: "#EAEDED",
        color: "#a2832f",
        background: "linear-gradient(1deg, #FDFCFB 30%, #DDE0FA 90%)",
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    content: {
        flexGrow: 1,
        margin: theme.spacing(0 , -10),
        //padding: theme.spacing(3)
    },
    texto: {
        letterSpacing: 6,
        fontWeight: "fontWeightBold",
        flexGrow: 1
    },
    timbres: {
        letterSpacing: 1,
        fontWeight: "fontWeightLight",
        color: "#262b69",
        fontSize: 15
    },
    container: {
        padding: theme.spacing(0.2),
        margin: theme.spacing(1, 0)
    },
    root: {
        display: "flex",
        padding: theme.spacing(3, 2)
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap"
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden", 
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar
    },
    hide: {
        display: 'none',
      },
}));
