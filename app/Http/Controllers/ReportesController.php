<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Excel;
use App\Exports\ReportesExport;
use App\Http\Controllers\Controller;


class ReportesController extends Controller
{


    public function emisores()
    {

        //VERIFICA SI TIENE SUBCUENTAS 
        $iu_usuario  = session()->get('no_usuario');
        $consulta    = DB::table('d_usuario')->select('usuario')
            ->where('alta_por', '=', $iu_usuario)
            ->orderby('usuario')
            ->get();
        if ($consulta == '[]') {
            return 'SnSubcuentas';
        } else {
            return 'CnSubcuentas';
        }
    }
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

    public function totalRFCEmisor($fechainicio, $horaI, $fechafin, $horaF, $estado)
    {

        set_time_limit(920);
        ini_set('memory_limit', '-1');
        session()->put('fecha_inicio_reportes', $fechainicio);
        session()->put('fecha_fin_reportes', $fechafin);
        session()->put('estado_reportes', $estado);

        $iu_usuario  = session()->get('no_usuario');
        $hoy         = date("Y-m-d", strtotime("-4 day"));

        $fechaI  = $fechainicio;
        $horaI   = $horaI . ":00";
        $fechaF  = $fechafin;
        $horaF   = $horaF . ":00";

        $totalEmisor = [];

        if ($estado == 'EXITO') {
            for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
                $aux = date("Y-m-d", strtotime($i));
                if ($aux <= $hoy) {
                    $año    = substr($i, 0, 4);
                    $mes    = substr($i, 5, 2);
                    $tablat[] = "timbrado_historico.{$año}_{$mes}_d_bitacora";
                } else {
                    $tablat[] = "tr_core_timbrado.d_bitacora";
                }
            }
            if (!isset($tablat)) {
                return view('errors.todos');
            }
            $resultado = array_unique($tablat);
            foreach ($resultado as $tabla) {

                try {
                    $total  = DB::table($tabla)->select(DB::RAW('rfc_emisor, count(*) as total'))
                        ->where([
                            ['iu_usuario', $iu_usuario],
                            ['codigo',     'EXITO']
                        ])
                        ->whereBetween('fechah',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                        ->groupBy('rfc_emisor')
                        ->get();
                } catch (\Illuminate\Database\QueryException $e) {

                    return view('errors.todos');
                }


                foreach ($total as $key) {

                    $totalEmisor[] = array(
                        'id'    => $key->rfc_emisor,
                        'total' =>  $key->total
                    );
                }
            }
            for ($i = 0; $i < count($totalEmisor); $i++) {
                for ($j = $i + 1; $j < count($totalEmisor); $j++) {
                    if ($totalEmisor[$i]['id'] == $totalEmisor[$j]['id']) {
                        $totalEmisor[$i]['total'] = $totalEmisor[$i]['total'] + $totalEmisor[$j]['total'];
                        $totalEmisor[$j]['total'] = 0;
                    }
                }
            }
            foreach ($totalEmisor as $key => $value) {
                if ($value["total"] == 0) {
                    unset($totalEmisor[$key]);
                }
            }
            session()->put('excel', $totalEmisor);
        } elseif ($estado == 'FALLIDO') {

            for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
                $aux = date("Y-m-d", strtotime($i));
                if ($aux <= $hoy) {
                    $año    = substr($i, 0, 4);
                    $mes    = substr($i, 5, 2);
                    $tablat[] = "timbrado_historico.{$año}_{$mes}_d_bitacora";
                } else {
                    $tablat[] = "tr_core_timbrado.d_bitacora";
                }
            }
            if (!isset($tablat)) {
                return view('errors.todos');
            }
            $resultado = array_unique($tablat);
            foreach ($resultado as $tabla) {
                try {
                    $total  = DB::table($tabla)->select(DB::RAW('rfc_emisor, count(*) as total'))
                        ->where([
                            ['iu_usuario', $iu_usuario],
                            ['codigo', '!=', 'EXITO']
                        ])
                        ->whereBetween('fechah',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                        ->groupBy('rfc_emisor')
                        ->get();
                } catch (\Illuminate\Database\QueryException $e) {

                    return view('errors.todos');
                }


                foreach ($total as $key) {

                    $totalEmisor[] = array(
                        'id'    => $key->rfc_emisor,
                        'total' =>  $key->total
                    );
                }
            }
            for ($i = 0; $i < count($totalEmisor); $i++) {
                for ($j = $i + 1; $j < count($totalEmisor); $j++) {
                    if ($totalEmisor[$i]['id'] == $totalEmisor[$j]['id']) {
                        $totalEmisor[$i]['total'] = $totalEmisor[$i]['total'] + $totalEmisor[$j]['total'];
                        $totalEmisor[$j]['total'] = 0;
                    }
                }
            }
            foreach ($totalEmisor as $key => $value) {
                if ($value["total"] == 0) {
                    unset($totalEmisor[$key]);
                }
            }
            session()->put('excel', $totalEmisor);
        } elseif ($estado == 'TOTAL') {

            for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
                $aux = date("Y-m-d", strtotime($i));
                if ($aux <= $hoy) {
                    $año    = substr($i, 0, 4);
                    $mes    = substr($i, 5, 2);
                    $tablat[] = "timbrado_historico.{$año}_{$mes}_d_bitacora";
                } else {
                    $tablat[] = "tr_core_timbrado.d_bitacora";
                }
            }
            if (!isset($tablat)) {
                return view('errors.todos');
            }
            $resultado = array_unique($tablat);
            foreach ($resultado as $tabla) {
                try {
                    $total  = DB::table($tabla)->select(DB::RAW('rfc_emisor, count(*) as total'))
                        ->where('iu_usuario', $iu_usuario)
                        ->whereBetween('fechah',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                        ->groupBy('rfc_emisor')
                        ->get();
                } catch (\Illuminate\Database\QueryException $e) {

                    return view('errors.todos');
                }

                foreach ($total as $key) {

                    $totalEmisor[] = array(
                        'id'    => $key->rfc_emisor,
                        'total' =>  $key->total
                    );
                }
            }

            for ($i = 0; $i < count($totalEmisor); $i++) {
                for ($j = $i + 1; $j < count($totalEmisor); $j++) {
                    if ($totalEmisor[$i]['id'] == $totalEmisor[$j]['id']) {
                        $totalEmisor[$i]['total'] = $totalEmisor[$i]['total'] + $totalEmisor[$j]['total'];
                        $totalEmisor[$j]['total'] = 0;
                    }
                }
            }
            foreach ($totalEmisor as $key => $value) {
                if ($value["total"] == 0) {
                    unset($totalEmisor[$key]);
                }
            }
            session()->put('excel', $totalEmisor);
        }

        if (!$totalEmisor) {

            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {

            //return $totalEmisor;
            foreach ($totalEmisor as $key) {
                $totalesFinal[] = array(
                    'id'    => $key["id"],
                    'total' =>  $key["total"]
                );
            }
            return $totalesFinal;
        }
    }

    public function totalEmisor($fechainicio, $horaI, $fechafin, $horaF, $estado)
    {

        $iu_padre  = session()->get('no_usuario');
        $rfc_padre = session()->get('user');

        session()->put('fecha_inicio_reportes', $fechainicio);
        session()->put('fecha_fin_reportes', $fechafin);
        session()->put('estado_reportes', $estado);

        $hoy    = date("Y-m-d", strtotime("-4 day"));
        $key    = 0;
        $fechaI  = $fechainicio;
        $horaI   = $horaI . ":00";
        $fechaF  = $fechafin;
        $horaF   = $horaF . ":00";

        $totalEmisor = [];
        $subcuentas  = [];


        $emisores = new ReportesController;
        $usuarios     = $emisores->iuUsuario();

        $data = json_decode(json_encode($usuarios), true);

        $cuenta_padre = array(
            'iu_usuario' => $iu_padre,
            'usuario'    => $rfc_padre
        );
        array_push($data, $cuenta_padre);


        if ($estado == 'EXITO') {


            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];
                $rfc        = $usuario['usuario'];

                for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
                    $aux = date("Y-m-d", strtotime($i));
                    if ($aux <= $hoy) {
                        $año    = substr($i, 0, 4);
                        $mes    = substr($i, 5, 2);
                        $tablat[] = "timbrado_historico.{$año}_{$mes}_d_bitacora";
                    } else {
                        $tablat[] = "tr_core_timbrado.d_bitacora";
                    }
                }
                if (!isset($tablat)) {
                    return view('errors.todos');
                }
                $resultado = array_unique($tablat);
                foreach ($resultado as $tabla) {

                    try {
                        $total  = DB::table($tabla)->select(DB::RAW('count(*) as total'))
                            ->where([
                                ['iu_usuario', $iu_usuario],
                                ['codigo',     'EXITO']
                            ])
                            ->whereBetween('fechah',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                            ->groupBy('rfc_emisor')
                            ->get();
                    } catch (\Illuminate\Database\QueryException $e) {

                        return view('errors.todos');
                    }

                    foreach ($total as $key) {

                        $totalEmisor[] = array(
                            'id'    => $rfc,
                            'total' => $key->total
                        );
                    }
                }
            }
            for ($i = 0; $i < count($totalEmisor); $i++) {
                for ($j = $i + 1; $j < count($totalEmisor); $j++) {
                    if ($totalEmisor[$i]['id'] == $totalEmisor[$j]['id']) {
                        $totalEmisor[$i]['total'] = $totalEmisor[$i]['total'] + $totalEmisor[$j]['total'];
                        $totalEmisor[$j]['total'] = 0;
                    }
                }
            }

            foreach ($totalEmisor as $key => $value) {
                if ($value["total"] == 0) {
                    unset($totalEmisor[$key]);
                }
            }
            session()->put('excel', $totalEmisor);
        } elseif ($estado == 'FALLIDO') {


            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];
                $rfc        = $usuario['usuario'];

                for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {
                    $aux = date("Y-m-d", strtotime($i));
                    if ($aux <= $hoy) {
                        $año    = substr($i, 0, 4);
                        $mes    = substr($i, 5, 2);
                        $tablat[] = "timbrado_historico.{$año}_{$mes}_d_bitacora";
                    } else {
                        $tablat[] = "tr_core_timbrado.d_bitacora";
                    }
                }
                if (!isset($tablat)) {
                    return view('errors.todos');
                }
                $resultado = array_unique($tablat);

                foreach ($resultado as $tabla) {
                    try {
                        $total  = DB::table($tabla)->select(DB::RAW('count(*) as total'))
                            ->where([
                                ['iu_usuario', $iu_usuario],
                                ['codigo', '!=', 'EXITO']
                            ])
                            ->whereBetween('fechah',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                            ->groupBy('rfc_emisor')
                            ->get();
                    } catch (\Illuminate\Database\QueryException $e) {

                        return view('errors.todos');
                    }

                    foreach ($total as $key) {

                        $totalEmisor[] = array(
                            'id'    => $rfc,
                            'total' => $key->total
                        );
                    }
                }
            }

            for ($i = 0; $i < count($totalEmisor); $i++) {
                for ($j = $i + 1; $j < count($totalEmisor); $j++) {
                    if ($totalEmisor[$i]['id'] == $totalEmisor[$j]['id']) {
                        $totalEmisor[$i]['total'] = $totalEmisor[$i]['total'] + $totalEmisor[$j]['total'];
                        $totalEmisor[$j]['total'] = 0;
                    }
                }
            }

            foreach ($totalEmisor as $key => $value) {
                if ($value["total"] == 0) {
                    unset($totalEmisor[$key]);
                }
            }
            session()->put('excel', $totalEmisor);
        } elseif ($estado == 'TOTAL') {



            foreach ($data as $usuario) {

                $iu_usuario = $usuario['iu_usuario'];
                $rfc        = $usuario['usuario'];

                for ($i = $fechaI; $i <= $fechaF; $i = date("Y-m-d", strtotime($i . "+ 1 day"))) {


                    $aux = date("Y-m-d", strtotime($i));

                    if ($aux <= $hoy) {
                        $año = substr($aux, 0, 4);
                        $mes = substr($aux, 5, 2);
                        $tablat[] = "timbrado_historico.{$año}_{$mes}_d_bitacora";
                    } else {
                        $tablat[] = "tr_core_timbrado.d_bitacora";
                    }
                }
                if (!isset($tablat)) {
                    return view('errors.todos');
                }
                $resultado = array_unique($tablat);

                foreach ($resultado as $tabla) {
                    try {
                        $total  = DB::table($tabla)->select(DB::RAW('count(*) as total'))
                            ->where('iu_usuario', $iu_usuario)
                            ->whereBetween('fechah',  ['' . $fechaI . ' ' . $horaI . '', '' . $fechaF . ' ' . $horaF . ''])
                            ->groupBy('rfc_emisor')
                            ->get();
                    } catch (\Illuminate\Database\QueryException $e) {

                        return view('errors.todos');
                    }

                    foreach ($total as $key) {

                        $totalEmisor[] = array(
                            'id'    => $rfc,
                            'total' => $key->total
                        );
                    }
                }
            }
            for ($i = 0; $i < count($totalEmisor); $i++) {
                for ($j = $i + 1; $j < count($totalEmisor); $j++) {
                    if ($totalEmisor[$i]['id'] == $totalEmisor[$j]['id']) {
                        $totalEmisor[$i]['total'] = $totalEmisor[$i]['total'] + $totalEmisor[$j]['total'];
                        $totalEmisor[$j]['total'] = 0;
                    }
                }
            }

            foreach ($totalEmisor as $key => $value) {
                if ($value["total"] == 0) {
                    unset($totalEmisor[$key]);
                }
            }
            session()->put('excel', $totalEmisor);
        }




        if (!$totalEmisor) {

            return response()->json([
                'Respuesta' => 'Vacio',
            ]);
        } else {

            //return $totalEmisor;
            foreach ($totalEmisor as $key) {
                $totalesFinal[] = array(
                    'id'    => $key["id"],
                    'total' =>  $key["total"]
                );
            }
            return $totalesFinal;
        }
    }

    public function excelReportes()
    {

        set_time_limit(660);
        ini_set('memory_limit', '-1');

        return Excel::download(new ReportesExport, 'ReportesExport.csv');
    }
}
