import React from "react";
import clsx from "clsx";
import MaterialTable from "material-table";
import { makeStyles, withStyles, lighten } from "@material-ui/core/styles";
import Usuario from "../Elementos/Usuario";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ChildCareIcon from "@material-ui/icons/ChildCare";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AccessibleForwardIcon from "@material-ui/icons/AccessibleForward";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Slide from "@material-ui/core/Slide";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import TablaHijo from "./TablaHijo";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import BlockIcon from '@material-ui/icons/Block';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: "#262b69"
    },
    barColorPrimary: {
        backgroundColor: "#a2832f"
    }
})(LinearProgress);
export default function TablaSubcuentas() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [usuario, setUsuario] = React.useState(); //Con esta funcion se setea el usuario que se desea modificar
    const [stateUsuario, setstateUsuario] = React.useState();
    const [popup, setpopup] = React.useState();
    const [popupHandle, setpopupHandle] = React.useState(false);
    const [openReseteo, setopenReseteo] = React.useState(false);
    const [mensReseteo, setMensReseteo] = React.useState();
    const [progressBar, setProgressBar] = React.useState();
    const [timbres, setTimbres] = React.useState(false);
    const [AsingarTimbres, setAsingarTimbres] = React.useState();
    const [contrasena, setContrasena] = React.useState();

    const handleOpen = (usuario, estado) => {
        setOpen(true);
        setUsuario(usuario);
        setstateUsuario(estado);
    };
    const handleClose = () => {
        setOpen(false);
        setOpenDialog(false);
    };
    const handleCerrar = () => {
        setpopupHandle(false);
        setopenReseteo(false);
        setTimbres(false);
    };
    const setearTimbres = () => {
        //setAsingarTimbres({ value: event.target.value });

        setAsingarTimbres(event.target.value);
    };
    const resetPassword = () => {
        setProgressBar(true);
        let url1 = "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerUsuario";
        fetch(url1)
            .then(response => response.json())
            .then(datosUsuario => {
                let url =
                    "https://timreports.expidetufactura.com.mx/tboreport/public/api/ReestablecerPW";

                fetch(url, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user: datosUsuario.usuario,
                        password: datosUsuario.contrasena,
                        usuario: usuario
                    })
                })
                    .then(response => response.json())
                    .then(respuesta => {
                        setMensReseteo(respuesta.Contrasena);
                        setProgressBar(false);
                        setopenReseteo(true);
                    });
            });
    };
    const blockUser = estado => {
        setProgressBar(true);
        
        let url1 = "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerUsuario";
        fetch(url1)
            .then(response => response.json())
            .then(datosUsuario => {
                let url =
                    "https://timreports.expidetufactura.com.mx/tboreport/public/api/BloquearUser";

                fetch(url, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user: datosUsuario.usuario,
                        password: datosUsuario.contrasena,
                        usuario: usuario,
                        estado: estado
                    })
                })
                    .then(response => response.json())
                    .then(respuesta => {
                        setpopup(respuesta.Mensaje);
                        setProgressBar(false);
                        setpopupHandle(true);
                        setOpen(false);
                    });
            });
    };
    const [state, setState] = React.useState({
        columns: [
            { title: "Nivel", field: "nivel", editable: "never" },
            { title: "Id", field: "iu_usuario", editable: "never" },

            {
                title: "Nombre Usuario",
                field: "usuario",
                Header: "Usuario",
                cellstyle: { whiteSpace: "nowrap" }
            },

            {
                title: "Fecha Alta",
                field: "fechah_registro",
                editable: "never"
            },
            {
                title: "Timbres Disponibles",
                field: "timbra_disponible",
                type: "numeric"
            },
            {
                title: "Timbres Usados",
                field: "timbrado_total",
                editable: "never"
            },
            { title: "Nível Máximo", field: "nivelMax", editable: "never" }
        ]
    });
    const asignarTimbres = () => {
        setTimbres(true);
    };
    const modificarTimbres = () => {
        setProgressBar(true);
        let url1 = "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerUsuario";
        fetch(url1)
            .then(response => response.json())
            .then(datosUsuario => {
                let url =
                    "https://timreports.expidetufactura.com.mx/tboreport/public/api/AsignarTimbres";

                fetch(url, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user: datosUsuario.usuario,
                        password: datosUsuario.contrasena,
                        usuario: usuario,
                        asignarTimbres: AsingarTimbres
                    })
                })
                    .then(response => response.json())
                    .then(respuesta => {
                        setpopup(respuesta.Mensaje);
                        setProgressBar(false);
                        setpopupHandle(true);
                        setOpen(false);
                    });
            });
        setAsingarTimbres(0);
        setTimbres(false);
    };

    const verSubcuentas = (usuario, contrasena) => {
        setUsuario(usuario);
        setContrasena(contrasena);
        setOpenDialog(true);
    };

    return (
        <div>
            <Usuario />
            <Dialog
                fullScreen
                open={openDialog}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Regresar
                        </Typography>
                    </Toolbar>
                </AppBar>
                <TablaHijo usuario={usuario} contrasena={contrasena} />
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                open={popupHandle}
                TransitionComponent={Transition}
                ContentProps={{
                    "aria-describedby": "message-id"
                }}
                message={<span id="message-id">{popup}</span>}
                action={[
                    <Button
                        key="undo"
                        color="secondary"
                        size="small"
                        onClick={handleCerrar}
                    >
                        <CloseIcon />
                    </Button>,
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClose={handleCerrar}
                    ></IconButton>
                ]}
            />

            <Dialog
                open={openReseteo}
                TransitionComponent={Transition}
                onClose={handleCerrar}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    <h1>{usuario}</h1>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <b>Nueva contraseña asignada:</b> {mensReseteo}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        className={classes.buttonCancelar}
                        onClick={handleCerrar}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={timbres}
                onClose={handleCerrar}
                TransitionComponent={Transition}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{usuario}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sumar o restar timbres.
                    </DialogContentText>
                    <TextField
                        className={clsx(classes.textField)}
                        autoFocus
                        margin="dense"
                        type="number"
                        onChange={setearTimbres}
                        label="Asignar timbres"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <b>+-</b>
                                </InputAdornment>
                            )
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        className={classes.buttonCancelar}
                        onClick={handleCerrar}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className={classes.buttonAceptar}
                        onClick={modificarTimbres}
                        type="submit"
                        value="Submit"
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                className={classes.modal}
                maxWidth="xs"
                user={state.dataUser}
            >
                {progressBar ? <ColorLinearProgress size={300} /> : <br />}

                {!stateUsuario ? (
                <DialogTitle id="form-dialog-title">
                    Modificar usuario <b>{usuario}</b>
                </DialogTitle>) : (
                <DialogTitle id="form-dialog-title">
                    Este usuario se encuentra bloqueado
                </DialogTitle>)}
                <DialogContent dividers>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={asignarTimbres}
                        className={classes.chip}
                    >
                        Asignar Timbres
                        <EditOutlinedIcon style={{ marginLeft: 5 }} />
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={resetPassword}
                        className={classes.chip}
                    >
                        Resetear Contraseña
                        <SettingsBackupRestoreIcon style={{ marginLeft: 5 }} />
                    </Button>

                    {stateUsuario ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => blockUser("0")}
                            className={classes.chipVerde}
                        >
                            Habilitar Usuario
                            <PanoramaFishEyeIcon style={{ marginLeft: 5 }} />
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => blockUser("1")}
                            className={classes.chipRojo}
                        >
                            Bloquear Usuario
                            <BlockIcon style={{ marginLeft: 5 }} />
                        </Button>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        style={{
                            background:
                                "linear-gradient(45deg, #262b69 30%, #070b3d 90%)",
                            borderRadius: 3,
                            border: 0,
                            color: "white",
                            boxShadow:
                                "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <MaterialTable
                title="Administrar Subcuentas"
                columns={state.columns}
                data={state.data}
                className={classes.materialTable}
                actions={[
                    {
                        icon: "settings",
                        tooltip: "Modificar usuario ",
                        onClick: (event, rowData) =>
                            handleOpen(
                                rowData.usuario,
                                rowData.habilitado,
                                rowData.contrasena
                            )
                    },
                    {
                        icon: ChildCareIcon,
                        tooltip: "Ver Hijos",
                        onClick: (event, rowData) =>
                            verSubcuentas(rowData.usuario, rowData.contrasena)
                    }
                ]}
                options={{
                    exportButton: true,
                    headerStyle: {
                        backgroundColor: "#262b69",
                        color: "#E7E8F6"
                    },
                    actionsColumnIndex: -1
                }}
                editable={{
                    onRowAdd: newData =>
                        new Promise(resolve => {
                            resolve();
                            let url1 = "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerUsuario";
                            fetch(url1)
                                .then(response => response.json())
                                .then(datosUsuario => {
                                    let url =
                                        "https://timreports.expidetufactura.com.mx/tboreport/public/api/Nuevo";

                                    fetch(url, {
                                        method: "POST",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            user: datosUsuario.usuario,
                                            password: datosUsuario.contrasena,
                                            usuario: newData.usuario,
                                            asignarTimbres:
                                                newData.timbra_disponible
                                        })
                                    })
                                        .then(response => response.json())
                                        .then(respuesta => {
                                            if(respuesta.Codigo != '200'){
                                                setpopup(respuesta.Mensaje);
                                                setpopupHandle(true);
                                            }else{
                                            setopenReseteo(true);
                                            setMensReseteo(
                                                respuesta.Contrasena
                                            );
                                            }
                                        });
                                });
                        })
                }}
                data={query =>
                    new Promise((resolve, reject) => {
                        let url1 = "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerUsuario";
                        fetch(url1)
                            .then(response => response.json())
                            .then(datosUsuario => {
                                let url =
                                    "https://timreports.expidetufactura.com.mx/tboreport/public/api/Hijos/usuario=" +
                                    datosUsuario.usuario +
                                    "/pw=" +
                                    datosUsuario.contrasena +
                                    "/";

                                url += "subcuenta=sub" + query.search + "/";
                                url += "?page=" + (query.page + 1);

                                fetch(url, {
                                    method: "GET"
                                })
                                    .then(response => response.json())
                                    .then(result => {
                                        resolve({
                                            data: result.data,
                                            page: result.current_page - 1,
                                            totalCount: result.total
                                        });
                                    });
                            });
                    })
                }
            />
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
        position: "absolute",
        width: 300,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 4),
        alignItems: "center",
        border: "5px solid #262b69"
    },
    modal: {
        display: "flex",
        padding: theme.spacing(2, 4, 4),
        //padding: theme.spacing(2),
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        border: "5px solid #262b69"
    },
    fab: {
        margin: theme.spacing(2)
    },
    root: {
        flexGrow: 1
    },
    margin: {
        margin: theme.spacing(1)
    },
    buttonAceptar: {
        background: "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)",
        borderRadius: 3,
        border: 0,
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    buttonCancelar: {
        background: "linear-gradient(45deg, #262b69 30%, #070b3d 90%)",
        borderRadius: 3,
        border: 0,
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    chip: {
        /*margin: theme.spacing(1),
        width: 200,
        height: 50,
        //background: "linear-gradient(5deg, #a2832f 30%, #c1a965 80%)",
        boxShadow: "0 3px 5px 2px rgba(63.1, 51.8, 18.8, .3)"*/
        margin: theme.spacing(1),
        background: "#a2832f",
        borderRadius: 20,
        height: 50,
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    chipVerde: {
        /*margin: theme.spacing(1),
        width: 200,
        height: 50,
        //background: "linear-gradient(5deg, #a2832f 30%, #c1a965 80%)",
        boxShadow: "0 3px 5px 2px rgba(63.1, 51.8, 18.8, .3)"*/
        margin: theme.spacing(1),
        background: "#1b5e20",
        borderRadius: 20,
        height: 50,
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    chipRojo: {
        /*margin: theme.spacing(1),
        width: 200,
        height: 50,
        //background: "linear-gradient(5deg, #a2832f 30%, #c1a965 80%)",
        boxShadow: "0 3px 5px 2px rgba(63.1, 51.8, 18.8, .3)"*/
        margin: theme.spacing(1),
        background: "#dd2c00",
        borderRadius: 20,
        height: 50,
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    avatar: {
        boxShadow: "0 3px 5px 2px rgba(81.0, 77.3, 67.0, .3)",
        background: "#262b69"
    },
    appBar: {
        position: "relative",
        background: "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)"
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));
