import React, { Component } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
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
    },
    exportar: {
        background: "linear-gradient(45deg, #4caf50 30%, #1b5e20 90%)",
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)",
        margin: 10
    }
}));

export default class Lco extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datos: this.props.data
        };
    }
    componentDidMount() {
        this.setState({
            datos: this.props.data
        });
    }

    componentWillUnmount() {
        this.setState({
            datos: this.props.data
        });
    }
    getReporte = () => {
        //Manda peticion para descargar el reporte en excel
        let uri5 = "https://timreports.expidetufactura.com.mx/tboreport/public/excelLco";
        window.location = uri5;
    };
    render() {
        const { datos } = this.state;

        return (
            <div>
                <Table className={useStyles.table}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Número de serie</StyledTableCell>
                            <StyledTableCell>RFC</StyledTableCell>
                            <StyledTableCell>Fecha inicio</StyledTableCell>
                            <StyledTableCell>Fecha fin</StyledTableCell>
                            <StyledTableCell>Estado</StyledTableCell>
                            <StyledTableCell>Validez</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datos.map(row => (
                            <StyledTableRow>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    key={row.no_serie}
                                >
                                    {row.no_serie}
                                </StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    key={row.rfc}
                                >
                                    {row.rfc}
                                </StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    key={row.fecha_inicio}
                                >
                                    {row.fecha_inicio}
                                </StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    key={row.fecha_fin}
                                >
                                    {row.fecha_fin}
                                </StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    key={row.estado}
                                >
                                    {row.estado}
                                </StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    key={row.validez_obligaciones}
                                >
                                    {row.validez_obligaciones ? "OK" : "NG"}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button
                    className={useStyles.exportar}
                    onClick={this.getReporte}
                    style={{
                        background:
                            "linear-gradient(45deg, #4caf50 30%, #1b5e20 90%)",
                        borderRadius: 3,
                        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)",
                        margin: 10
                    }}
                >
                    <SaveAltIcon /> Exportar a Excel
                </Button>
            </div>
        );
    }
}
