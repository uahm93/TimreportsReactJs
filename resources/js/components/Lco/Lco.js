import React, { Component } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import TablaLco from "../Tablas/TablaLco";

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

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },

    dense: {
        marginTop: theme.spacing(2)
    },
    menu: {
        width: 200
    },
    root: {
        display: "flex",
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing(3),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    boton: {
        background: "linear-gradient(45deg, #a2832f 30%, #3c2d04 90%)",
        borderRadius: 3,
        border: 0,
        color: "white",
        boxShadow: "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
    },
    grid: {
        margin: 20
    },
    root: {
        flexGrow: 1
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

const validRfcRegex = RegExp(
    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/
);

export default class Lco extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rfc: "",
            estado: "todos",
            certificado: "",
            total: [],
            popupHandle: false,
            progressBar: false,
            tabla: "Vacio"
        };
    }
    componentDidMount() {
        ValidatorForm.addValidationRule("isRfcValid", value => {
            if (this.state.rfc.match(validRfcRegex)) {
                return true;
            } else {
                return false;
            }
        });
    }

    componentWillUnmount() {
        ValidatorForm.removeValidationRule("isRfcValid");
    }
    handleCerrar = () => {
        this.setState({
            popupHandle: false
        });
    };

    handleChange = event => {
        const rfc = event.target.value;
        this.setState({ rfc });
    };
    handleChangeEstado = event => {
        const estado = event.target.value;
        this.setState({ estado });
    };
    handleChangeCerti = event => {
        const certificado = event.target.value;
        this.setState({ certificado });
    };
    handleSubmit = () => {
        if (this.state.certificado == "") {
            this.state.certificado = "null";
        }
        this.setState({
            progressBar: true,
            tabla: "Vacio"
        });
        let url =
            "https://timreports.expidetufactura.com.mx/tboreport/public/lco/" +
            this.state.rfc +
            "/" +
            this.state.certificado +
            "/" +
            this.state.estado;
        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                if (respuesta.Respuesta == "Vacio") {
                    this.setState({
                        popupHandle: true,
                        progressBar: false,
                        tabla: "Vacio"
                    });
                } else {
                    this.setState({
                        total: respuesta.map(row => {
                            return row;
                        }),
                        progressBar: false,
                        tabla: respuesta.Respuesta
                    });
                }
            });
    };

    render() {
        const {
            rfc,
            certificado,
            estado,
            total,
            popupHandle,
            progressBar,
            tabla
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
                    message={
                        <span id="message-id">No se encontraon registros</span>
                    }
                    action={[
                        <Button
                            key="undo"
                            color="secondary"
                            size="small"
                            onClick={this.handleCerrar}
                        >
                            <CloseIcon />
                        </Button>,
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClose={this.handleCerrar}
                        ></IconButton>
                    ]}
                />
                {progressBar ? <ColorLinearProgress size={300} /> : <br />}
                <Typography variant="h4" gutterBottom>
                    L C O
                </Typography>
                <Divider />
                <br />
                <Grid container justify="center" spacing={3}>
                    <ValidatorForm
                        onSubmit={this.handleSubmit}
                        className={useStyles.grid}
                    >
                        <Grid item xs>
                            <TextValidator
                                id="outlined-rfc"
                                label="RFC"
                                name="rfc"
                                value={rfc}
                                onChange={this.handleChange}
                                validators={["isRfcValid", "required"]}
                                errorMessages={[
                                    "RFC invalido",
                                    "Campo requerido"
                                ]}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                onChange={this.handleChangeCerti}
                                id="outlined-name"
                                label="No. Certificado"
                                name="certificado"
                                value={certificado}
                                margin="normal"
                                type="number"
                            />
                        </Grid>
                        <br />
                        <Grid item xs>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                onChange={this.handleChangeEstado}
                                value={estado}
                                displayEmpty
                            >
                                <MenuItem value="todos">Todos</MenuItem>
                                <MenuItem value="A">Activo</MenuItem>
                                <MenuItem value="C">Cancelado</MenuItem>
                                <MenuItem value="R">Revocado</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs>
                            <Button
                                type="submit"
                                fullWidth
                                style={{
                                    background:
                                        "linear-gradient(5deg, #a2832f 30%, #3c2d04 90%)",
                                    borderRadius: 3,
                                    border: 0,
                                    margin: 30,
                                    color: "white",
                                    boxShadow:
                                        "0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)"
                                }}
                            >
                                Buscar
                            </Button>
                        </Grid>
                    </ValidatorForm>
                </Grid>
                {tabla != "Vacio" ? <TablaLco data={total} /> : <p />}
            </div>
        );
    }
}
