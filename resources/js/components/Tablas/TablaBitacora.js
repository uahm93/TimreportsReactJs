import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles, lighten } from "@material-ui/core/styles";
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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import CodeIcon from "@material-ui/icons/Code";
import FilterListIcon from "@material-ui/icons/FilterList";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

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
    { id: "uuid", numeric: true, disablePadding: false, label: "UUID" },
    {
        id: "rfc_emisor",
        numeric: true,
        disablePadding: false,
        label: "RFC Emisor"
    },
    {
        id: "rfc_receptor",
        numeric: true,
        disablePadding: false,
        label: "RFC Receptor"
    },
    { id: "fecha", numeric: true, disablePadding: false, label: "Fecha" },
    {
        id: "respuesta",
        numeric: true,
        disablePadding: false,
        label: "Respuesta"
    },
    {
        id: "PATH_TIMBRADO",
        numeric: true,
        disablePadding: false,
        label: "XML timbrado"
    },
    {
        id: "PATH_BITACORA",
        numeric: true,
        disablePadding: false,
        label: "XML sin timbrar"
    }
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
        background: "linear-gradient(5deg, #a2832f 30%, #3c2d04 90%)",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)",
        margin: 35,
        color: "#FFFFFF"
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
    }
}));

export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("rfc_emisor");
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [estado, setEstado] = React.useState("EXITO");
    const [tabla, setTabla] = React.useState("Vacio"); //Bandera para mostrar grafica
    const [progressBar, setProgressBar] = React.useState(false);
    const [rows, setDatosTabla] = React.useState([]);
    const [popupHandle, setpopupHandle] = React.useState();
    const [verificarCuenta, setVerificarCuenta] = React.useState();
    const [mensaje, setMensaje] = React.useState("");
    const [buscar, setBuscar] = React.useState("");
    const [buscarRespuesta, setBuscarRespuesta] = React.useState("");
    const [buscarFecha, setBuscarFecha] = React.useState("");
    const [buscarReceptor, setBuscarReceptor] = React.useState("");
    const [buscarUuid, setBuscarUuid] = React.useState("");
    const [arreglo, setArreglo] = React.useState([]);

    const handleCerrar = () => {
        setpopupHandle(false);
    };

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
    const handleEstado = event => {
        setEstado(event.target.value);
    };
    const descargarXmlSinTimbrar = (ruta, uuid) => {
        //Manda la ruta para poder descargar el xml

        var encode = window.btoa(ruta, uuid);
        let uri =
            "https://timreports.expidetufactura.com.mx/tboreport/public/xml/" + encode + "/" + uuid;
        window.location = uri;
        //console.log(uri);
    };
    const descargarXmlTimbrado = (ruta, uuid) => {
        //Manda la ruta para poder descargar el xml
        if (estado == "fallido") {
            setMensaje("XML no encontrado");
            setpopupHandle(true);
        } else {
            var encode = window.btoa(ruta, uuid);
            let uri =
                "https://timreports.expidetufactura.com.mx/tboreport/public/xml/" + encode + "/" + uuid + "/timbrado";
            window.location = uri;
        }
    };
    const getReporte = () => {
        //Manda peticion para descargar el reporte en excel
        let uri5 = "https://timreports.expidetufactura.com.mx/tboreport/public/excel/" + verificarCuenta;
        window.location = uri5;
        //console.log(uri5);
    };
    const getBitacora = () => {
        setProgressBar(true);
        setTabla("Vacio");
        let url = "https://timreports.expidetufactura.com.mx/tboreport/public/emisores";
        fetch(url)
            .then(response => response.text())
            .then(respuesta => {
                setVerificarCuenta(respuesta);
                if (respuesta == "CnSubcuentas") {
                    var url2 =
                        "https://timreports.expidetufactura.com.mx/tboreport/public/subCuentasBita/" +
                        estado;
                } else {
                    var url2 =
                        "https://timreports.expidetufactura.com.mx/tboreport/public/FiltroBitacora/" +
                        estado;
                }
                fetch(url2)
                    .then(response => response.json())
                    .then(respuesta => {
                        if (respuesta.Respuesta == "Vacio") {
                            setProgressBar(false);
                            setTabla("Vacio");
                            setpopupHandle(true);
                            setMensaje("No se encontraron registros");
                        } else {
                            setTabla("Mostrar");
                            setDatosTabla(
                                respuesta.map(row => {
                                    return row;
                                })
                            );
                            setArreglo(
                                respuesta.map(row => {
                                    return row;
                                })
                            );
                            setProgressBar(false);
                        }
                    });
            });
    };

    const filter = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.rfc_emisor.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setDatosTabla(newData);
        setBuscar(text);
    };

    const filterUuid = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.uuid.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setDatosTabla(newData);
        setBuscarUuid(text);
    };

    const filterReceptor = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.rfc_receptor.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setDatosTabla(newData);
        setBuscarReceptor(text);
    };

    const filterFecha = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.fechah.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setDatosTabla(newData);
        setBuscarFecha(text);
    };

    const filterRespuesta = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            const itemData = item.respuesta.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setDatosTabla(newData);
        setBuscarRespuesta(text);
    };

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
            <FormControl className={classes.select}>
                <InputLabel shrink>Estado de cfdis</InputLabel>
                <Select displayEmpty value={estado} onChange={handleEstado}>
                    <MenuItem value="EXITO">Exitosos</MenuItem>
                    <MenuItem value="fallido">Fallidos</MenuItem>
                </Select>
            </FormControl>
            <Button className={classes.boton} onClick={getBitacora}>
                Filtrar
            </Button>
            {tabla != "Vacio" ? (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <div className={classes.tableWrapper}>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size={dense ? "small" : "medium"}
                            >
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
                                value={buscarFecha}
                                onChange={filterFecha}
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
                                value={buscarRespuesta}
                                onChange={filterRespuesta}
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
                                <EnhancedTableHead
                                    classes={classes}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />

                                <TableBody>
                                    {stableSort(
                                        rows,
                                        getSorting(order, orderBy)
                                    )
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover key={row.name}>
                                                    <TableCell align="left">
                                                        {row.uuid}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {row.rfc_emisor}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {row.rfc_receptor}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {row.fechah}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {row.respuesta}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            className={
                                                                classes.xmlTimbrado
                                                            }
                                                            onClick={() =>
                                                                descargarXmlTimbrado(
                                                                    row.PATH_TIMBRADO,
                                                                    row.uuid
                                                                )
                                                            }
                                                        >
                                                            <CodeIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            className={
                                                                classes.xmlBitacora
                                                            }
                                                            onClick={() =>
                                                                descargarXmlSinTimbrar(
                                                                    row.PATH_BITACORA
                                                                )
                                                            }
                                                        >
                                                            <CodeIcon />
                                                        </IconButton>
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
                    <Button className={classes.exportar} onClick={getReporte}>
                        <SaveAltIcon /> Exportar a Excel
                    </Button>
                    <br />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={dense}
                                onChange={handleChangeDense}
                            />
                        }
                        label="Compactar datos"
                    />
                </div>
            ) : (
                <a />
            )}
        </div>
    );
}
