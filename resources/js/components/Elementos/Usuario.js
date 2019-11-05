import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import EmailIcon from "@material-ui/icons/Email";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles, lighten } from "@material-ui/core/styles";
import FormHelperText from '@material-ui/core/FormHelperText';


import ConfigurarCorreo from "./ConfigurarCorreo";

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

export default class Usuario extends Component {
    constructor() {
        super();
        this.state = {
            usuario: "",
            contrasena: "",
            nivel: "",
            nivelMax: "",
            timbresDispo: "",
            openDialog: false,
            verificar: "",
            agregarCorreo: false,
            habilitado: null,
            habilitadoConfig: null,
            reporteDiaro: "",
            reporteDiaroConfig: null,
            correos: "",
            correosConfig: null,
            Mensaje: "",
            progressBar: "",
            mensaje: "",
            codigoRespuesta: "",
            codigoRespuestaConfig: null,
            correos: "",
            hasError1: false,
            hasError2: false,
            hasError3: false

        };
        this.handleHabilitado = this.handleHabilitado.bind(this);
        this.handleReporteDiario = this.handleReporteDiario.bind(this);
        this.handleCodigoRespuesta = this.handleCodigoRespuesta.bind(this);
        this.handleCorreo = this.handleCorreo.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.datosUser();
        //this.verificarAlta();
    }

    componentWillUnmount() {
        clearInterval(this.datos);
    }

    datosUser() {
        let url1 =
            "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerUsuario";
        fetch(url1)
            .then(response => response.json())
            .then(datosUsuario => {
                this.setState({
                    usuario: datosUsuario.usuario,
                    nivel: datosUsuario.nivel,
                    nivelMax: datosUsuario.nivelMax,
                    timbresDispo: datosUsuario.timbresDispo,
                    contrasena: datosUsuario.contrasena
                });
            });
    }
    obtenerCorreos = () => {
        let url1 =
            "https://timreports.expidetufactura.com.mx/tboreport/public/obtenerCorreos";
        fetch(url1)
            .then(response => response.json())
            .then(datosCorreo => {
                this.setState({
                    habilitado: datosCorreo.doble_verificacion,
                    reporteDiaro: datosCorreo.timbrado_diarioC,
                    codigoRespuesta: datosCorreo.codigos_respuesta,
                    correos: datosCorreo.correo
                });
            });
    };
    verificarAlta = () => {
        let url =
            "https://timreports.expidetufactura.com.mx/tboreport/public/ObtenerConfigCorreo";

        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    verificar: respuesta
                });
            });
    };
    reportesCorreo = () => {
        this.setState({
            openDialog: true
        });
        this.verificarAlta();
        this.obtenerCorreos();
        //console.log(verificar);
    };

    configurarCorreo = () => {
        this.setState({
            agregarCorreo: true
        });
    };
    handleCerrar = () => {
        this.setState({
            openDialog: false,
            agregarCorreo: false
        });
    };

    handleHabilitado = event => {
        //console.log(event);
        this.setState({
            habilitado: event.target.value
        });
    };
    handleHabilitadoConfig = event => {
        //console.log(event);
        this.setState({
            hasError1: false,
            habilitadoConfig: event.target.value
        });
    };
    handleReporteDiario = event => {
        //console.log(event);
        this.setState({
            reporteDiaro: event.target.value
        });
    };
    handleReporteDiarioConfig = event => {
        
        this.setState({
            hasError2: false,
            reporteDiaroConfig: event.target.value
        });
    };
    handleCodigoRespuesta = event => {
        //console.log(event);
        this.setState({
            codigoRespuesta: event.target.value
        });
    };
    handleCodigoRespuestaConfig = event => {
        //console.log(event);
        this.setState({
            hasError3: false,
            codigoRespuestaConfig: event.target.value
        });
    };
    handleCorreo = event => {
        //console.log(event);
        this.setState({
            correos: event.target.value
        });
    };
    handleCorreoConfig = event => {
        //console.log(event);
        this.setState({
            correosConfig: event.target.value,
            hasError4: false
        });
    };
    handleCerrarPop = () => {
        this.setState({
            popupHandle: false
        });
    };

    handleSubmit = event => {
        
        //console.log(this.state.reporteDiaroConfig);
        if(this.state.habilitadoConfig === null ){
            this.setState({
                hasError1: true
            });
        }
        if(this.state.reporteDiaroConfig === null ){
            this.setState({
                hasError2: true
            });
        }
        if(this.state.codigoRespuestaConfig === null ){
            this.setState({
                hasError3: true
            });
        }
        if(this.state.correosConfig === null ){
            this.setState({
                hasError4: true
            });
        }

        if(this.state.reporteDiaroConfig === null || this.state.codigoRespuestaConfig === null || this.state.habilitadoConfig === null || this.state.correosConfig === null){
            console.log("Favor de llenar todos los campos");
        }else{
            this.setState({
                progressBar: true
            });
        let url =
            "https://timreports.expidetufactura.com.mx/tboreport/public/api/reportes_timbradores";

        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({Mensaje: "",
                user: this.state.usuario,
                password: this.state.contrasena,
                dobleVerificacion: this.state.habilitadoConfig,
                timbrado_diarioC: this.state.reporteDiaroConfig,
                codigos_respuesta: this.state.codigoRespuestaConfig,
                correo: this.state.correosConfig
            })
        })
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    progressBar: false,
                    mensaje: respuesta.Mensaje,
                    agregarCorreo: false,
                    popupHandle: true,
                    openDialog: false
                });
            });
        }   
         event.preventDefault();
    };

    handleSubmitMod = event => {
        
        this.setState({
            progressBar: true
        });
        let url =
            "https://timreports.expidetufactura.com.mx/tboreport/public/api/ModificarEnvio";

        fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: this.state.usuario,
                password: this.state.contrasena,
                dobleVerificacion: this.state.habilitado,
                timbrado_diarioC: this.state.reporteDiaro,
                codigos_respuesta: this.state.codigoRespuesta,
                correo: this.state.correos
            })
        })
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    progressBar: false,
                    mensaje: respuesta.Mensaje,
                    agregarCorreo: false,
                    popupHandle: true,
                    openDialog: false
                });
            });
        event.preventDefault();
    };

    render() {
        const {
            usuario,
            nivel,
            nivelMax,
            timbresDispo,
            openDialog,
            verificar,
            agregarCorreo,
            habilitado,
            habilitadoConfig,
            reporteDiaro,
            reporteDiaroConfig,
            codigoRespuesta,
            codigoRespuestaConfig,
            correos,
            correosConfig,
            progressBar,
            popupHandle,
            mensaje,
            hasError1,
            hasError2,
            hasError3,
            hasError4
        } = this.state;

        return (
            <div>
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
                    message={<span id="message-id">{mensaje}</span>}
                    action={[
                        <Button
                            key="undo"
                            color="secondary"
                            size="small"
                            onClick={this.handleCerrarPop}
                        >
                            <CloseIcon />
                        </Button>,
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClose={this.handleCerrarPop}
                        ></IconButton>
                    ]}
                />
                {verificar ? (
                    <Dialog
                        open={openDialog}
                        //onClose={handleCerrar}
                        TransitionComponent={Transition}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">
                            ¿Desea configurar algún correo?
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                //className={classes.buttonCancelar}
                                onClick={this.handleCerrar}
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
                                NO
                            </Button>
                            <Button
                                //className={classes.buttonAceptar}
                                onClick={this.configurarCorreo}
                                style={{
                                    background:
                                        "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)",
                                    borderRadius: 3,
                                    border: 0,
                                    color: "white",
                                    boxShadow:
                                        "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
                                }}
                            >
                                SI
                            </Button>
                        </DialogActions>
                    </Dialog>
                ) : (
                    <Dialog
                    open={openDialog}
                    //onClose={handleCerrar}
                    TransitionComponent={Transition}
                    aria-labelledby="form-dialog-title"
                >
                    {progressBar ? (
                        <ColorLinearProgress size={300} />
                    ) : (
                        <br />
                    )}
                    <DialogTitle id="form-dialog-title">
                        Modificar Envio de Reportes
                    </DialogTitle>
                    <form onSubmit={this.handleSubmitMod}>
                        <DialogContent>
                            <FormControl
                                style={{
                                    margin: 15,
                                    minWidth: 140
                                }}
                            >
                                <InputLabel shrink>
                                    Doble verificación
                                </InputLabel>
                                <Select
                                    value={habilitado}
                                    onChange={this.handleHabilitado}
                                    displayEmpty
                                >
                                    <MenuItem value={1}>Habilitar</MenuItem>
                                    <MenuItem value={0}>
                                        Deshabilitar
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl
                                style={{
                                    margin: 15,
                                    minWidth: 140
                                }}
                            >
                                <InputLabel shrink>
                                    Reporte Diario
                                </InputLabel>
                                <Select
                                    value={reporteDiaro}
                                    onChange={this.handleReporteDiario}
                                    displayEmpty
                                >
                                    <MenuItem value={0}>
                                        Deshabilitar
                                    </MenuItem>
                                    <MenuItem value={1}>Por Hora</MenuItem>
                                    <MenuItem value={2}>
                                        Cierrre del día{" "}
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        Por Hora y Cierre
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl
                                style={{
                                    margin: 15,
                                    minWidth: 140
                                }}
                            >
                                <InputLabel shrink>
                                    Código Respuesta
                                </InputLabel>
                                <Select
                                    value={codigoRespuesta}
                                    onChange={this.handleCodigoRespuesta}
                                    displayEmpty
                                >
                                    <MenuItem value={0}>
                                        Deshabilitar
                                    </MenuItem>
                                    <MenuItem value={1}>Por Hora</MenuItem>
                                    <MenuItem value={2}>
                                        Cierrre del día{" "}
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        Por Hora y Cierre
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    type="text"
                                    value={correos}
                                    onChange={this.handleCorreo}
                                    label="Asignar correos"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <AlternateEmailIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    fullWidth
                                />
                            </FormControl>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                onClick={this.handleCerrar}
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
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    background:
                                        "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)",
                                    borderRadius: 3,
                                    border: 0,
                                    color: "white",
                                    boxShadow:
                                        "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
                                }}
                            >
                                Agregar
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
                )}
                <Paper
                    style={{
                        padding: 10,
                        color: "#262b69",
                        alignItems: "center"
                    }}
                >
                    <Grid container spacing={3}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cuenta Padre</TableCell>
                                    <TableCell align="right">Nivel</TableCell>
                                    <TableCell align="right">
                                        Nivel Máximo
                                    </TableCell>
                                    <TableCell align="right">
                                        Timbres Disponibles
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        {usuario}
                                    </TableCell>
                                    <TableCell align="right">{nivel}</TableCell>
                                    <TableCell align="right">
                                        {nivelMax}
                                    </TableCell>
                                    <TableCell align="right">
                                        {timbresDispo}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.reportesCorreo()}
                                style={{
                                    background:
                                        "linear-gradient(45deg, #a2832f 30%, #a2832f 90%)",
                                    borderRadius: 3,
                                    border: 0,
                                    color: "white",
                                    boxShadow:
                                        "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
                                }}
                            >
                                Reportes por correo
                                <EmailIcon style={{ marginLeft: 5 }} />
                            </Button>
                        </Grid>
                    </Grid>
                    {/* ---------------------Inicio Configurar correo--------------------------- */}
                    <Dialog
                        open={agregarCorreo}
                        //onClose={handleCerrar}
                        TransitionComponent={Transition}
                        aria-labelledby="form-dialog-title"
                    >
                        {progressBar ? (
                            <ColorLinearProgress size={300} />
                        ) : (
                            <br />
                        )}
                        <DialogTitle id="form-dialog-title">
                            Configurar Envio de Reportes
                        </DialogTitle>
                        <form onSubmit={this.handleSubmit}>
                            <DialogContent>
                            <FormControl
                                style={{
                                    margin: 15,
                                    minWidth: 140
                                }}
                                error={hasError1}
                            >
                                <InputLabel shrink>
                                    Doble verificación
                                </InputLabel>
                                <Select
                                    value={habilitadoConfig}
                                    onChange={this.handleHabilitadoConfig}
                                    displayEmpty
                                >
                                    <MenuItem value={1}>Habilitar</MenuItem>
                                    <MenuItem value={0}>
                                        Deshabilitar
                                    </MenuItem>
                                </Select>
                                {hasError1 && <FormHelperText>Campo requerido</FormHelperText>}
                            </FormControl>
                                <FormControl
                                    style={{
                                        margin: 15,
                                        minWidth: 140
                                    }}
                                    error={hasError2}
                                >
                                    <InputLabel shrink>
                                        Reporte Diario
                                    </InputLabel>
                                    <Select
                                        value={reporteDiaroConfig}
                                        onChange={this.handleReporteDiarioConfig}
                                        displayEmpty
                                    >
                                        <MenuItem value={0}>
                                            Deshabilitar
                                        </MenuItem>
                                        <MenuItem value={1}>Por Hora</MenuItem>
                                        <MenuItem value={2}>
                                            Cierrre del día
                                        </MenuItem>
                                        <MenuItem value={3}>
                                            Por Hora y Cierre
                                        </MenuItem>
                                    </Select>
                                    {hasError2 && <FormHelperText>Campo requerido</FormHelperText>}
                                </FormControl>
                                <FormControl
                                    style={{
                                        margin: 15,
                                        minWidth: 140
                                    }}
                                    error={hasError3}
                                >
                                    <InputLabel shrink>
                                        Código Respuesta
                                    </InputLabel>
                                    <Select
                                        value={codigoRespuestaConfig}
                                        onChange={this.handleCodigoRespuestaConfig}
                                        displayEmpty
                                    >
                                        <MenuItem value={0}>
                                            Deshabilitar
                                        </MenuItem>
                                        <MenuItem value={1}>Por Hora</MenuItem>
                                        <MenuItem value={2}>
                                            Cierrre del día{" "}
                                        </MenuItem>
                                        <MenuItem value={3}>
                                            Por Hora y Cierre
                                        </MenuItem>
                                    </Select>
                                    {hasError3 && <FormHelperText>Campo requerido</FormHelperText>}
                                </FormControl>
                                <FormControl  error={hasError4}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        type="text"
                                        value={correosConfig}
                                        onChange={this.handleCorreoConfig}
                                        label="Asignar correos"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <AlternateEmailIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                        fullWidth
                                    />
                                    {hasError4 && <FormHelperText>Campo requerido</FormHelperText>}
                                </FormControl>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    onClick={this.handleCerrar}
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
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    style={{
                                        background:
                                            "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)",
                                        borderRadius: 3,
                                        border: 0,
                                        color: "white",
                                        boxShadow:
                                            "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
                                    }}
                                >
                                    Agregar
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                    {/* Fin configurar Correo */}
                </Paper>
            </div>
        );
    }
}
