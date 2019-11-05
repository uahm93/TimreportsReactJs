import React, { Component } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import GraficaMensual from "../Graficas/GraficaMensual";
import Typography from "@material-ui/core/Typography";
import Complementos from "./Complementos";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const StyledTableCell = withStyles(theme => ({
    head: {
        background: "linear-gradient(0deg, #262b69 30%, #070b3d 90%)",
        borderRadius: 3,
        border: 0,
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default
        }
    }
}))(TableRow);

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    table: {},
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        border: ".5px solid #a2832f"
    },
    title: {
        width: "100%",
        maxWidth: 500
    }
}));

export default class Historicos extends Component {
    constructor() {
        super();
        this.state = {
            promedio: "",
            pendientes: "",
            timbradoHoy: "",
            timbradoAyer: "",
            totalHistorico: "",
            mesGrafica: 0
        };
    }
    componentDidMount() {
        this.obtenerdatos();
    }
    componentDidUnMount() {
        this.obtenerdatos();
    }
    obtenerdatos() {
        this.getTotalHistorico();
        this.getTimbradoAyer();
        this.getTimbradoHoy();
        this.getPendientes();
        this.getPromedio();
    }
    getPromedio() {
        let url = "https://timreports.expidetufactura.com.mx/tboreport/public/promedio_historico";

        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    promedio: respuesta.PromedioHistorico
                });
            });
    }
    getPendientes = () => {
        let url = "https://timreports.expidetufactura.com.mx/tboreport/public/pendientes_hoy";

        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    pendientes: respuesta.Pendientes
                });
            });
    };
    getTimbradoHoy = () => {
        let url = "https://timreports.expidetufactura.com.mx/tboreport/public/t_hoy";

        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    timbradoHoy: respuesta.TimbradoHoy
                });
            });
    };
    getTimbradoAyer = () => {
        let url = "https://timreports.expidetufactura.com.mx/tboreport/public/t_ayer";

        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    timbradoAyer: respuesta.TimbradoAyer
                });
            });
    };
    getTotalHistorico = () => {
        let url = "https://timreports.expidetufactura.com.mx/tboreport/public/totales";

        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                this.setState({
                    totalHistorico: respuesta.TotalHistorico
                });
            });
    };

    graficaHistorica = () => {
        let suma = this.state.mesGrafica + 1
        this.setState({
            mesGrafica: suma
        })
        
    }

    graficaHistorica2 = () => {
        let resta = this.state.mesGrafica - 1
        this.setState({
            mesGrafica: resta,
        })
        
    }

    render() {
        const {
            totalHistorico,
            timbradoAyer,
            timbradoHoy,
            pendientes,
            promedio,
            mesGrafica
        } = this.state;
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <Paper className={useStyles.paper}>
                        <GraficaMensual />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={useStyles.paper}>
                        <Typography
                            variant="h5"
                            component="h5"
                            gutterBottom
                            className={useStyles.title}
                            display="block"
                        >
                            Resumen histórico de comprobantes emitidos
                        </Typography>

                        <Table className={useStyles.table}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Descripción
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        Total
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">
                                        Total histórico de comprobantes emitidos
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {totalHistorico}
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">
                                        Promedio diario de comprobantes emitidos
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {promedio}
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">
                                        Total de comprobantes emitidos del día
                                        de ayer
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {timbradoAyer}
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                {/*<Grid item xs={6}>
                <Paper className={useStyles.paper}>
                    <Typography
                        variant="h5"
                        component="h5"
                        gutterBottom
                        className={useStyles.title}
                        display="block"
                    >
                        Resumen histórico de comprobantes cancelados
                    </Typography>

                    <Table className={useStyles.table}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Descripción</StyledTableCell>
                                <StyledTableCell align="right">
                                    Total
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    Total histórico de comprobantes cancelados
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    Pendiente
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    Promedio histórico de comprobantes
                                    cancelados
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    Pendiente
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    Total de comprobantes cancelados del día de
                                    ayer
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    Pendiente
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </Paper>
    </Grid>*/}
                <Grid item xs={12}>
                    <Paper className={useStyles.paper}>
                        <Typography
                            variant="h5"
                            component="h5"
                            gutterBottom
                            className={useStyles.title}
                            display="block"
                        >
                            Resumen timbrado hoy
                        </Typography>

                        <Table className={useStyles.table}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Descripción
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        Total
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">
                                        Total timbrados hoy
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {timbradoHoy}
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell component="th" scope="row">
                                        Pendientes de envío
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {pendientes}
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={useStyles.paper}>
                        <Typography
                            variant="h5"
                            component="h5"
                            gutterBottom
                            className={useStyles.title}
                            display="block"
                        >
                            Históricos por complementos
                        </Typography>
                        <Complementos />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
