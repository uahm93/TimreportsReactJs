<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::resource('usuarios', 'AdminUController');

Route::PUT('AsignarTimbres/', [
    'uses' => 'AdminUController@asignarTimbres',
    'as'   => 'AsignarTimbres'
]);

Route::PUT('RestarTimbres/', [
    'uses' => 'AdminUController@restarTimbres',
    'as'   => 'RestarTimbres'
]);

Route::PUT('ReestablecerPW/', [
    'uses' => 'AdminUController@reestablecerPw',
    'as'   => 'ReestablecerPW'
]);

Route::PUT('BloquearUser/', [
    'uses' => 'AdminUController@bloquearsub',
    'as'   => 'BloquearUser'
]);

Route::GET('Hijos/usuario={usuario}/pw={pw}/subcuenta={sub}', [
    'uses' => 'AdminUController@hijos',
    'as'   => 'Hijos'
]);


Route::POST('Nuevo/', [
    'uses' => 'AdminUController@nuevo',
    'as'   => 'Nuevo'
]);

Route::POST('reportes_timbradores/', [
    'uses' => 'ReporteCorreo@reportes_timbradores',
    'as'   => 'reportes_timbradores'
]);

Route::PUT('ModificarEnvio/', [
    'uses' => 'ReporteCorreo@modificarEnvio',
    'as'   => 'ModificarEnvio'
]);

Route::POST('/cancelacion',  [
    'uses' => 'CancelacionController@obtenerTotal',
    'as'   => 'cancelacion'
]);
