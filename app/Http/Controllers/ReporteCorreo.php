<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\d_usuario;
use App\reportes_timbradores;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;

class ReporteCorreo extends Controller
{

    public function obtenerConfig()
    {
        $iu_usuario = session()->get('no_usuario');
        $consulta = DB::table('reportes_timbradores')->select('*')
            ->where('id', '=', $iu_usuario)
            ->get();

        if ($consulta->isNotEmpty()) {
            return 0;
        } else {
            return 1;
        }
    }
    public function obtenerCorreos()
    {
        $iu_usuario = session()->get('no_usuario');
        $consulta = DB::table('reportes_timbradores')->select('*')
            ->where('id', '=', $iu_usuario)
            ->get();

        if ($consulta->isNotEmpty()) {
            $replace = json_decode(json_encode($consulta), true);

            $dobleVer    = $replace[0]['doble_verificacion'];
            $timbradoDia = $replace[0]['timbrado_diarioC'];
            $codigosResp = $replace[0]['codigos_respuesta'];
            $correos     = $replace[0]['correo'];

            return response()->json([
                'doble_verificacion' => $dobleVer,
                'timbrado_diarioC' => $timbradoDia,
                'codigos_respuesta' => $codigosResp,
                'correo' => $correos
            ]);
        } else {
            return response()->json([
                'Error' => "500",
                'Mensaje' => "no se econtraron registros"
            ]);
        }
    }

    public function reportes_timbradores(Request $request)
    {

        $rfc = $request->user;
        $pw = $request->password;
        $credentials = [
            'usuario'    => $rfc,
            'contrasena' => $pw
        ];
        //Valida las credenciales
        if (Auth::attempt($credentials)) {

            $padre = Auth::user();
            $id  = $padre['iu_usuario'];

            $dobleVer  = $request->dobleVerificacion;
            $timbradoDia = $request->timbrado_diarioC;
            $codigosResp = $request->codigos_respuesta;
            $correos = $request->correo;


            /*$correo = new reportes_timbradores;
            $correo->id = $id;
            $correo->usuario = $rfc;
            $correo->fechah_registro = NOW();
            $correo->doble_verificacion = $dobleVer;
            $correo->timbrado_diarioC = $timbradoDia;
            $correo->codigos_respuesta = $codigosResp;
            $correo->fecha_modificacion = NOW();
            $correo->correo = $correos;*/

            $register = DB::table('reportes_timbradores')->insert([
                [
                    'id' => $id,
                    'usuario' => $rfc,
                    'fechah_registro' => NOW(),
                    'doble_verificacion' => $dobleVer,
                    'timbrado_diarioC' => $timbradoDia,
                    'codigos_respuesta' => $codigosResp,
                    'fecha_modificacion' => NOW(),
                    'correo' => $correos,
                ],
            ]);


            if (!$register) {
                return response()->json([
                    'Codigo' => '500',
                    'Mensaje' => 'Error al guardar usuario'
                ]);
            }
            //$correo->save(); //Guarda el usuario
            return response()->json([
                'Codigo'  => '200',
                'Mensaje' => 'Usuario agregado correctamente',
                'Usuario' => $rfc,
            ]);
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }
    public function modificarEnvio(Request $request)
    {
        $id = $request->user;
        $pw = $request->password;
        $dobleVer  = $request->dobleVerificacion;
        $timbradoDia = $request->timbrado_diarioC;
        $codigosResp = $request->codigos_respuesta;
        $correos = $request->correo;

        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];
        if (Auth::attempt($credentials)) {

            $padre = Auth::user();
            $iu_usuario = $padre['iu_usuario']; //Cuenta padre

            DB::table('reportes_timbradores')->select('*')
                ->where('id', '=', $iu_usuario)
                ->update(
                    [
                        'doble_verificacion' => $dobleVer,
                        'timbrado_diarioC'   => $timbradoDia,
                        'codigos_respuesta'  => $codigosResp,
                        'correo'             => $correos
                    ]
                );
            return response()->json([
                'Codigo' => '200',
                'Mensaje' => 'Reportes configurados correctamente'
            ]);
        } else {
            return response()->json([
                'Codigo' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }
}
