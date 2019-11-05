<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Excel;
use App\Exports\LcoExport;
use App\Http\Controllers\Controller;


class LcoController extends Controller
{


    public function lco($rfc, $certificado, $estado)
    {
        session()->put('rfc_lco', $rfc);
        session()->put('certificado_lco', $certificado);
        session()->put('estado_lco', $estado);

        $rfc   = strtoupper($rfc);

        $letra = substr($rfc, 0, 1);
        $patron = '/^[A-Z, ]*$/';

        if (!preg_match($patron, $letra)) {

            return "RFC invalido";
        }

        $tabla = $letra . '_datos_certificado_sat';

        if ($estado == "todos") {
            $estado = "";
        }
        if ($certificado == "null") {
            $certificado = "";
        }

        $consulta = "SELECT 
					    no_serie,
					    rfc,
					    fecha_inicio,
					    fecha_fin,
					    estado,
					    validez_obligaciones
					 FROM
					    $tabla
					 WHERE
					    rfc = '$rfc'
					        AND no_serie LIKE '$certificado%'
					        AND estado LIKE '$estado%' ";


        $lco   = DB::connection('LCO')->select($consulta);

        $data = json_decode(json_encode($lco), true);

        if (!$data) {
            session()->put('excelLco', $data);
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        }

        session()->put('excelLco', $data);
        return $data;
    }

    public function inscritos($rfc)
    {

        $rfc   = strtoupper($rfc);

        $letra = substr($rfc, 0, 1);

        $patron = '/^[A-Z, ]*$/';

        if (!preg_match($patron, $letra)) {

            return "RFC invalido";
        }

        $tabla = "abc_timbrado." . $letra . '_rfc_inscritos';


        $consulta = "SELECT 
                            rfc
                         FROM
                            $tabla
                         WHERE
                            rfc = '$rfc'";

        $inscritos = DB::connection('LCO')->select($consulta);

        if (!$inscritos) {

            //No existe rfc 
            return response()->json([
                'Inscritos' => '1',
            ]);
        } else {

            //Si existe rfc 
            return response()->json([
                'Inscritos' => '0',
            ]);
        }
    }

    public function excelLco()
    {

        return Excel::download(new LcoExport, 'ReporteLCO.csv');
    }
}
