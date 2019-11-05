<?php

namespace App\Exports;


use App\d_timbrado;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class BovedaExportSubCuentasRet implements FromView
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

        $datosSession = session()->get('BovedaExcelRet');


        $boveda      = [];

        $hoy = date("Y-m-d", strtotime("-4 day"));

        $fechaI = $datosSession['fechainicio_boveda'];
        $horaI  = $datosSession['horaInicio_boveda'] . ':00';

        $fechaF = $datosSession['fechafin_boveda'];
        $horaF  = $datosSession['horaFin_boveda'] . ':00';


        foreach ($data as $usuario) {

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
            $resultado = array_unique($tablat);

            foreach ($resultado as $tabla) {

                $total = DB::table($tabla)->select('rfc_emisor', 'rfc_receptor', 'uuid', 'fechah_timbrado', 'total', 'serie', 'folio', 'xml', 'fechah_emision')
                    ->where('iu_usuario', $iu_usuario)
                    ->whereBetween('fechah_timbrado',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                    ->orderby('fechah_timbrado')
                    ->get();
                foreach ($total as $key) {

                    $boveda[] = array(
                        'rfc_emisor'    => $key->rfc_emisor,
                        'rfc_receptor' => $key->rfc_receptor,
                        'uuid'         => $key->uuid,
                        'fechah_timbrado' => $key->fechah_timbrado,
                        'monto' => number_format($key->total, 2),
                        'serie' => $key->serie,
                        'folio' => $key->folio,
                        'fechah_emision' => $key->fechah_emision,
                    );
                }
            }
        }

        //Este return llena la hoja de excel desde la vista  /resources/view/boveda.blade        
        return view('boveda', [
            'cfdis' => $boveda
        ]);
    }
}
