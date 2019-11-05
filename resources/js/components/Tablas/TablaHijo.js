import React, { Component } from "react";
import MaterialTable from "material-table";
import { makeStyles, withStyles, lighten } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ChildCareIcon from "@material-ui/icons/ChildCare";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Slide from "@material-ui/core/Slide";

//import TablaHijo from "./TablaHijo";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class TablaHijo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: "",
            contrasena: "",
            openDialog: ""
        };
    }

    verSubcuentas(usuario, contrasena) {
        this.setState({
            usuario: usuario,
            contrasena: contrasena,
            openDialog: true
        });
    }
    handleClose = () => {
        this.setState({
            openDialog: false
        });
        //console.log("cerrar");
    };
    render() {
        const { usuario, contrasena, openDialog } = this.state;
        return (
            <div>
                <Dialog
                    fullScreen
                    open={openDialog}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar
                        style={{
                            position: "relative",
                            background:
                                "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)"
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleClose}
                                aria-label="close"
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                className={useStyles.title}
                            >
                                Regresar
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <TablaHijo usuario={usuario} contrasena={contrasena} />
                </Dialog>
                <MaterialTable
                    columns={[
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
                        {
                            title: "Nível Máximo",
                            field: "nivelMax",
                            editable: "never"
                        }
                    ]}
                    actions={[
                        {
                            icon: ChildCareIcon,
                            tooltip: "Ver Hijos",
                            onClick: (event, rowData) =>
                                this.verSubcuentas(
                                    rowData.usuario,
                                    rowData.contrasena
                                )
                        }
                    ]}
                    data={query =>
                        new Promise((resolve, reject) => {
                            let url =
                                "https://timreports.expidetufactura.com.mx/tboreport/public/api/Hijos/usuario=" +
                                this.props.usuario +
                                "/pw=" +
                                this.props.contrasena +
                                "/";

                            url += "subcuenta=sub" + query.search + "/";
                            url += "?page=" + (query.page + 1);

                            console.log(url);
                            fetch(url)
                                .then(response => response.json())
                                .then(result => {
                                    resolve({
                                        data: result.data,
                                        page: result.current_page - 1,
                                        totalCount: result.total
                                    });
                                });
                        })
                    }
                    title="Subcuentas"
                    options={{
                        exportButton: true,
                        headerStyle: {
                            backgroundColor: "#262b69",
                            color: "#E7E8F6"
                        },
                        actionsColumnIndex: -1
                    }}
                />
            </div>
        );
    }
}

const useStyles = makeStyles(theme => ({
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));
