<?php

namespace App\Http\Controllers;

use Excel;
use Zipper;
use App\Exports\BovedaExport;
use App\Exports\BovedaExportRet;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Exports\BovedaExportSubCuentas;
use App\Exports\BovedaExportSubCuentasRet;
use nusoap_client;
use App\Traits\ObtenerTimbrado;


class BovedaController extends Controller
{
    use ObtenerTimbrado;

    protected $servicio = "https://timbrado33.expidetufactura.com.mx:8447/TimbradoBridgeProduccion/TimbradoService?wsdl";

    protected $retencionesWsdl = "https://xpdretenciones.expidetufactura.com.mx:8448/retProduccion/RetencionesWS";

    public function boveda($fechainicio, $horaI, $fechafin, $horaF, $estado)
    {
        /*
        * Manda a llamar una funcion generica, la cual obtiene el timbrado cancelado y sin cancelar su ruta es: 
        * App/Traits/ObtenerTimbrado
        */
        session()->put('BovedaExcelRet', ['fechainicio_boveda' => $fechainicio, 'fechafin_boveda' => $fechafin, 'horaInicio_boveda'  => $horaI, 'horaFin_boveda' => $horaF]);

        return $this->ObtenerTimbradoSinSubcuentas($fechainicio, $horaI, $fechafin, $horaF, $estado);
    }
    public function bovedaSubcuentas($fechainicio, $horaI, $fechafin, $horaF, $estado)
    {
        /*
        *Obtiene timbrado con subcuentas
        * Manda a llamar una funcion generica, la cual obtiene el timbrado cancelado y sin cancelar su ruta es: 
        * App/Traits/ObtenerTimbrado
        */
        session()->put('BovedaExcelRet', ['fechainicio_boveda' => $fechainicio, 'fechafin_boveda' => $fechafin, 'horaInicio_boveda'  => $horaI, 'horaFin_boveda' => $horaF]);

        return $this->ObtenerTimbradoConSubcuentas($fechainicio, $horaI, $fechafin, $horaF, $estado);
    }

    //Inicio subcuentas retenciones
    public function subcuentasRetenciones($fechainicio, $horaI, $fechafin, $horaF)
    {
        set_time_limit(920);
        ini_set('memory_limit', '-1');

        session()->put('BovedaExcelRet', ['fechainicio_boveda' => $fechainicio, 'fechafin_boveda' => $fechafin, 'horaInicio_boveda'  => $horaI, 'horaFin_boveda' => $horaF]);

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
                    $tablat[] = "historico_retenciones.{$año}_{$mes}_ret_timbrados";
                } else {
                    $tablat[] = "retenciones_envio.ret_timbrados";
                }
            }
            if (!isset($tablat)) {
                return view('errors.todos');
            }
            $resultado = array_unique($tablat);

            foreach ($resultado as $tabla) {

                $consulta = "SELECT rfcemisor, rfcreceptor, uuid, fecha_timbrado, total, serie, folio, xml, fecha_emision FROM $tabla
                             WHERE id_usuario = '$iu_usuario' AND fecha_timbrado BETWEEN '$fechaI $horaI' AND '$fechaF $horaF'";


                try {

                    $total = DB::connection('retenciones_envio')->select($consulta);
                    $data = json_decode(json_encode($total), true);
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
        }
        if (!$boveda) {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {
            return $boveda;
        }
    }
    //Fin Subcuentas retenciones
    //inicio retenciones sin sbucuentas 
    public function bovedaRetenciones($fechainicio, $horaI, $fechafin, $horaF)
    {
        set_time_limit(920);
        ini_set('memory_limit', '-1');

        session()->put('BovedaExcelRet', ['fechainicio_boveda' => $fechainicio, 'fechafin_boveda' => $fechafin, 'horaInicio_boveda'  => $horaI, 'horaFin_boveda' => $horaF]);

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
                $consulta = "SELECT rfcemisor, rfcreceptor, uuid, fecha_timbrado, total, serie, folio, xml, fecha_emision FROM $tabla
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

        if (!$boveda) {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {
            return $boveda;
        }
    }
    //Fin retenciones sin sbucuentas

    public function zipBoveda($tipo)
    {

        $datosSession = session()->get('BovedaExcel');
        $fechaI = $datosSession['fechainicio_boveda'];
        $horaI  = $datosSession['horaInicio_boveda'] . ':00';

        $fechaF = $datosSession['fechafin_boveda'];
        $horaF  = $datosSession['horaFin_boveda'] . ':00';

        $estado = $datosSession['estado'];




        if ($tipo == 'CnSubcuentas') {

            $mostrar = $this->ObtenerTimbradoSinSubcuentas($fechaI, $horaI, $fechaF, $horaF, $estado);
        } else if ($tipo == 'SnSubcuentas') {

            $mostrar = $this->ObtenerTimbradoConSubcuentas($fechaI, $horaI, $fechaF, $horaF, $estado);
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Peticion incorrecta'
            ]);
        }

        $array       = json_decode(json_encode($mostrar), True);

        foreach ($array as $key) {

            $rutas = $key['xml'];
            /*Añadimos la ruta donde se encuentran los archivos que queramos comprimir,
          en este ejemplo comprimimos todos los que se encuentran en la carpeta 
          storage/app/public*/
            $files[] = $rutas;
        }
        $arhivo  = session()->get('user') . '-' . $fechaI . '-' . $fechaF;

        /* Le indicamos en que carpeta queremos que se genere el zip y los comprimimos*/
        Zipper::make(storage_path('app/public/zips/' . $arhivo . '.zip'))->add($files)->close();

        /* Por último, si queremos descargarlos, indicaremos la ruta del archiv, su nombre
         y lo descargaremos*/

        return response()->download(storage_path('app/public/zips/' . $arhivo . '.zip'));
        //$path = storage_path('app/public/zips/'.$arhivo.'.zip');
        //unlink($path);


    }

    public function excelBoveda($tipo)
    {
        set_time_limit(1020);
        ini_set('memory_limit', '-1');

        $datosSession = session()->get('BovedaExcel');
        $fechaI = $datosSession['fechainicio_boveda'];
        $horaI  = $datosSession['horaInicio_boveda'] . ':00';
        $fechaF = $datosSession['fechafin_boveda'];
        $horaF  = $datosSession['horaFin_boveda'] . ':00';

        if ($tipo == 'CnSubcuentas') {

            return Excel::download(new BovedaExportSubCuentas($fechaI,  $horaI,  $fechaF, $horaF), 'ReporteExcel.csv');
        } else if ($tipo == 'SnSubcuentas') {

            return Excel::download(new BovedaExport($fechaI,  $horaI,  $fechaF, $horaF), 'ReporteExcel.csv');
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Peticion incorrecta'
            ]);
        }
    }

    public function excelBovedaRetenciones($tipo)
    {

        set_time_limit(920);
        ini_set('memory_limit', '-1');

        $fechainicio = session()->put('fechainicio_boveda');
        $fechafin = session()->put('fechafin_boveda');

        if ($tipo == 'CnSubcuentas') {
            return Excel::download(new BovedaExportSubCuentasRet, 'ReporteExcel-' . $fechainicio . '-' . $fechafin . '.csv');
        } else if ($tipo == 'SnSubcuentas') {
            return Excel::download(new BovedaExportRet, 'ReporteExcel-' . $fechainicio . '-' . $fechafin . '.csv');
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Peticion incorrecta'
            ]);
        }
    }

    public function descargarPDF($ruta, $uuid, $plantilla, $fecha) //Funcion para descargar el pdf
    {
        if ($plantilla == '400') {


            $hoy = date("Y-m-d", strtotime("-4 day"));
            $fechaTim = substr($fecha, 0, 4) . "_" . substr($fecha, 5, 2);
            if ($fecha <= $hoy) {
                $tabla = "historico_retenciones." . $fechaTim . "_ret_timbrados";
            } else {
                $tabla = "retenciones_envio.ret_timbrados";
            }
            $consulta  = "SELECT rfcemisor, rfcreceptor, uuid FROM $tabla WHERE uuid = '$uuid'";
            $respuesta = DB::connection('retenciones_envio')->select($consulta);
            $reten     = json_decode(json_encode($respuesta), true);

            echo $uuid        = $reten['0']['uuid'];
            echo $rfcreceptor = $reten['0']['rfcreceptor'];
            echo $rfcemisor   = $reten['0']['rfcemisor'];

            $arreglo    = array(
                'usuario'         => "God",
                'contrasena'      => "abracadabra",
                'uuid'            => $uuid,
                'rfcEmisor'       => $rfcreceptor,
                'rfcReceptor'     => $rfcemisor,
                'numeroPlantilla' => "400",
            );
            /*dd($arreglo);
            exit();*/

            try {

                $WebService = new nusoap_client($this->retencionesWsdl, 'wsdl');
                $WebService->soap_defencoding = 'UTF-8';
                $WebService->decode_utf8 = FALSE;
                $result = $WebService->call('obtenerPDFyXML', $arreglo);
                $response = json_decode(json_encode($result), True);

                if ($response['return']['codigo'] == "301") {
                    return redirect('/');
                };

                foreach ($response as $pdf) {
                    $pdfCod = $pdf['pdf'];
                }

                $decoded = base64_decode($pdfCod);
                $file = $uuid . '.pdf';
                file_put_contents($file, $decoded);

                if (file_exists($file)) {
                    header('Content-Description: File Transfer');
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename="' . $uuid . '.pdf"');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($file));
                    readfile($file);
                }
            } catch (Exception $e) {
                return response()->json([
                    'Respuesta' => 'No se encontró PDF',
                ]);
            }
        } elseif ($plantilla == '1') {
            $path = base64_decode($ruta);
            $fichero = base64_encode(file_get_contents($path, true));
        } else {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        }

        $arreglo    = array(
            'usuario'  => "God",
            'contrasena'    => "abracadabra",
            'archivo'       => $fichero,
            'plantilla'     => $plantilla, //retenciones 400  y Timbrado 1
            'observaciones' => "cero",
        );


        try {

            $WebService = new nusoap_client($this->servicio, 'wsdl');
            $WebService->soap_defencoding = 'UTF-8';
            $WebService->decode_utf8 = FALSE;
            $result = $WebService->call('obtenerPDFyXML', $arreglo);
            $response = json_decode(json_encode($result), True);

            if ($response['return']['codigo'] == "301") {
                return redirect('/');
            };

            foreach ($response as $pdf) {
                $pdfCod = $pdf['pdf'];
            }

            $decoded = base64_decode($pdfCod);
            $file = $uuid . '.pdf';
            file_put_contents($file, $decoded);

            if (file_exists($file)) {
                header('Content-Description: File Transfer');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . $uuid . '.pdf"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header('Content-Length: ' . filesize($file));
                readfile($file);
            }
        } catch (Exception $e) {
            return response()->json([
                'Respuesta' => 'No se encontró PDF',
            ]);
        }
    }
}
