<?php

namespace App\Exports;


use App\d_timbrado;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class BovedaExportRet implements FromView
{
    public function view(): View
    {


        $datosSession = session()->get('BovedaExcelRet');

        $iu_usuario  = session()->get('no_usuario');
        $hoy = date("Y-m-d", strtotime("-4 day"));


        $fechaI = $datosSession['fechainicio_boveda'];
        $horaI  = $datosSession['horaInicio_boveda'] . ':00';

        $fechaF = $datosSession['fechafin_boveda'];
        $horaF  = $datosSession['horaFin_boveda'] . ':00';


        //Recorre el rango de fechas seleccionado por el usuario
        for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
            $aux = date("Y-m-d", strtotime($i));
            if ($aux <= $hoy) {
                $año    = substr($i, 0, 4);
                $mes    = substr($i, 5, 2);
                $tablat[] = "historico_retenciones.{$año}_{$mes}_ret_timbrados";
            } else {
                $tablat[] = "retenciones_envio.ret_timbrados";
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
                $consulta = "SELECT rfcemisor, rfcreceptor, uuid, fecha_timbrado, total, serie, folio ,xml, fecha_emision FROM $tabla
                WHERE id_usuario = '$iu_usuario' AND fecha_timbrado BETWEEN '$fechaI $horaI' AND '$fechaF $horaF'";
                $total = DB::connection('retenciones_envio')->select($consulta);
            } catch (\Illuminate\Database\QueryException $e) {

                return view('errors.todos');
            }
            foreach ($total as $key) {

                $boveda[] = array(
                    'rfc_emisor'    => $key->rfcemisor,
                    'rfc_receptor' => $key->rfcreceptor,
                    'uuid'         => $key->uuid,
                    'fechah_timbrado' => $key->fecha_timbrado,
                    'monto' => number_format($key->total, 2),
                    'serie' => $key->serie,
                    'folio' => $key->folio,
                    'xml' => $key->xml,
                    'fechah_emision' => $key->fecha_emision,
                );
            }
        }

        //Este return llena la hoja de excel desde la vista  /resources/view/boveda.blade        
        return view('boveda', [
            'cfdis' => $boveda
        ]);
    }
}
