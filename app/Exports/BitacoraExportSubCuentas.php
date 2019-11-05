<?php

namespace App\Exports;


use App\d_timbrado;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class BitacoraExportSubCuentas implements FromView
{
    public function view(): View
    {
        //obtiene el iu_usuario de todos los hijos de la cuenta padre
        $iu_usuario = session()->get('no_usuario');
        $usuarios = DB::table('d_usuario')->select('iu_usuario', 'usuario')
            ->where('alta_por', '=', $iu_usuario)
            ->orderby('iu_usuario')
            ->get();

        $data = json_decode(json_encode($usuarios), true);
        array_push($data, array('iu_usuario' => $iu_usuario));


        $rfc_emisor = session()->get('rfc_emisor_bitacora');
        $uuid       = session()->get('uuid_bitacora');
        $estado     = session()->get('estado_bitacora');
        $error      = session()->get('error_bitacora');
        $cfdis      = [];
        if ($rfc_emisor == "null") {
            $rfc_emisor = "";
        }
        if ($uuid       == "null") {
            $uuid = "";
        }
        if ($estado     == "null") {
            $estado = "";
        }
        if ($error      == "null") {
            $error = "";
        }

        if ($estado == "codigo") {
            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];

                $bitacora = DB::table('d_bitacora')
                    ->select('rfc_emisor', 'rfc_receptor', 'fechah', 'respuesta', 'codigo')
                    ->where([
                        ['iu_usuario', $iu_usuario],
                        ['respuesta',  'LIKE', $error . '%'],
                    ])
                    ->orderby('d_bitacora.fechah')
                    ->get();
                foreach ($bitacora as $key) {

                    $cfdis[] = array(

                        'uuid'    => 'Sin uuid asignado',
                        'rfc_emisor' => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'fechah' => $key->fechah,
                        'respuesta' => $key->respuesta,
                        'codigo' => $key->codigo,
                    );
                }
            }
        } elseif ($estado == 'fallido') {

            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];

                $bitacora = DB::table('d_bitacora')
                    ->select('rfc_emisor', 'rfc_receptor', 'fechah', 'respuesta', 'codigo')
                    ->where([
                        ['iu_usuario', $iu_usuario],
                        ['codigo',  '!=', 'EXITO'],
                    ])
                    ->orderby('d_bitacora.fechah')
                    ->get();
                foreach ($bitacora as $key) {

                    $cfdis[] = array(
                        'uuid'    => 'Sin uuid asignado',
                        'rfc_emisor' => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'fechah' => $key->fechah,
                        'respuesta' => $key->respuesta,
                        'codigo' => $key->codigo,
                    );
                }
            }
        } elseif ($estado == 'EXITO') {

            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];

                $bitacora = DB::table('d_timbrado')
                    ->join('d_bitacora', 'd_timbrado.transaccion', '=', 'd_bitacora.transaccion')
                    ->select('d_timbrado.uuid', 'd_bitacora.rfc_emisor', 'd_bitacora.rfc_receptor', 'd_bitacora.fechah', 'd_bitacora.respuesta', 'd_bitacora.codigo')
                    ->where([
                        ['d_bitacora.iu_usuario', $iu_usuario],
                        ['d_bitacora.codigo',     'EXITO']
                    ])
                    ->orderby('d_bitacora.fechah')
                    ->get();

                foreach ($bitacora as $key) {

                    $cfdis[] = array(

                        'uuid'    => $key->uuid,
                        'rfc_emisor' => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'fechah' => $key->fechah,
                        'respuesta' => $key->respuesta,
                        'codigo' => $key->codigo,
                    );
                }
            }
        } elseif ($estado == "snv") {

            foreach ($data as $usuario) {
                $iu_usuario = $usuario['iu_usuario'];

                $bitacora = DB::table('d_timbrado')
                    ->join('d_bitacora', 'd_timbrado.transaccion', '=', 'd_bitacora.transaccion')
                    ->select('d_timbrado.uuid', 'd_bitacora.rfc_emisor', 'd_bitacora.rfc_receptor', 'd_bitacora.fechah', 'd_bitacora.respuesta', 'd_bitacora.respuesta', 'd_bitacora.codigo')
                    ->where([
                        ['d_bitacora.iu_usuario', $iu_usuario],
                        ['d_timbrado.uuid',  'LIKE', $uuid . '%'],
                        ['d_timbrado.rfc_emisor',  'LIKE', $rfc_emisor . '%']
                    ])
                    ->orderby('d_bitacora.fechah')
                    ->get();
                foreach ($bitacora as $key) {

                    $cfdis[] = array(

                        'uuid'    => $key->uuid,
                        'rfc_emisor' => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'fechah' => $key->fechah,
                        'respuesta' => $key->respuesta,
                        'codigo' => $key->codigo,
                    );
                }
            }
        }
        //Este return llena la hoja de excel desde la vista  /resources/view/bitacora.blade        
        return view('bitacora', [
            'cfdis' => $cfdis
        ]);
    }
}
