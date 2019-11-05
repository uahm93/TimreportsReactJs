import React, { Component } from "react";
import MySnackbarContentWrapper from "../Alertas/Alertas";
import TablaBitacora from "../Tablas/TablaBitacora";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

export default class Bitacora extends Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Bitacora
                </Typography>
                <Divider />
                <MySnackbarContentWrapper
                    variant="info"
                    message="Los registros mostrados en esta tabla se limitan a las últimas 72 horas."
                />
                <TablaBitacora />
            </div>
        );
    }
}
