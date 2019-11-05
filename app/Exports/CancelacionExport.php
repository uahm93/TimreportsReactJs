<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class CancelacionExport implements FromView
{
    public function __construct($fechaI,  $horaI,  $fechaF, $horaF)
    {
        $this->fechaI = $fechaI;
        $this->horaI = $horaI;
        $this->fechaF = $fechaF;
        $this->horaF = $horaF;
    }

    public function view(): View
    {
        $fechaI = $this->fechaI;
        $horaI = $this->horaI;
        $fechaF = $this->fechaF;
        $horaF = $this->horaF;

        $iu_usuario  = session()->get('no_usuario');
        $cancelados = [];
        $consulta = "SELECT * FROM r_cfdi 
                          WHERE estatusCancelacion = 'Cancelado' AND
                             iu_usuario = '$iu_usuario' AND
                              fechaCancelacion
                                 BETWEEN '$fechaI $horaI' AND '$fechaF $horaF' ";

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
                'estatusCancelacion' => $key->estatusCancelacion,
                'fechaCancelacion' => $key->fechaCancelacion,
            );
        }


        //Este return llena la hoja de excel desde la vista  /resources/view/boveda.blade        
        return view('cancelacion', [
            'cfdis' => $cancelados
        ]);
    }
}
