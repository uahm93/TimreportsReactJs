import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const ColorLinearProgress = withStyles({
	colorPrimary: {
		backgroundColor: '#262b69'
	},
	barColorPrimary: {
		backgroundColor: '#a2832f'
	}
})(LinearProgress);

export default class GraficaCancelacion extends Component {
	constructor() {
		super();
		this.state = {
			chartData: [],
			cancelacion: [],
			progressBar: '',
			fecha: ''
		};
	}
	render() {
		const { progressBar, fecha } = this.state;
		return (
			<div>
				{progressBar ? <ColorLinearProgress size={300} /> : <br />}
				<Typography variant="h5" align="center">
					Gráfica Cancelados {fecha}
				</Typography>
				<Line ref="chart" data={this.state.chartData} />
			</div>
		);
	}

	componentDidMount() {
		var meses = new Array(
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre'
		);
		var f = new Date();

		this.setState({
			progressBar: true,
			fecha: meses[f.getMonth()] + ' de ' + f.getFullYear()
		});
		let urlCancelacion = 'https://timreports.expidetufactura.com.mx/tboreport/public/graficaCancelacion';

		fetch(urlCancelacion).then((response) => response.json()).then((respuesta) => {
			console.log(respuesta);
			console.log(this.state.cancelacion);
			this.setState({
				chartData: {
					labels: [
						'01',
						'02',
						'03',
						'04',
						'05',
						'06',
						'07',
						'08',
						'09',
						'10',
						'11',
						'12',
						'13',
						'14',
						'15',
						'16',
						'17',
						'18',
						'19',
						'20',
						'21',
						'22',
						'23',
						'24',
						'25',
						'26',
						'27',
						'28',
						'29',
						'30',
						'31'
					],
					datasets: [
						{
							label: 'Cantidad de Cancelados',
							fill: false,
							lineTension: 0.1,
							backgroundColor: '#262b69',
							borderColor: '#262b69',
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: '#262b69',
							pointBackgroundColor: '#fff',
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: '#262b69',
							pointHoverBorderColor: 'rgba(220,220,220,1)',
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
							data: respuesta
						}
					]
				},
				progressBar: false
			});
		});
	}
}
