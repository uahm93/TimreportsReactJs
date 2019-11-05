<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Excel;
use App\Exports\CancelacionExport;
use App\Exports\CancelacionExportSinSub;

class CancelacionController extends Controller
{

    public function obtenerTotal(Request $request) //Sin Subcuentas
    {
        $fechaInicio = $request->fechaInicio;
        $fechaFin    = $request->fechaFin;
        $iu_usuario  = $request->iu_usuario;
        $id          = $request->user;
        $pw          = $request->password;

        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];

        if (Auth::attempt($credentials)) {

            $user = Auth::user();
            //$idUser = $user['iu_usuario'];
            if (!isset($fechaInicio) || !isset($fechaFin)) {
                return response()->json([
                    'Codigo' => '404',
                    'Mensaje' => 'Faltan parametros'
                ]);
            }
            $response = DB::connection('cancelacion')->collection('Bitacora')
                ->select('rfcEmisor', 'rfcReceptor', 'uuidCancelar', 'total', 'mensaje', 'estatusCancelacion', 'esCancelable', 'fecha')
                ->where([['idUsuario', '=', '' . $iu_usuario . ''], ['mensaje', '=', 'Cancelado']])
                ->whereIn('tipoOperacion', ['MULTI>', 'CANCELACION>'])
                ->whereBetween('fecha',  [$fechaInicio, $fechaFin])
                ->groupBy('uuidCancelar')
                ->get();

            if ($response->isNotEmpty()) {
                return $response;
            } else {
                return response()->json([
                    'Codigo' => '500',
                    'Mensaje' => 'No se encontraron registros'
                ]);
                return $response;
            }
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }
    public function ObtenerCancelados($fechainicio, $horaI, $fechafin, $horaF)
    {
        session()->put('CanceExcel', ['fechainicio_cance' => $fechainicio, 'fechafin_cance' => $fechafin, 'horaInicio_cance'  => $horaI, 'horaFin_cance' => $horaF]);
        $iu_usuario  = session()->get('no_usuario');
        $cancelados = [];
        $consulta = "SELECT * FROM r_cfdi 
                          WHERE estatusCancelacion = 'Cancelado' AND
                             iu_usuario = '$iu_usuario' AND
                              fechaCancelacion
                                 BETWEEN '$fechainicio $horaI' AND '$fechafin $horaF' ";

        try {
            $respuesta = DB::connection('cancelados')->select($consulta);
        } catch (\Illuminate\Database\QueryException $e) {

            return view('errors.todos');
        }

        foreach ($respuesta as $key) {

            $cancelados[] = array(
                'rfc_emisor'    => $key->rfc_emisor,
                'rfc_receptor' => $key->rfc_receptor,
                'uuid'         => $key->uuid,
                'fechah_timbrado' => $key->fecha,
                'monto' => number_format($key->monto, 2),
                'serie' => "N/A",
                'folio' => "N/A",
                'xml' => $key->path,
                'estatusCancelacion' => $key->estatusCancelacion,
                'fechaCancelacion' => $key->fechaCancelacion,
            );
        }

        if (!$cancelados) {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {
            return $cancelados;
        }
    }

    public function excelBovedaCancelacion($tipo)
    {

        set_time_limit(920);
        ini_set('memory_limit', '-1');

        $datosSession = session()->get('CanceExcel');
        $fechaI = $datosSession['fechainicio_cance'];
        $horaI  = $datosSession['horaInicio_cance'];

        $fechaF = $datosSession['fechafin_cance'];
        $horaF  = $datosSession['horaFin_cance'];

        if ($tipo == 'CnSubcuentas') {

            return Excel::download(new CancelacionExport($fechaI,  $horaI,  $fechaF, $horaF), 'ReporteExcel-' . $fechaI . '-' . $fechaF . '.csv');
        } else if ($tipo == 'SnSubcuentas') {

            return Excel::download(new CancelacionExportSub($fechaI,  $horaI,  $fechaF, $horaF), 'ReporteExcel-' . $fechaI . '-' . $fechaF . '.csv');
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Peticion incorrecta'
            ]);
        }
    }
}
