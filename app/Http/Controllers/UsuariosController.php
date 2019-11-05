<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsuariosController extends Controller
{

    public function index()
    {

        $data  = session()->get('key');
        session()->put('user', $data['usuario']);
        session()->put('pw', $data['contrasena']);
        session()->put('no_usuario', $data['iu_usuario']);


        if (session()->has('key')) {

            $nivel      = $data['nivel'];
            $iu_usuario = $data['iu_usuario'];
            $alta_por   = $data['alta_por'];
            $raiz       = $data['raiz'];
            if ($alta_por == '10' && ($raiz == '0' && $nivel == '0')) {
                DB::table('d_usuario')->select('*')
                    ->where('iu_usuario', '=', $iu_usuario)
                    ->update([
                        'nivel' => '1',
                        'raiz' => $iu_usuario
                    ]);
                return view('principal');
            } else {

                if (($alta_por != '10' && $alta_por != '6') && $raiz == '0') {
                    //Son subcuentas nivel 2
                    DB::table('d_usuario')->select('*')
                        ->where('iu_usuario', '=', $iu_usuario)
                        ->update([
                            'nivel' => '2',
                            'raiz' => $alta_por
                        ]);
                    return view('principal');
                }

                $consulta = DB::table('d_usuario')->select('nivelMax')
                    ->where('iu_usuario', '=', $raiz)
                    ->get();

                if ($consulta->isEmpty()) {

                    session()->flush();
                    \Session::flash('message', '<div class="alert alert-warning alert-dismissible fade show" role="alert">Error 403<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                    return redirect('/');
                }
                $nivelMax = $consulta[0]->nivelMax;

                DB::table('d_usuario')->select('*')
                    ->where('iu_usuario', '=', $iu_usuario)
                    ->update(['nivelMax' => $nivelMax]);

                return view('principal');
            }
        } else {

            return redirect('/');
        }
    }
    public function obtenerUsuario()
    {
        $iu_usuario = session()->get('no_usuario');
        $padre = DB::table('d_usuario')->select('*')
            ->where([
                ['iu_usuario', '=', $iu_usuario]
            ])
            ->get();
        return response()->json([
            'usuario' => $padre[0]->usuario,
            'contrasena' => $padre[0]->contrasena,
            'postpago' => $padre[0]->postpago,
            'nivel' => $padre[0]->nivel,
            'nivelMax' => $padre[0]->nivelMax,
            'timbresDispo' => number_format($padre[0]->timbra_disponible)
        ]);
    }
    public function superuser()
    {

        if (session()->has('key')) {

            return view('superUser');
        } else {

            return redirect('/');
        }
    }

    public function accesoTotal(Request $request)
    {
        $usuario = $request['usuario'];
        session()->put('no_usuario', $usuario);
        return view('principal');
    }
}
