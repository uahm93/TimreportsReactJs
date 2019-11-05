<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\d_timbrado;
use Illuminate\Support\Facades\DB;


class HistoricosController extends Controller
{

    public function index()
    {
        $iu_usuario  = session()->get('no_usuario');
        return d_timbrado::where('iu_usuario', $iu_usuario)->get();
    }

    //Función para obtener el total de timbres que generó el cliente desde que empezó a timbrar con nosotros
    public function totales()
    {
        $iu_usuario  = session()->get('no_usuario');

        $historico = DB::connection('historico_reporteador')->select('call spTotalHistorico("' . $iu_usuario . '")');

        return response()->json([
            'TotalHistorico' => number_format($historico[0]->TOTAL),
        ]);
    }

    public function t_ayer()
    {
        $ayer_t = 0;
        $ayer_r = 0;
        $iu_usuario  = session()->get('no_usuario');
        $ayer_t = DB::select('call spDiaAnterior("' . $iu_usuario . '")');
        $data_t = json_decode(json_encode($ayer_t), true);
        foreach ($data_t as $key) {
            $t_ayer = $key;
            $resultado_t = implode($t_ayer);
        }
        $ayer_r = DB::connection('retenciones_envio')->select('call spDiaAnteriorRet("' . $iu_usuario . '")');
        $data_r = json_decode(json_encode($ayer_r), true);
        foreach ($data_r as $key) {
            $t_ayer = $key;
            $resultado_r = implode($t_ayer);
        }
        $suma =  $resultado_r + $resultado_t;

        return response()->json([
            'TimbradoAyer' => number_format($suma),
        ]);
    }

    public function t_hoy()
    {
        $hoy_t  = 0;
        $hoy_r = 0;
        $iu_usuario  = session()->get('no_usuario');
        $fecha_ini = date("Y-m-d") . ": 00:00:00";
        $fecha_fin = date("Y-m-d") . ": 23:59:59";

        $hoy_t = DB::connection('mysql')->select("SELECT count(*) as timbrado_hoy FROM d_timbrado where iu_usuario = " . $iu_usuario . " and fechah_timbrado between '" . $fecha_ini . "' and '" . $fecha_fin . "' ");
        $data = json_decode(json_encode($hoy_t), true);
        foreach ($data as $key) {
            $hoy_t = $key;
            $resultado_t = implode($hoy_t);
        }

        $hoy_r = DB::connection('retenciones_envio')->select('call spTimbradoHoyRet("' . $iu_usuario . '")');
        $data_r = json_decode(json_encode($hoy_r), true);
        foreach ($data_r as $key) {
            $t_hoy = $key;
            $resultado_r = implode($t_hoy);
        }
        $suma =  $resultado_r + $resultado_t;
        return response()->json([
            'TimbradoHoy' => number_format($suma),
        ]);
    }
    public function pendientes_hoy()
    {
        $t_hoy = 0;
        $iu_usuario  = session()->get('no_usuario');
        $fecha_ini = date("Y-m-d") . ": 00:00:00";
        $fecha_fin = date("Y-m-d") . ": 23:59:59";

        $t_hoy = DB::connection('mysql')->select("SELECT count(*) as timbrado_hoy FROM d_timbrado where iu_usuario = " . $iu_usuario . " and fechah_timbrado between '" . $fecha_ini . "' and '" . $fecha_fin . "' and enviado = 0");
        $data = json_decode(json_encode($t_hoy), true);
        foreach ($data as $key) {
            $t_hoy = $key;
            $resultado = implode($t_hoy);
            $resultado = number_format($resultado);
        }
        return response()->json([
            'Pendientes' => number_format($resultado),
        ]);
    }

    public function grafica()
    {
        $iu_usuario  = session()->get('no_usuario'); //Obitene iu_usuario de cuenta logueada
        $rfc_padre = session()->get('user');         //Obitene RFC de cuenta logueada

        $emisores   = new HistoricosController;
        $datos = $emisores->obtieneSubcuentas($iu_usuario, $rfc_padre); //Verifica si tiene subcuentas


        $hoy    = date("Y-m-d", strtotime("-4 day"));

        if ($datos == "sinSubcuentas") {
            $dias_mes  = date("d");
            $anio_mes  = date("Y") . "_" . date("m");
            for ($i = 1; $i <= $dias_mes; $i++) {

                if ($i == 1 || $i == 2 || $i == 3 || $i == 4 || $i == 5 || $i == 6 || $i == 7 || $i == 8 || $i == 9) {
                    $aux = '0';
                    $i = $aux . $i;
                }
                $fecha = date("Y-m") . "-" . $i;

                if ($fecha <= $hoy) {    //Bucle para definir a  que tabla ir Historico o Productiva
                    $tabla = "timbrado_historico." . $anio_mes . "_d_timbrado";
                } else {
                    $tabla = "tr_core_timbrado.d_timbrado";
                }
                $total  = DB::table($tabla)->select(DB::RAW('count(*) as total'))
                    ->where([
                        ['iu_usuario', $iu_usuario],
                        ['fechah_timbrado',   'like',  '' . $fecha . '%']
                    ])
                    ->get();
                foreach ($total as $key) {

                    $timbrado = $key->total;
                }
                $totalxdia[] = $timbrado; //Se van guardando todos los resultados en un arreglo
            }

            return $totalxdia;
        } else {

            $dias_mes  = date("d");
            $anio_mes  = date("Y") . "_" . date("m");
            for ($i = 1; $i <= $dias_mes; $i++) {
                if ($i == 1 || $i == 2 || $i == 3 || $i == 4 || $i == 5 || $i == 6 || $i == 7 || $i == 8 || $i == 9) {
                    $aux = '0';
                    $i = $aux . $i;
                }
                $fecha = date("Y-m") . "-" . $i;


                if ($fecha <= $hoy) {
                    $tabla = "timbrado_historico." . $anio_mes . "_d_timbrado";
                } else {
                    $tabla = "tr_core_timbrado.d_timbrado";
                }
                $total  = DB::table($tabla)->select(DB::RAW('count(*) as total'))
                    ->where(
                        'fechah_timbrado',
                        'like',
                        '' . $fecha . '%'
                    )
                    ->whereIn('iu_usuario', $datos)   //Con esta condicion se saca el total de todos las subcuentas
                    ->get();
                foreach ($total as $key) {

                    $totalEmisor[] = $key->total;
                }
            }
            return $totalEmisor;
        }
    }
    public function obtieneSubcuentas($iu_usuario, $rfc_padre)
    {
        //obtiene el iu_usuario de todos los hijos de la cuenta logueada
        $consulta    = DB::table('d_usuario')->select('iu_usuario')
            ->where('alta_por', '=', $iu_usuario)
            ->get();
        if ($consulta->isNotEmpty()) {


            $data = json_decode(json_encode($consulta), true);

            $cuenta_padre = array(
                'iu_usuario' => $iu_usuario
            );
            array_push($data, $cuenta_padre); //Agrega la cuenta padre a la lista para posteriormente obtener sus cfdis

            foreach ($data as $key) {

                $subcuentas[] = $key['iu_usuario'];
            }
            return $subcuentas; //Arreglo con todas las subcuentas
        } else {

            return "sinSubcuentas";
        }
    }

    public function graficaCancelacion()
    {
        $iu_usuario  = session()->get('no_usuario'); //Obitene iu_usuario de cuenta logueada
        $rfc_padre = session()->get('user');         //Obitene RFC de cuenta logueada

        $emisores   = new HistoricosController;
        $datos = $emisores->obtieneSubcuentas($iu_usuario, $rfc_padre); //Verifica si tiene subcuentas


        $hoy    = date("Y-m-d", strtotime("-4 day"));

        if ($datos == "sinSubcuentas") {
            $dias_mes  = date("d");
            $anio_mes  = date("Y") . "_" . date("m");
            for ($i = 1; $i <= $dias_mes; $i++) {

                if ($i == 1 || $i == 2 || $i == 3 || $i == 4 || $i == 5 || $i == 6 || $i == 7 || $i == 8 || $i == 9) {
                    $aux = '0';
                    $i = $aux . $i;
                }
                $fecha = date("Y-m") . "-" . $i;

                $consulta = "SELECT count(*) as total FROM r_cfdi 
                        WHERE fechaCancelacion like '$fecha%' 
                          AND estatusCancelacion = 'Cancelado' 
                            AND iu_usuario = '$iu_usuario'";
                $total = DB::connection('cancelados')->select($consulta);
                foreach ($total as $key) {

                    $timbrado = $key->total;
                }
                $totalxdia[] = $timbrado; //Se van guardando todos los resultados en un arreglo
            }

            return $totalxdia;
        } else {

            $dias_mes  = date("d");
            $anio_mes  = date("Y") . "_" . date("m");
            for ($i = 1; $i <= $dias_mes; $i++) {
                if ($i == 1 || $i == 2 || $i == 3 || $i == 4 || $i == 5 || $i == 6 || $i == 7 || $i == 8 || $i == 9) {
                    $aux = '0';
                    $i = $aux . $i;
                }
                $fecha = date("Y-m") . "-" . $i;

                $consulta = "SELECT count(*) as total FROM r_cfdi 
                        WHERE fechaCancelacion like '$fecha%'
                          AND estatusCancelacion = 'Cancelado' 
                            AND iu_usuario = '$iu_usuario'";
                $total = DB::connection('cancelados')->select($consulta);

                foreach ($total as $key) {

                    $totalEmisor[] = $key->total;
                }
            }
            return $totalEmisor;
        }
    }

    public function totales_complementos()
    {

        $historico = 0;
        $iu_usuario  = session()->get('no_usuario');

        $historico = DB::connection('historico_reporteador')->select('call spTotalComplementos("' . $iu_usuario . '")');

        foreach ($historico as $complementos) {

            $replace     = $complementos->complemento;
            $complemento = $complementos->TOTAL_COMPLEMENTOS;
            if ($replace == '') {
                $replace = 'CFDI 3.3';
            } elseif ($replace == 'aerolineas|') {

                $replace = 'Complemento Aerolineas';
            } elseif ($replace == 'certificadodedestruccion|
') {

                $replace = 'Complemento de Certificado de Destrucción';
            } elseif ($replace == 'ComercioExterior11|
') {
                $replace = 'Complemento de Comercio Exterior';
            } elseif ($replace == 'consumodeCombustibles11|') {

                $replace = 'Complemento de Consumo de Combustibles 1.1';
            } elseif ($replace == 'consumodecombustibles|') {
                $replace = 'Complemento de Consumo de Combustibles 1.0';
            } elseif ($replace == 'detallista|
') {
                $replace = 'Complemento Detallista';
            } elseif ($replace == 'divisas|') {
                $replace = 'Complemento de Divisas';
            } elseif ($replace == 'donat11|') {
                $replace = 'Complemento de Donatarias 1.1';
            } elseif ($replace == 'ecc11|') {
                $replace = 'Complemento de Estado Cuenta de Combustibles 1.1';
            } elseif ($replace == 'ecc12|') {
                $replace = 'Complemento de Estado Cuenta de Combustibles 1.2';
            } elseif ($replace == 'GastosHidrocarburos10|') {
                $replace = 'Complemento de Gastos de Hidrocarburos';
            } elseif ($replace == 'GastosHidrocarburos10|
') {
                $replace = 'Complemento de Gastos de Hidrocarburos';
            } elseif ($replace == 'IdentificacionRecursoGastos|
') {
                $replace = 'Complemento de Identificación de Recursos';
            } elseif ($replace == 'iedu|') {
                $replace = 'Complemento concepto de Instituciones Educativas ';
            } elseif ($replace == 'implocal|') {
                $replace = 'Complemento de Impuestos Locales y/o federales';
            } elseif ($replace == 'ine11|
') {
                $replace = 'Complemento INE';
            } elseif ($replace == 'IngresosHidrocarburos|
') {
                $replace = 'Complemento de Ingresos Hidrocarburos';
            } elseif ($replace == 'leyendasFisc|') {
                $replace = 'Complemento Leyendas Fiscales';
            } elseif ($replace == 'nomina12|') {
                $replace = 'Complemento de Nomina 1.2';
            } elseif ($replace == 'notariospublicos|') {
                $replace = 'Complemento Notarios Publicos ';
            } elseif ($replace == 'obrasarteantiguedades|
') {
                $replace = 'Complemento Obras de Arte y Antiguedades';
            } elseif ($replace == 'pagoenespecie|') {
                $replace = 'Complemento Pago en Especie';
            } elseif ($replace == 'pago10|') {
                $replace = 'Complemento Recepción de Pagos';
            } elseif ($replace == 'pfic|') {
                $replace = 'Complemento de Personas Fisicas Integrantes de Coordinados';
            } elseif ($replace == 'renovacionysustitucionvehiculos|
') {
                $replace = 'Complemento de Renovación y sustitución de vehículos';
            } elseif ($replace == 'servicioparcialconstruccion|
') {
                $replace = 'Complemento Servicios parciales de construcción';
            } elseif ($replace == 'spei|
') {
                $replace = 'Complemento SPEI';
            } elseif ($replace == 'terceros11|
') {
                $replace = 'Complemento concepto por cuenta de Terceros';
            } elseif ($replace == 'TuristaPasajeroExtranjero|') {
                $replace = 'Complemento Turista pasajero extranjero';
            } elseif ($replace == 'valesdedespensa|
') {
                $replace = 'Complemento de Vales de despensa';
            } elseif ($replace == 'vehiculousado|
') {
                $replace = 'Complemento de Vehículo usado';
            } elseif ($replace == 'ventavehiculos11|
') {
                $replace = 'Complemento concepto Venta de vehiculos nuevos 1.1';
            } elseif ($replace == 'cfdiregistrofiscal|') {
                $replace = "";
                $complemento = 0;
            } elseif ($replace == 'gceh|') {
                $replace = "Complemento gastos hidrocarburos";
            } elseif ($replace == 'ieeh|') {
                $replace = "Complemento ingresos Hidrocarburos";
            } elseif ($replace == 'cce11|') {
                $replace = "Complemento de Comercio Exterior 1.1";
            }

            $totalComplementos[] = array(
                'complemento' => $replace,
                'TOTAL'       => number_format($complemento)
            );
        }
        foreach ($totalComplementos as $key => $value) {
            if ($value["TOTAL"] == 0) {
                unset($totalComplementos[$key]);
            }
        }

        $total = (array_values($totalComplementos));


        return $total;
    }

    public function promedio_historico()
    {
        $iu_usuario  = session()->get('no_usuario');
        $promedio    = DB::connection('historico_reporteador')->select('call spPromedio("' . $iu_usuario . '")');
        $data        = json_decode(json_encode($promedio), true);

        foreach ($data as $key) {
            $prom = $key;
            $resultado = implode($prom);
            $resultado = number_format($resultado);
        }

        return response()->json([
            'PromedioHistorico' => $resultado,
        ]);
    }
}
