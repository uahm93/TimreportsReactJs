import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slide from "@material-ui/core/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class ConfigurarCorreo extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            dialogo: ""
        }
    }
    handleCerrar = () => {
        
        this.setState({
            dialogo: false
        });
        
    };
    render() {
        const { dialogo } = this.state;
        return (
            <div>
                <Dialog
                    open={dialogo}
                    TransitionComponent={Transition}
                    aria-labelledby="form-dialog-title"
                >
                    {/*progressBar ? (
                            <ColorLinearProgress size={300} />
                        ) : (
                            <br />
                        )*/}
                    <DialogTitle id="form-dialog-title">
                        Modificar Envio de Reportes
                    </DialogTitle>

                    <DialogContent>
                        <FormControl
                            style={{
                                margin: 15,
                                minWidth: 140
                            }}
                        >
                            <InputLabel shrink>Doble verificación</InputLabel>
                            <Select
                                //value={values.age}
                                //onChange={handleChange}
                                input={<Input name="dobleVer" />}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>Habilitar</MenuItem>
                                <MenuItem value={0}>Deshabilitar</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            style={{
                                margin: 15,
                                minWidth: 140
                            }}
                        >
                            <InputLabel shrink>Reporte Diario</InputLabel>
                            <Select
                                //value={values.age}
                                //onChange={handleChange}
                                input={<Input name="reporteDiario" />}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={0}>Deshabilitar</MenuItem>
                                <MenuItem value={1}>Por Hora</MenuItem>
                                <MenuItem value={2}>Cierrre del día </MenuItem>
                                <MenuItem value={3}>Por Hora y Cierre</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            style={{
                                margin: 15,
                                minWidth: 140
                            }}
                        >
                            <InputLabel shrink>Código Respuesta</InputLabel>
                            <Select
                                //value={values.age}
                                //onChange={handleChange}
                                input={<Input name="codigoRespuesta" />}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={0}>Deshabilitar</MenuItem>
                                <MenuItem value={1}>Por Hora</MenuItem>
                                <MenuItem value={2}>Cierrre del día </MenuItem>
                                <MenuItem value={3}>Por Hora y Cierre</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                //onChange={setearTimbres}
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
                            Cancelar
                        </Button>
                        <Button
                            //className={classes.buttonAceptar}
                            //onClick={modificarTimbres}
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
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
