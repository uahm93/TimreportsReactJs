import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const StyledTableCell = withStyles((theme) => ({
	head: {
		background: 'linear-gradient(0deg, #262b69 30%, #070b3d 90%)',
		borderRadius: 3,
		border: 0,
		color: 'white',
		boxShadow: '0 3px 5px 2px rgba(14.9, 16.9, 41.2, .3)'
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default
		}
	}
}))(TableRow);

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing(3),
		overflowX: 'auto'
	},
	table: {},
	paper: {
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		border: '.5px solid #a2832f'
	},
	title: {
		width: '100%',
		maxWidth: 500
	}
}));

export default class Complementos extends Component {
	constructor() {
		super();
		this.state = {
			total: []
		};
	}
	componentDidMount() {
		this.getComplementos();
		//this.verificarAlta();
	}

	getComplementos() {
		let url = 'https://timreports.expidetufactura.com.mx/tboreport/public/totales_complementos';
		fetch(url).then((response) => response.json()).then((respuesta) => {
			this.setState({
				total: respuesta.map((row) => {
					return row;
				})
			});
		});
	}

	render() {
		const { total } = this.state;
		return (
			<Table className={useStyles.table}>
				<TableHead>
					<TableRow>
						<StyledTableCell>Descripción</StyledTableCell>
						<StyledTableCell align="right">Total</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{total.map((row) => (
						<StyledTableRow>
							<StyledTableCell component="th" scope="row" key={row.complemento}>
								{row.complemento}
							</StyledTableCell>
							<StyledTableCell component="th" scope="row" key={row.TOTAL}>
								{row.TOTAL}
							</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		);
	}
}
