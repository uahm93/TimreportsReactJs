import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import CodeIcon from "@material-ui/icons/Code";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import Slide from "@material-ui/core/Slide";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FilterListIcon from '@material-ui/icons/FilterList';

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: "#262b69"
    },
    barColorPrimary: {
        backgroundColor: "#a2832f"
    }
})(LinearProgress);

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === "desc"
        ? (a, b) => desc(a, b, orderBy)
        : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
    {
        id: "rfcEmisor",
        disablePadding: false,
        label: "RFC Emisor"
    },
    {
        id: "rfcReceptor",
        numeric: true,
        disablePadding: false,
        label: "RFC Receptor"
    },
    { id: "uuidCancelar", numeric: true, disablePadding: false, label: "UUID" },
    {
        id: "total",
        numeric: true,
        disablePadding: false,
        label: "Monto"
    },
    {
        id: "mensaje",
        numeric: true,
        disablePadding: false,
        label: "Mensaje"
    },
    {
        id: "fecha",
        numeric: true,
        disablePadding: false,
        label: "Fecha"
    },
    {
        id: "esCancelable",
        numeric: true,
        disablePadding: false,
        label: "Es cancelable"
    },
    {
        id: "estatusCancelacion",
        numeric: true,
        disablePadding: false,
        label: "Estatus cancelación"
    },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3)
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    tableWrapper: {
        overflowX: "auto"
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1
    },
    select: { margin: 30, minWidth: 540 },
    boton: {
        background: "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)",
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)",
        margin: 35
    },
    xmlBitacora: {
        background: "#e57373",
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    xmlTimbrado: {
        background: "#a5d6a7",
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    exportar: {
        background: "linear-gradient(45deg, #4caf50 30%, #1b5e20 90%)",
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)",
        margin: 10
    },
    zip: {
        background: "linear-gradient(45deg, #ffc107 30%, #ffa000 90%)",
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)",
        margin: 10
    }
}));

export default function EnhancedTable(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("rfc_emisor");
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [progressBar, setProgressBar] = React.useState(false);
    const [buscarMonto, setBuscarMonto] = React.useState("");
    const [buscar, setBuscar] = React.useState("");
    const [buscarFechaE, setBuscarFechaE] = React.useState("");
    const [buscarMensaje, setBuscarMensaje] = React.useState("");
    const [buscarReceptor, setBuscarReceptor] = React.useState("");
    const [buscarUuid, setBuscarUuid] = React.useState("");
    const [arreglo, setArreglo] = React.useState(props.datos);
    const [rows, setRows] = React.useState(props.datos);
    const [esCancelable, setesCancelable] = React.useState("");
    const [estatusCancelacion, setEstatusCancelacion] = React.useState("");

    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === "desc";
        setOrder(isDesc ? "asc" : "desc");
        setOrderBy(property);
    }

    function handleChangePage(event, newPage) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }

    function handleChangeDense(event) {
        setDense(event.target.checked);
    }

    const descargarPDF = (ruta, uuid, fecha ) => {
        if(props.tipoReporte === 'timbrado'){
        var encode = window.btoa(ruta);
        let uri =
            "https://timreports.expidetufactura.com.mx/tboreport/public/descargarPDF/" +
            encode +
            "/" +
            uuid+"/1/"+fecha.substring(0, 10);
        window.location = uri;
        //console.log(uri);
    }else{

        var fechaPdf = fecha.substring(0, 10);
        let uri =
            "https://timreports.expidetufactura.com.mx/tboreport/public/descargarPDF/" +
            "noMattersThis" +
            "/" +
            uuid+"/400/"+fechaPdf;
        //window.location = uri;
        console.log(uri);
    }
}

    const descargarXmlTimbrado = (ruta, uuid, fecha) => {
        //Manda la ruta para poder descargar el xml
        
            if(props.tipoReporte === 'timbrado'){
                var encode = window.btoa(ruta, uuid);
                let uri =
                    "https://timreports.expidetufactura.com.mx/tboreport/public/xml/" + encode + "/" + uuid+ "/timbrado";
                window.location = uri;
                
            }else{
                var fechaXml = fecha.substring(0, 10);
                let uri =
                    "https://timreports.expidetufactura.com.mx/tboreport/public/xml/" + fechaXml + "/" + uuid+ "/reten";
                window.location = uri;
            }

    };

    const getReporte = () => {
        var url = "https://timreports.expidetufactura.com.mx/tboreport/public/emisores";
        if(props.tipoReporte === 'timbrado'){
        fetch(url)
            .then(response => response.text())
            .then(respuesta => {
                let uri5 =
                    "https://timreports.expidetufactura.com.mx/tboreport/public/excelBoveda/" +
                    respuesta;
                window.location = uri5;
            });
        }else{
            fetch(url)
                .then(response => response.text())
                .then(respuesta => {
                    let uri5 =
                        "https://timreports.expidetufactura.com.mx/tboreport/public/excelBovedaRetenciones/" +
                        respuesta;
                    window.location = uri5;
                });  
        }
    };
    const getZip = () => {
        if(props.tipoReporte === 'timbrado'){
        let url = "https://timreports.expidetufactura.com.mx/tboreport/public/emisores";
        fetch(url)
            .then(response => response.text())
            .then(respuesta => {

                 let uri = 'https://timreports.expidetufactura.com.mx/tboreport/public/zipBoveda/'+respuesta;            
                 window.location = uri;
                 //console.log(uri);

        });}
        else{}
            
    };

    const filter = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.rfcEmisor.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setRows(newData);
        setBuscar(text);
    };

    const filterUuid = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.uuidCancelar.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setRows(newData);
        setBuscarUuid(text);
    };

    const filterReceptor = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.rfcReceptor.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setRows(newData);
        setBuscarReceptor(text);
    };

    const filterMonto = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            return item.total.startsWith(text);
        });

        setRows(newData);
        setBuscarMonto(text);
    };

    const filterMensaje = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            return item.mensaje.startsWith(text);
        });

        setRows(newData);
        setBuscarMensaje(text);
    };

    const filterFechaE = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            return item.fecha.startsWith(text);
        });

        setRows(newData);
        setBuscarFechaE(text);
    };
    const filterEsCancelable = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            return item.esCancelable.startsWith(text);
        });

        setRows(newData);
        setesCancelable(text);
    };
    const filterEstatusCancelacion = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            return item.estatusCancelacion.startsWith(text);
        });

        setRows(newData);
        setEstatusCancelacion(text);
    };

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div> {console.log(rows)}
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <div className={classes.tableWrapper}>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? "small" : "medium"}
                        >
                            <EnhancedTableHead
                                classes={classes}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <th>
                                
                                <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={buscar}
                                onChange={filter}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>
                            <th>
                                <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={buscarReceptor}
                                onChange={filterReceptor}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>
                            <th>
                            <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={buscarUuid}
                                onChange={filterUuid}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>
                            <th>
                                
                                <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={buscarMonto}
                                    onChange={filterMonto}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>
                            <th>
                                
                                <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={buscarMensaje}
                                onChange={filterMensaje}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>
                            <th>
                                <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={buscarFechaE}
                                onChange={filterFechaE}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>
                            <th>
                                
                                <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={esCancelable}
                                onChange={filterEsCancelable}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>
                            <th>
                                
                                <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                value={estatusCancelacion}
                                onChange={filterEstatusCancelacion}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                            </th>

                            <TableBody>
                                {stableSort(rows, getSorting(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row, index) => {
                                        return (
                                            <TableRow hover key={row.name}>
                                                <TableCell align="right">
                                                    {row.rfcEmisor}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.rfcReceptor}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row.uuidCancelar}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.total}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.mensaje}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.fecha}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.esCancelable}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.estatusCancelacion}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {/* <IconButton
                                                        className={
                                                            classes.xmlTimbrado
                                                        }
                                                        onClick={() =>
                                                            descargarXmlTimbrado(
                                                                row.xml,
                                                                row.uuid,
                                                                row.fechah_timbrado
                                                            )
                                                        }
                                                    >
                                                        <CodeIcon />
                                                    </IconButton> */}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {/* <IconButton
                                                        className={
                                                            classes.xmlBitacora
                                                        }
                                                        onClick={() =>
                                                            descargarPDF(
                                                                row.xml,
                                                                row.uuid,
                                                                row.fechah_timbrado
                                                            )
                                                        }
                                                    >
                                                        <PictureAsPdfIcon />
                                                    </IconButton> */}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 49 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            "aria-label": "página anterior"
                        }}
                        nextIconButtonProps={{
                            "aria-label": "página siguiente"
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
                {progressBar ? <ColorLinearProgress size={300} /> : <br />}

                <Button className={classes.exportar} onClick={getReporte}>
                    <SaveAltIcon /> Exportar a Excel
                </Button>
                <br />
                <FormControlLabel
                    control={
                        <Switch checked={dense} onChange={handleChangeDense} />
                    }
                    label="Compactar datos"
                />
                </div>
        </div>
    );
}
