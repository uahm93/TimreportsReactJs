import "date-fns";
import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
} from "@material-ui/pickers";
import moment from "moment";
import LinearProgress from "@material-ui/core/LinearProgress";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

//Se importa la tabla
import TablaTotales from "../Tablas/TablaTotales";

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

export default function Totales() {
    const classes = useStyles1();
    // The first commit of Material-UI
    const [progressBar, setProgressBar] = React.useState(false);
    const [tabla, setTabla] = React.useState("Vacio"); //Bandera para renderizar grafica
    const [popupHandle, setpopupHandle] = React.useState(false);
    const [tipo, setTipo] = React.useState("txs");
    const [verificarCuenta, setVerificarCuenta] = React.useState("");
    const [mensaje, setMensaje] = React.useState("");
    const [estado, setEstado] = React.useState("TOTAL");
    const [total, setTotal] = React.useState([]);

    const handleCerrar = () => {
        setpopupHandle(false);
    };
    const [fecha_inicio, setfecha_inicio] = React.useState(
        moment(new Date()).format("YYYY-MM-DD/HH:mm")
    );
    const [fecha_fin, setfecha_fin] = React.useState(
        moment(new Date()).format("YYYY-MM-DD/HH:mm")
    );

    const FechaInicio = date => {
        const beginDate = moment(date).format("YYYY-MM-DD/HH:mm");
        setfecha_inicio(beginDate);
    };
    const fechaFin = date => {
        const endDate = moment(date).format("YYYY-MM-DD/HH:mm");
        setfecha_fin(endDate);
    };
    const tipoCuenta = data => {
        setTipo(data.target.value);
    };
    const handleEstado = data => {
        setEstado(data.target.value);
    };

    useEffect(() => {
        let verificar = "https://timreports.expidetufactura.com.mx/tboreport/public/emisores";
        fetch(verificar)
            .then(response => response.text())
            .then(respuesta => {
                setVerificarCuenta(respuesta);
            });
    });

    const getBoveda = () => {
        setProgressBar(true);
        setTabla("Vacio");
        if (tipo == "txe") {
            //Timbrado por RFC emisor
            var url =
                "https://timreports.expidetufactura.com.mx/tboreport/public/totalRFCEmisor/" +
                fecha_inicio.substring(0, 10)+'/'+fecha_inicio.substring(11)+
                "/" +
                fecha_fin.substring(0, 10)+'/'+fecha_fin.substring(11)+
                "/" +
                estado;
        } else {
            //Timbrado por subcuentas

            console.log(verificarCuenta);
            if (verificarCuenta == "SnSubcuentas") {
                setpopupHandle(true);
                setProgressBar(false);
                return setMensaje("No se encontraron subcuentas");
            } else {
                var url =
                    "https://timreports.expidetufactura.com.mx/tboreport/public/totalEmisor/" +
                    fecha_inicio.substring(0, 10)+'/'+fecha_inicio.substring(11)+
                    "/" +
                    fecha_fin.substring(0, 10)+'/'+fecha_fin.substring(11)+
                    "/" +
                    estado;
            }
        }

        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                if (respuesta.Respuesta == "Vacio") {
                    setMensaje("No se encontraron registros");
                    setpopupHandle(true);
                    setProgressBar(false);
                    setTabla("Vacio");
                } else {
                    setpopupHandle(false);
                    setTotal(
                        respuesta.map(row => {
                            return row;
                        })
                    );
                    setProgressBar(false);
                    setTabla(respuesta.Respuesta);
                }
            });
    };

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
            {progressBar ? <ColorLinearProgress size={300} /> : <br />}
            <Typography variant="h4" className={classes.grid} gutterBottom>
                Total timbrado
            </Typography>
            <Divider />
            <br />
            <Grid item justify="center" spacing={3}>
                <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    className={classes.grid}
                >
                    <Grid container className={classes.grid}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Tipo de reporte</InputLabel>
                            <Select
                                value={tipo}
                                displayEmpty
                                onChange={tipoCuenta}
                            >
                                <MenuItem value="txs">
                                    Total por subcuentas
                                </MenuItem>
                                <MenuItem value="txe">
                                    Total por RFC emisor
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container className={classes.grid}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Tipo de reporte</InputLabel>
                            <Select
                                value={estado}
                                displayEmpty
                                onChange={handleEstado}
                            >
                                <MenuItem value="EXITO">Exitosos</MenuItem>
                                <MenuItem value="FALLIDO">Fallidos</MenuItem>
                                <MenuItem value="TOTAL">Totales</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container className={classes.grid}>
                        <KeyboardDateTimePicker
                            value={fecha_inicio}
                            onChange={FechaInicio}
                            label="Ingresar Fecha Inicial"
                            onError={console.log}
                            minDate={new Date("2018-01-01T00:00")}
                            disableFuture
                            format="yyyy-MM-dd HH:mm"
                            cancelLabel="Cancelar"
                            okLabel="Aplicar"
                            ampm={false}
                        />
                    </Grid>

                    <Grid container className={classes.grid}>
                        <KeyboardDateTimePicker
                            value={fecha_fin}
                            onChange={fechaFin}
                            label="Ingresar Fecha Final"
                            onError={console.log}
                            minDate={fecha_inicio}
                            disableFuture
                            format="yyyy-MM-dd HH:mm"
                            cancelLabel="Cancelar"
                            okLabel="Aplicar"
                            ampm={false}
                        />
                    </Grid>
                    <Grid container className={classes.grid}>
                        <Button
                            className={classes.buttonAceptar}
                            type="submit"
                            value="Submit"
                            onClick={getBoveda}
                        >
                            Buscar
                        </Button>
                    </Grid>
                </MuiPickersUtilsProvider>
            </Grid>
            {tabla != "Vacio" ? <TablaTotales datos={total} /> : <p />}
        </div>
    );
}

const useStyles1 = makeStyles(theme => ({
    grid: {
        margin: 20
    },
    buttonAceptar: {
        background: "linear-gradient(5deg, #a2832f 30%, #3c2d04 90%)",
        borderRadius: 3,
        border: 0,
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)",
        color: "#FFFFFF"
    },
    formControl: {
        minWidth: 150
    }
}));
