<?php

namespace App\Exports;

use App\d_usuario;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
//use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;



class BovedaExport implements FromView
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
        $hoy = date("Y-m-d", strtotime("-4 day"));

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
        $resultado = array_unique($tablat);

        foreach ($resultado as $tabla) {
            try {
                $total = DB::table($tabla)->select('rfc_emisor', 'rfc_receptor', 'uuid', 'fechah_timbrado', 'monto', 'serie', 'folio', 'fechaCancelacion', 'estatusCancelacion')
                    ->where('iu_usuario', $iu_usuario)
                    ->whereBetween('fechah_timbrado',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                    ->orderby('fechah_timbrado')
                    ->get();
            } catch (\Illuminate\Database\QueryException $e) {

                return view('boveda');
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
                    'fechaCancelacion' => $key->fechaCancelacion,
                    'estatusCancelacion' => $key->estatusCancelacion
                );
            }
        }
        //Este return llena la hoja de excel desde la vista  /resources/view/boveda.blade        
        return view('boveda', [
            'cfdis' => $boveda
        ]);
    }
}
