import React, { Component } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
import MySnackbarContentWrapper from "../Alertas/Alertas";

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
    }
}));

const validRfcRegex = RegExp(
    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/
);

export default class Inscritos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rfc: "",
            total: [],
            progressBar: false,
            validar: "Favor de ingresar un RFC para validar",
            tipoAlerta: "info"
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

    handleSubmit = () => {
        if (this.state.certificado == "") {
            this.state.certificado = "null";
        }
        this.setState({
            progressBar: true,
            refrescar: "refrescar"
        });
        let url =
            "https://timreports.expidetufactura.com.mx/tboreport/public/Inscritos/" + this.state.rfc;
        fetch(url)
            .then(response => response.json())
            .then(respuesta => {
                if (respuesta.Inscritos == "0") {
                    this.setState({
                        progressBar: false,
                        validar:
                            "El RFC se encuentra inscrito dentro de la lista de contribuyentes",
                        refrescar: "noRefresh",
                        tipoAlerta: "success"
                    });
                } else {
                    this.setState({
                        progressBar: false,
                        validar:
                            "El RFC NO se encuentra inscrito dentro de la lista de contribuyentes",
                        tipoAlerta: false,
                        refrescar: "noRefresh",
                        tipoAlerta: "error"
                    });
                }
            });
    };

    render() {
        const {
            rfc,
            progressBar,
            validar,
            tipoAlerta,
            refrescar
        } = this.state;
        return (
            <div>
                {progressBar ? <ColorLinearProgress size={300} /> : <br />}
                <Typography variant="h4" gutterBottom>
                    RFC's Inscritos
                </Typography>
                <Divider />
                {refrescar != "refescar" ? (
                    <MySnackbarContentWrapper
                        variant={tipoAlerta}
                        message={validar}
                    />
                ) : (
                    <p />
                )}
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
                            <Button
                                type="submit"
                                size="large"
                                style={{
                                    background:
                                        "linear-gradient(5deg, #a2832f 30%, #3c2d04 90%)",
                                    borderRadius: 3,
                                    border: 0,
                                    margin: 25,
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
            </div>
        );
    }
}
