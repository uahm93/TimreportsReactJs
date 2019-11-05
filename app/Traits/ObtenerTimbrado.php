<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
/*
 * Esta es una funcion generica. Obtiene el historico y productivo tanto timbrado cancelado y sin cancelar
 */

trait ObtenerTimbrado
{
    public function ObtenerTimbradoSinSubcuentas($fechainicio, $horaI, $fechafin, $horaF, $estado)
    {
        set_time_limit(920);
        ini_set('memory_limit', '-1');

        session()->put('BovedaExcel', ['fechainicio_boveda' => $fechainicio, 'fechafin_boveda' => $fechafin, 'horaInicio_boveda'  => $horaI, 'horaFin_boveda' => $horaF, 'estado' => $estado]);

        $boveda = [];

        $iu_usuario  = session()->get('no_usuario');
        $hoy = date("Y-m-d", strtotime("-4 day"));


        $fechaI = $fechainicio;
        $horaI  = $horaI . ':00';

        $fechaF = $fechafin;
        $horaF  = $horaF . ':00';


        //Recorre el rango de fechas seleccionado por el usuario
        for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
            $aux = date("Y-m-d", strtotime($i));
            if ($aux <= $hoy) {
                $año    = substr($i, 0, 4);
                $mes    = substr($i, 5, 2);
                $tablat[] = "timbrado_historico.{$año}_{$mes}_d_timbrado";
            } else {
                $tablat[] = "tr_core_timbrado.d_timbrado";
            }
        }
        if (!isset($tablat)) {
            return view('errors.todos');
        }


        //obtiene las tablas que se van a consultar y se eliminan las repetidas
        $resultado = array_unique($tablat);


        //Recorre las tablas obtenidas y ejecuta la consulta 
        foreach ($resultado as $tabla) {

            try {
                if ($estado == "Vigente") {
                    $total = DB::table($tabla)->select('rfc_emisor', 'rfc_receptor', 'uuid', 'fechah_timbrado', 'monto', 'serie', 'folio', 'xml', 'estatusCancelacion', 'fechaCancelacion')
                        ->where('iu_usuario', $iu_usuario)
                        ->whereBetween('fechah_timbrado',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                        ->orderby('fechah_timbrado')
                        ->get();
                } else if ($estado == "Cancelado") {
                    /*$total = DB::table($tabla)->select('rfc_emisor', 'rfc_receptor', 'uuid', 'fechah_timbrado', 'monto', 'serie', 'xml', 'estatusCancelacion', 'fechaCancelacion')
                        ->where([['iu_usuario', $iu_usuario], ['estatusCancelacion', '=', 'Cancelado']])
                        ->whereBetween('fechaCancelacion',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                        ->orderby('fechaCancelacion')
                        ->get();*/ } else {
                    return response()->json([
                        'Respuesta' => 'Solicitud no reconocida',
                    ]);
                }
            } catch (\Illuminate\Database\QueryException $e) {

                return view('errors.todos');
            }
            foreach ($total as $key) {

                $boveda[] = array(
                    'rfc_emisor'    => $key->rfc_emisor,
                    'rfc_receptor' => $key->rfc_receptor,
                    'uuid'         => $key->uuid,
                    'fechah_timbrado' => $key->fechah_timbrado,
                    'monto' => number_format($key->monto, 2),
                    'serie' => $key->serie,
                    'folio' => $key->folio,
                    'xml' => $key->xml,
                    'estatusCancelacion' => $key->estatusCancelacion,
                    'fechaCancelacion' => $key->fechaCancelacion,
                );
            }
        }

        if (!$boveda) {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {
            return $boveda;
        }
    }
    public function ObtenerTimbradoConSubcuentas($fechainicio, $horaI, $fechafin, $horaF, $estado)
    {
        set_time_limit(920);
        ini_set('memory_limit', '-1');

        session()->put('BovedaExcelSub', ['fechainicio_boveda' => $fechainicio, 'fechafin_boveda' => $fechafin, 'horaInicio_boveda'  => $horaI, 'horaFin_boveda' => $horaF]);

        $boveda = [];

        //Obtiene las cuentas hijo
        $iu_usuario = session()->get('no_usuario');
        $data = DB::table('d_usuario')->select('iu_usuario')
            ->where('alta_por', '=', $iu_usuario)
            ->orderby('iu_usuario')
            ->get();


        $usuarios = json_decode(json_encode($data), true);


        //Agrega la cuenta padre a la lista para posteriormente obtener sus reportes
        array_push($usuarios, array('iu_usuario' => $iu_usuario));


        $hoy = date("Y-m-d", strtotime("-4 day"));

        $fechaI = $fechainicio;
        $horaI  = $horaI . ':00';

        $fechaF = $fechafin;
        $horaF  = $horaF . ':00';

        foreach ($usuarios as $usuario) {

            $iu_usuario = $usuario['iu_usuario'];

            for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
                $aux = date("Y-m-d", strtotime($i));
                if ($aux <= $hoy) {
                    $año    = substr($i, 0, 4);
                    $mes    = substr($i, 5, 2);
                    $tablat[] = "timbrado_historico.{$año}_{$mes}_d_timbrado";
                } else {
                    $tablat[] = "tr_core_timbrado.d_timbrado";
                }
            }
            if (!isset($tablat)) {
                return view('errors.todos');
            }
            $resultado = array_unique($tablat);


            foreach ($resultado as $tabla) {

                try {
                    if ($estado == "Vigente") {
                        $total = DB::table($tabla)->select('rfc_emisor', 'rfc_receptor', 'uuid', 'fechah_timbrado', 'monto', 'serie', 'folio', 'xml', 'estatusCancelacion', 'fechah_emision')
                            ->where('iu_usuario', $iu_usuario)
                            ->whereBetween('fechah_timbrado',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                            ->orderby('fechah_timbrado')
                            ->get();
                    } else if ($estado == "Cancelado") {
                        /*$total = DB::table($tabla)->select('rfc_emisor', 'rfc_receptor', 'uuid', 'fechah_timbrado', 'monto', 'serie', 'xml', 'estatusCancelacion', 'fechah_emision')
                            ->where([['iu_usuario', $iu_usuario], ['estatusCancelacion', '=', 'Cancelado']])
                            ->whereBetween('fechaCancelacion',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                            ->orderby('fechaCancelacion')
                            ->get();*/ } else {
                        return response()->json([
                            'Respuesta' => 'Solicitud no reconocida',
                        ]);
                    }
                } catch (\Illuminate\Database\QueryException $e) {

                    return view('errors.todos');
                }

                foreach ($total as $key) {

                    $boveda[] = array(
                        'rfc_emisor'    => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'uuid'         => $key->uuid,
                        'fechah_timbrado' => $key->fechah_timbrado,
                        'monto' => number_format($key->monto, 2),
                        'serie' => $key->serie,
                        'folio' => $key->folio,
                        'xml' => $key->xml,
                        'estatusCancelacion' => $key->estatusCancelacion,
                        'fechah_emision' => $key->fechah_emision,
                    );
                }
            }
        }
        if (!$boveda) {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {
            return $boveda;
        }
    }
}
