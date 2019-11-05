<?php

namespace App\Http\Controllers;


use Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;



class LoginController extends Controller
{
    //



    public function login(Request $request)
    {
        $pw  = $request->contrasena;
        $contrasena_cifrada = sha1($pw);
        $credentials = [
            'usuario'    => $request['usuario'],
            'contrasena' => $contrasena_cifrada
        ];

        if (Auth::attempt($credentials)) {

            $user    = Auth::user();

            session()->put('key', $user);


            if ($user['usuario'] == 'quetzalcoatl') {

                return redirect()->route('superuser');
            } else {
                return redirect()->route('index');
            }
        } else {
            \Session::flash('message', '<div class="alert alert-warning alert-dismissible fade show" role="alert">Usuario o contraseña incorrectos<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            return redirect('/');
        }
    }


    public function salir()
    {
        session()->flush();
        Auth::logout();
        return redirect('/');
    }
}
