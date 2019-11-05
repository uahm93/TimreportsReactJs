<?php

namespace App\Http\Controllers;

use Excel;
use Illuminate\Http\Request;
use App\Exports\BitacoraExport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Exports\BitacoraExportSubCuentas;


class BitacoraController extends Controller
{


    public function iuUsuario()
    {

        //obtiene el iu_usuario de todos los hijos de la cuenta padre
        $iu_usuario  = session()->get('no_usuario');
        //$padre       = session()->get('user');
        $consulta    = DB::table('d_usuario')->select('iu_usuario', 'usuario')
            ->where('alta_por', '=', $iu_usuario)
            ->orderby('iu_usuario')
            ->get();
        if ($consulta == '[]') {
            return session()->get('no_usuario');
        } else {
            return $consulta;
        }
    }

    public function subCuentasBita($estado)
    {

        ini_set('memory_limit', '-1');
        set_time_limit(920);
        session()->put('estado_bitacora', $estado);



        $iu_usuario = session()->get('no_usuario');
        $emisores   = new BitacoraController;
        $usuarios   = $emisores->iuUsuario();


        $data = json_decode(json_encode($usuarios), true);
        array_push($data, array('iu_usuario' => $iu_usuario));
        $iu_usuario = session()->get('no_usuario');


        $bitacora   = [];

        if ($estado == "null") {
            $estado = "";
        }

        if ($estado == "uuid") {
            $estado = 'snv';
        }

        if ($estado == 'fallido') {

            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];

                $historico = DB::table('d_bitacora')
                    ->select('rfc_emisor', 'rfc_receptor', 'fechah', 'respuesta', 'codigo', 'xml as PATH_BITACORA')
                    ->where([
                        ['iu_usuario', $iu_usuario],
                        ['codigo',  '!=', 'EXITO'],
                    ])
                    ->orderby('d_bitacora.fechah')
                    ->get();
                foreach ($historico as $key) {

                    $bitacora[] = array(

                        'rfc_emisor' => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'fechah' => $key->fechah,
                        'respuesta' => $key->respuesta,
                        'codigo' => $key->codigo,
                        'PATH_BITACORA' => $key->PATH_BITACORA,
                    );
                }
            }
        } elseif ($estado == 'EXITO') {

            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];

                $historico = DB::table('d_timbrado')
                    ->join('d_bitacora', 'd_timbrado.transaccion', '=', 'd_bitacora.transaccion')
                    ->select('d_timbrado.uuid', 'd_bitacora.rfc_emisor', 'd_bitacora.rfc_receptor', 'd_bitacora.fechah', 'd_bitacora.respuesta', 'd_bitacora.respuesta', 'd_bitacora.codigo', 'd_timbrado.xml as PATH_TIMBRADO', 'd_bitacora.xml as PATH_BITACORA')
                    ->where([
                        ['d_bitacora.iu_usuario', $iu_usuario],
                        ['d_bitacora.codigo',     'EXITO']
                    ])
                    ->orderby('d_bitacora.fechah')
                    ->get();
                foreach ($historico as $key) {

                    $bitacora[] = array(

                        'uuid'    => $key->uuid,
                        'rfc_emisor' => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'fechah' => $key->fechah,
                        'respuesta' => $key->respuesta,
                        'codigo' => $key->codigo,
                        'PATH_TIMBRADO' => $key->PATH_TIMBRADO,
                        'PATH_BITACORA' => $key->PATH_BITACORA,
                    );
                }
            }
        } else {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        }

        if (!$bitacora) {

            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {
            return $bitacora;
        }
    }

    public function bitacora($estado)
    {
        set_time_limit(920);
        ini_set('memory_limit', '-1');
        session()->put('estado_bitacora', $estado);
        $historico = [];



        if ($estado == "null") {
            $estado = "";
        }
        if ($estado == "uuid") {
            $estado = 'snv';
        }

        $iu_usuario  = session()->get('no_usuario');
        if ($estado == 'fallido') {
            $historico = DB::table('d_bitacora')
                ->select('rfc_emisor', 'rfc_receptor', 'fechah', 'respuesta', 'codigo', 'xml as PATH_BITACORA')
                ->where([
                    ['iu_usuario', $iu_usuario],
                    ['codigo',  '!=', 'EXITO'],
                ])
                ->orderby('d_bitacora.fechah')
                ->get();
        } elseif ($estado == 'EXITO') {
            $historico = DB::table('d_timbrado')
                ->join('d_bitacora', 'd_timbrado.transaccion', '=', 'd_bitacora.transaccion')
                ->select('d_timbrado.uuid', 'd_bitacora.rfc_emisor', 'd_bitacora.rfc_receptor', 'd_bitacora.fechah', 'd_bitacora.respuesta', 'd_bitacora.respuesta', 'd_bitacora.codigo', 'd_timbrado.xml as PATH_TIMBRADO', 'd_bitacora.xml as PATH_BITACORA')
                ->where([
                    ['d_bitacora.iu_usuario', $iu_usuario],
                    ['d_bitacora.codigo',     'EXITO']
                ])
                ->orderby('d_bitacora.fechah')
                ->get();
        } else {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        }

        //$file = escapeshellcmd($data);
        //$cmd = ("echo {$data} | sed 's/},/},\n/g' | xargs -n 1 echo | cut -f1,2,3,4,5,6 -d',' | sed 's/\[\|{uuid:\|rfc_emisor:\|rfc_receptor:\|fechah:\|respuesta:\|codigo://g' > datosVariableTer.xlsx'");
        //shell_exec($cmd);  
        //var_dump($data);
        //file_put_contents("totales_emisor_abril_2019.csv", $data, FILE_APPEND | LOCK_EX);  

        if ($historico == '[]') {
            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {
            return $historico;
        }
    }

    public function excel($tipo)
    {
        if ($tipo == 'CnSubcuentas') {

            return Excel::download(new BitacoraExportSubCuentas, 'ReporteExcel.csv');
        } else if ($tipo == 'SnSubcuentas') {

            return Excel::download(new BitacoraExport, 'ReporteExcel.csv');
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Peticion incorrecta'
            ]);
        }
    }

    public function xml($ruta, $uuid, $tipo)
    {
        $iu_usuario  = session()->get('no_usuario');
        switch ($tipo) {
            case 'timbrado':
                if (isset($iu_usuario)) {

                    if ($uuid == "undefined") {
                        $uuid = "XML_sin_timbrar";
                    }
                    $path = base64_decode($ruta);
                    header('Content-Disposition: attachment; filename="' . $uuid . '.xml"');
                    header('Content-type: text/xml');
                    echo '<?xml version="1.0" encoding="UTF-8"?>' . file_get_contents($path);
                } else {
                    redirect('/');
                }
                break;
            case 'reten':
                if (isset($iu_usuario)) {

                    $hoy = date("Y-m-d", strtotime("-4 day"));
                    $fecha = $ruta; //Obitene la fecha de timbrado
                    $fechaTim = substr($ruta, 0, 4) . "_" . substr($ruta, 5, 2);
                    if ($fecha <= $hoy) {
                        $tabla = "historico_retenciones." . $fechaTim . "_ret_timbrados";
                    } else {
                        $tabla = "retenciones_envio.ret_timbrados";
                    }
                    $consulta = "SELECT xml FROM $tabla WHERE uuid = '$uuid'";
                    $respuesta = DB::connection('retenciones_envio')->select($consulta);
                    $xml = json_decode(json_encode($respuesta), true);
                    $path = $xml['0']['xml'];

                    header('Content-Disposition: attachment; filename="' . $uuid . '.xml"');
                    header('Content-type: text/xml');
                    echo '<?xml version="1.0" encoding="UTF-8"?>' . $path;
                } else {
                    redirect('/');
                }
                break;
            case "cancelado":
                if (isset($iu_usuario)) {

                    if ($uuid == "undefined") {
                        $uuid = "XML_sin_timbrar";
                    }
                    $path = base64_decode($ruta);
                    header('Content-Disposition: attachment; filename="' . $uuid . '.xml"');
                    header('Content-type: text/xml');
                    echo '<?xml version="1.0" encoding="UTF-8"?>' . file_get_contents($path);
                } else {
                    redirect('/');
                }
                break;


            default:
                return response()->json([
                    'Error' => '400',
                    'Mensaje' => 'No se encontro la petición'
                ]);
                break;
        }
    }
}
