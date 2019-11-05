<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromQuery;
use Illuminate\Contracts\Queue\ShouldQueue;
//use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;


class BitacoraExport implements FromQuery, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */

    public function query()
    {
        set_time_limit(620);
        ini_set('memory_limit', '-1');
        $rfc_emisor = session()->get('rfc_emisor_bitacora');
        $uuid       = session()->get('uuid_bitacora');
        $estado     = session()->get('estado_bitacora');
        $error      = session()->get('error_bitacora');
        $iu_usuario = session()->get('no_usuario');

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

        if ($estado == 'fallido') {

            return DB::table('d_bitacora')
                ->select('rfc_emisor', 'rfc_receptor', 'fechah', 'respuesta', 'codigo')
                ->where([
                    ['iu_usuario', $iu_usuario],
                    ['codigo',  '!=', 'EXITO'],
                ])
                ->orderby('d_bitacora.fechah');
        } else {

            return DB::table('d_timbrado')
                ->join('d_bitacora', 'd_timbrado.transaccion', '=', 'd_bitacora.transaccion')
                ->select('d_timbrado.uuid', 'd_bitacora.rfc_emisor', 'd_bitacora.rfc_receptor', 'd_bitacora.fechah', 'd_bitacora.respuesta', 'd_bitacora.respuesta', 'd_bitacora.codigo')
                ->where([
                    ['d_bitacora.iu_usuario', $iu_usuario],
                    ['d_bitacora.codigo',     'EXITO']
                ])
                ->orderby('d_bitacora.fechah');
        }
    }
    public function headings(): array
    {
        return [
            'UUID',
            'RFC Emisor',
            'RFC Receptor',
            'Fecha',
            'Respuesta',
            'Codigo'
        ];
    }
}
