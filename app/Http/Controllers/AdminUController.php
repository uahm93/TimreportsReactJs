<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\d_usuario;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;

class AdminUController extends Controller
{

    public function descontarTimbres($padre, $totalesUsado, $totalDesc)
    {

        DB::table('d_usuario')->select('*')
            ->where('iu_usuario', '=', $padre)
            ->update(
                [
                    'timbra_disponible' => $totalDesc,
                    'timbrado_total'    => $totalesUsado
                ]
            );
    }

    public function verificarCuenta($hijo, $padre)
    {
        return DB::table('d_usuario')->select('*')
            ->where([
                ['usuario', '=', $hijo],
                ['alta_por', '=', $padre]
            ])
            ->get();
    }

    public function nuevo(Request $request)
    {
        $verificarSubuenta = new AdminUController;
        //Obtiene el usuario y la contraseña del request
        $id = $request->user;
        $pw = $request->password;
        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];
        //Valida las credenciales
        if (Auth::attempt($credentials)) {

            $padre = Auth::user();
            $alta_por  = $padre['iu_usuario'];
            $fecha_fin = $padre['fechah_fin'];
            $servidor  = $padre['servidor'];
            $dispoible = $padre['timbra_disponible'];
            $timbUsado = $padre['timbrado_total'];
            $raiz      = $padre['raiz'];
            $nivel     = $padre['nivel'];
            $nivelMax  = $padre['nivelMax'];

            $asignado  = $request->asignarTimbres;
            $hijo      = $request->usuario;
            if ($nivel < $nivelMax) {
                //Verifica si la nueva cuenta ya existe

                $mostrar = $verificarSubuenta->verificarCuenta($hijo, $alta_por);
                if ($mostrar->isNotEmpty()) {
                    return response()->json([
                        'Error' => '500',
                        'Mensaje' => 'Subcuenta registrada previamente'
                    ]);
                }
                //Verifica si tiene timbres disponibles
                if ($dispoible < $asignado) {

                    return response()->json([
                        'Error' => '500',
                        'Mensaje' => 'Timbres insuficientes'
                    ]);
                } else {
                    //En caso de tener timbres los descuenta
                    $totalUsado = $timbUsado + $asignado;
                    $totalDesc  = $dispoible - $asignado;

                    $verificarSubuenta->descontarTimbres($alta_por, $totalUsado, $totalDesc);
                }

                /*$usuario = new d_usuario;
                $usuario->usuario = $hijo;*/
                $nuevaContrasena = substr(md5(microtime()), 1, 12);
                $contrasenaHash  = sha1($nuevaContrasena);
                /*$usuario->contrasena = $contrasenaHash;
                $usuario->fechah_registro = NOW();
                $usuario->fechah_fin = $fecha_fin;
                $usuario->timbra_disponible = $asignado;
                $usuario->alta_por = $alta_por;
                $usuario->raiz = $raiz;
                $usuario->nivel = $nivel + 1;
                $usuario->nivelMax = $nivelMax;
                $usuario->servidor = $servidor;*/

                $usuario = DB::table('d_usuario')->insert([
                    [
                        'usuario' => $hijo,
                        'contrasena' => $contrasenaHash,
                        'fechah_registro' => NOW(),
                        'fechah_fin' => $fecha_fin,
                        'timbra_disponible' => $asignado,
                        'alta_por' => $alta_por,
                        'raiz' => $raiz,
                        'nivel' => $nivel + 1,
                        'nivelMax' => $nivelMax,
                        'servidor' => $servidor,
                        'fecha_modificacion' => NOW(),

                    ],
                ]);

                if (!$usuario) {
                    return response()->json([
                        'Codigo' => '500',
                        'Mensaje' => 'Error al guardar usuario'
                    ]);
                }
                //$usuario->save(); //Guarda el usuario
                return response()->json([
                    'Codigo'  => '200',
                    'Mensaje' => 'Usuario agregado correctamente',
                    'Usuario' => $hijo,
                    'Contrasena' => $nuevaContrasena

                ]);
            } else {
                return response()->json([
                    'Codigo' => '404',
                    'Mensaje' => 'Este usuario no puede crear cuentas'
                ]);
            }
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }

    public function asignarTimbres(Request $request)
    {
        $adminUcontroller = new AdminUController;
        $id = $request->user;
        $pw = $request->password;
        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];
        if (Auth::attempt($credentials)) {

            $padre = Auth::user();
            $alta_por = $padre['iu_usuario']; //Cuenta padre
            $hijo = $request->usuario;
            $asignados = $request->asignarTimbres;
            $disponible = $padre['timbra_disponible'];
            $timbresActuales = $padre['timbrado_total'];

            if ($disponible < $asignados) {

                return response()->json([
                    'Error' => '500',
                    'Mensaje' => 'Timbres insuficientes'
                ]);
            }

            $verifica = $adminUcontroller->verificarCuenta($hijo, $alta_por);

            if ($verifica->isNotEmpty()) {

                //Ini--Obtiene timbres actuales del hijo
                $mostrar          = $adminUcontroller->verificarCuenta($hijo, $alta_por);
                $timA             = json_decode(json_encode($mostrar), true);
                $timbresActuaHijo = $timA[0]['timbra_disponible'];
                $idHijo           = $timA[0]['iu_usuario'];
                //--Fin

                //--Ini operaciones para restar y asignar timbres
                $disponiblesPadre = $disponible - $asignados;
                $totalesPadre     = $timbresActuales + $asignados;
                $disponibleshijo  = $timbresActuaHijo + $asignados;
                $totalDescHijo    = 0;

                $adminUcontroller->descontarTimbres($alta_por, $totalesPadre, $disponiblesPadre); //Se descuentan timbres al padre
                $adminUcontroller->descontarTimbres($idHijo, $totalDescHijo, $disponibleshijo);   //Se agregan timbres al hijo

                return response()->json([
                    'Codigo' => '200',
                    'Mensaje' => 'Timbres actualizados correctamente'
                ]);
            } else {
                return response()->json([
                    'Codigo' => '500',
                    'Mensaje' => 'El usuario ' . $hijo . ' no corresponde a la cuenta padre'
                ]);
            }
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }

    public function restarTimbres(Request $request)
    {
        $adminUcontroller = new AdminUController;
        $id = $request->user;
        $pw = $request->password;
        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];
        if (Auth::attempt($credentials)) {

            $padre = Auth::user();
            $alta_por = $padre['iu_usuario']; //Cuenta padre
            $hijo = $request->usuario;
            $asignados = $request->restarTimbres;
            $disponible = $padre['timbra_disponible'];
            $timbresActuales = $padre['timbrado_total'];

            $verifica = $adminUcontroller->verificarCuenta($hijo, $alta_por);

            if ($verifica->isNotEmpty()) {

                //Ini--Obtiene timbres actuales del hijo
                $mostrar          = $adminUcontroller->verificarCuenta($hijo, $alta_por);
                $timA             = json_decode(json_encode($mostrar), true);
                $timbresActuaHijo = $timA[0]['timbra_disponible'];
                $idHijo           = $timA[0]['iu_usuario'];
                //--Fin
                if ($timbresActuaHijo < $asignados) {

                    return response()->json([
                        'Error' => '500',
                        'Mensaje' => 'Timbres insuficientes'
                    ]);
                }
                //operaciones para restar y asignar timbres
                $disponiblesPadre = $disponible + $asignados;
                $totalesPadre     = $timbresActuales;

                $disponibleshijo  = $timbresActuaHijo - $asignados;
                $totalDescHijo    = 0;

                $adminUcontroller->descontarTimbres($alta_por, $totalesPadre, $disponiblesPadre); //Se descuentan timbres al padre
                $adminUcontroller->descontarTimbres($idHijo, $totalDescHijo, $disponibleshijo);   //Se agregan timbres al hijo

                return response()->json([
                    'Codigo' => '200',
                    'Mensaje' => 'Timbres actualizados correctamente'
                ]);
            } else {
                return response()->json([
                    'Codigo' => '500',
                    'Mensaje' => 'El usuario ' . $hijo . ' no corresponde a la cuenta padre'
                ]);
            }
        } else {
            return response()->json([
                'Código' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }

    public function reestablecerPw(Request $request)
    {
        $DesdeLetra = "A";
        $HastaLetra = "Z";
        $letraAleatoria = chr(rand(ord($DesdeLetra), ord($HastaLetra)));
        $adminUcontroller = new AdminUController;
        $id = $request->user;
        $pw = $request->password;
        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];
        if (Auth::attempt($credentials)) {

            $padre = Auth::user();
            $alta_por = $padre['iu_usuario']; //Cuenta padre
            $hijo = $request->usuario;
            $nuevaContrasena = $letraAleatoria . substr(md5(microtime()), 1, 11);
            $contrasenaHash  = sha1($nuevaContrasena);

            $verifica = $adminUcontroller->verificarCuenta($hijo, $alta_por);

            if ($verifica->isNotEmpty()) {

                DB::table('d_usuario')->select('*')
                    ->where('usuario', '=', $hijo)
                    ->update(['contrasena' => $contrasenaHash]);

                return response()->json([
                    'Codigo' => '200',
                    'Mensaje' => 'Nueva contrasena asignada',
                    'Usuario' => $hijo,
                    'Contrasena' => $nuevaContrasena
                ]);
            } else {
                return response()->json([
                    'Codigo' => '500',
                    'Mensaje' => 'El usuario ' . $hijo . ' no corresponde a la cuenta padre'
                ]);
            }
        } else {
            return response()->json([
                'Codigo' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }

    public function hijos($id, $pw, $sub)
    {

        $subcuenta = substr($sub, 3);
        $all = substr($sub, -9, -6);

        if ($all == "sub") {
            $subcuenta = "";
        }

        //Recoje las credenciales dadas en json
        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];

        //Autentica el usuario 
        if (Auth::attempt($credentials)) {

            $usuario = Auth::user();
            //Muestra todas las subcuentas del usuario autenticado
            $cuentas = DB::table('d_usuario')->select('*')
                ->where([
                    ['alta_por', '=', $usuario['iu_usuario']],
                    ['usuario',  'LIKE', $subcuenta . '%'],
                ])
                ->orderBy('usuario')
                ->paginate(20);
            //->get();

            return $cuentas;
        } else {
            return response()->json([
                'Codigo' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }

    public function bloquearSub(Request $request)
    {
        $adminUcontroller = new AdminUController;
        $id = $request->user;
        $pw = $request->password;
        $usuario = $request->usuario;
        $estado = $request->estado;
        $credentials = [
            'usuario'    => $id,
            'contrasena' => $pw
        ];
        if (Auth::attempt($credentials)) {

            $padre = Auth::user();
            $alta_por = $padre['iu_usuario']; //Cuenta padre

            $verifica = $adminUcontroller->verificarCuenta($usuario, $alta_por);

            if ($verifica->isNotEmpty()) {

                DB::table('d_usuario')->select('*')
                    ->where('usuario', '=', $usuario)
                    ->update(['habilitado' => $estado]);

                return response()->json([
                    'Codigo'  => '200',
                    'Mensaje' => 'Usuario modificado',
                ]);
            } else {
                return response()->json([
                    'Codigo' => '500',
                    'Mensaje' => 'El usuario ' . $usuario . ' no corresponde a la cuenta padre'
                ]);
            }
        } else {
            return response()->json([
                'Codigo' => '500',
                'Mensaje' => 'Credenciales Incorrectas'
            ]);
        }
    }
}
