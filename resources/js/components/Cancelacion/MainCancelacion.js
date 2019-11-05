import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import moment from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

//Se importa la tabla
import TablaBoveda from '../Tablas/TablaBoveda';
import GraficaCancelacion from '../Graficas/GraficaCancelado';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ColorLinearProgress = withStyles({
	colorPrimary: {
		backgroundColor: '#262b69'
	},
	barColorPrimary: {
		backgroundColor: '#a2832f'
	}
})(LinearProgress);

export default function MaterialUIPickers() {
	const classes = useStyles1();
	// The first commit of Material-UI
	const [ progressBar, setProgressBar ] = React.useState(false);
	const [ datosTabla, setDatosTabla ] = React.useState('');
	const [ tipoDeCuenta, setTipoDecuenta ] = React.useState('');
	const [ tabla, setTabla ] = React.useState('Vacio'); //Bandera para renderizar grafica
	const [ popupHandle, setpopupHandle ] = React.useState(false);
	const [ tipo, setTipo ] = React.useState('cancelado');
	const [ url2, setUrl ] = React.useState('');
	const [ mensaje, setMensaje ] = React.useState('No se encontraron registros');

	const handleCerrar = () => {
		setpopupHandle(false);
	};
	const [ fecha_inicio, setfecha_inicio ] = React.useState(moment(new Date()).format('YYYY-MM-DD HH:mm'));
	const [ fecha_fin, setfecha_fin ] = React.useState(moment(new Date()).format('YYYY-MM-DD HH:mm'));

	const FechaInicio = (date) => {
		const beginDate = moment(date).format('YYYY-MM-DD HH:mm');
		setfecha_inicio(beginDate);
	};
	const fechaFin = (date) => {
		const endDate = moment(date).format('YYYY-MM-DD HH:mm');
		setfecha_fin(endDate);
	};

	const handleTipo = (tipo) => {
		setTabla('Vacio'); //Bandera para renderizar grafica
		setTipo(tipo.target.value);
	};

	const getBoveda = () => {
		setTabla('Vacio');
		let url = 'https://timreports.expidetufactura.com.mx/tboreport/public/emisores';
		fetch(url).then((response) => response.text()).then((respuesta) => {
			setTipoDecuenta(respuesta);
		});

		switch (tipo) {
			case 'cancelado':
				setProgressBar(true);
				setpopupHandle(true);
				setMensaje('Espere un momento mientras se procesan los datos');
				if (tipoDeCuenta == 'CnSubcuentas') {
					var url2 =
						'https://timreports.expidetufactura.com.mx/tboreport/public/obtenerCancelados/' +
						fecha_inicio.substring(0, 10) +
						'/' +
						fecha_inicio.substring(11) +
						'/' +
						fecha_fin.substring(0, 10) +
						'/' +
						fecha_fin.substring(11);
				} else {
					var url2 =
						'https://timreports.expidetufactura.com.mx/tboreport/public/obtenerCancelados/' +
						fecha_inicio.substring(0, 10) +
						'/' +
						fecha_inicio.substring(11) +
						'/' +
						fecha_fin.substring(0, 10) +
						'/' +
						fecha_fin.substring(11);
				}
				fetch(url2).then((response) => response.json()).then((respuesta) => {
					if (respuesta.Respuesta == 'Vacio') {
						setpopupHandle(true);
					} else {
						setpopupHandle(false);
						setDatosTabla(
							respuesta.map((row) => {
								return row;
							})
						);
					}
					setProgressBar(false);
					setTabla(respuesta.Respuesta);
				});
				break;

			default:
				console.log('Default');
		}
	};

	return (
		<div>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				open={popupHandle}
				TransitionComponent={Transition}
				ContentProps={{
					'aria-describedby': 'message-id'
				}}
				message={mensaje}
				action={[
					<Button key="undo" color="secondary" size="small" onClick={handleCerrar}>
						<CloseIcon />
					</Button>,
					<IconButton
						key="close"
						aria-label="close"
						color="inherit"
						className={classes.close}
						onClose={handleCerrar}
					/>
				]}
			/>
			{progressBar ? <ColorLinearProgress size={300} /> : <br />}
			<GraficaCancelacion />
			<Divider />
			{progressBar ? <ColorLinearProgress size={300} /> : <br />}
			<Typography variant="h5" className={classes.grid} gutterBottom>
				Reporte Cancelación
			</Typography>
			<Divider />

			<br />
			<Grid item>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Grid container className={classes.grid}>
						<KeyboardDateTimePicker
							value={fecha_inicio}
							onChange={FechaInicio}
							label="Ingresar Fecha Inicial"
							onError={console.log}
							minDate={new Date('2018-01-01T00:00')}
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
						<Button className={classes.buttonAceptar} type="submit" value="Submit" onClick={getBoveda}>
							Filtrar
						</Button>
					</Grid>
				</MuiPickersUtilsProvider>
			</Grid>
			{tabla != 'Vacio' ? <TablaBoveda datos={datosTabla} tipoReporte={tipo} /> : <p />}
		</div>
	);
}

const useStyles1 = makeStyles((theme) => ({
	grid: {
		margin: 20
	},
	buttonAceptar: {
		background: 'linear-gradient(5deg, #a2832f 30%, #3c2d04 90%)',
		boxShadow: '0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)',
		margin: 20,
		color: '#FFFFFF'
	},
	formControl: {
		minWidth: 255
	}
}));
