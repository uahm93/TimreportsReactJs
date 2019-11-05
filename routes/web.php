<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});

Route::post('principal', [
    'uses' => 'LoginController@login',
    'as'   => 'login'
]);

Route::get('logout', [
    'uses' => 'LoginController@salir',
    'as'   => 'salir'
]);

Route::group(['middleware' => ['cliente']], function () {

    //Historicos Inicio
    Route::resource('/historicos', 'HistoricosController');

    Route::get('totales/', [
        'uses' => 'HistoricosController@totales',
        'as'   => 'totales'
    ]);

    Route::get('t_ayer/', [
        'uses' => 'HistoricosController@t_ayer',
        'as'   => 't_ayer'
    ]);

    Route::get('t_hoy/', [
        'uses' => 'HistoricosController@t_hoy',
        'as'   => 't_hoy'
    ]);

    Route::get('pendientes_hoy/', [
        'uses' => 'HistoricosController@pendientes_hoy',
        'as'   => 'pendientes_hoy'
    ]);

    Route::get('grafica/', [
        'uses' => 'HistoricosController@grafica',
        'as'   => 'grafica'
    ]);

    Route::get('totales_complementos/', [
        'uses' => 'HistoricosController@totales_complementos',
        'as'   => 'totales_complementos'
    ]);

    Route::get('promedio_historico/', [
        'uses' => 'HistoricosController@promedio_historico',
        'as'   => 'promedio_historico'
    ]);
    Route::get('graficaCancelacion/', [
        'uses' => 'HistoricosController@graficaCancelacion',
        'as'   => 'graficaCancelacion'
    ]);
    //Historicos Fin

    Route::get('ObtenerUsuario', [
        'uses' => 'UsuariosController@obtenerUsuario',
        'as'   => 'ObtenerUsuario'
    ]);

    Route::get('ObtenerConfigCorreo/', [
        'uses' => 'ReporteCorreo@obtenerConfig',
        'as'   => 'ObtenerConfigCorreo'
    ]);

    Route::get('obtenerCorreos/', [
        'uses' => 'ReporteCorreo@obtenerCorreos',
        'as'   => 'obtenerCorreos'
    ]);

    //Inicio reportes

    Route::get('/emisores',  [
        'uses' => 'ReportesController@emisores',
        'as'   => 'emisores'
    ]);

    //Fin reportes

    //Inicio Bitacora
    Route::get('/bitacora', [
        'uses' => 'BitacoraController@index',
        'as'   => 'vista_bitacora'
    ]);

    Route::get('/FiltroBitacora/{estado}',  [
        'uses' => 'BitacoraController@bitacora',
        'as'   => 'bitacora'
    ]);

    Route::get('/subCuentasBita/{estado}',  [
        'uses' => 'BitacoraController@subCuentasBita',
        'as'   => 'subCuentasBita'
    ]);

    Route::get('/excel/{tipo}',  [
        'uses' => 'BitacoraController@excel',
        'as'   => 'excel'
    ]);

    Route::get('/xml/{ruta}/{uuid}/{tipo}',  [
        'uses' => 'BitacoraController@xml',
        'as'   => 'xml'
    ]);
    //Fin Bitacora

    //Inicio Boveda
    Route::get('/boveda/{fechainicio}/{horaInicio}/{fechafin}/{horaFin}/{estado}',  [
        'uses' => 'BovedaController@boveda',
        'as'   => 'boveda'
    ]);

    Route::get('/bovedaSubcuentas/{fechainicio}/{horaInicio}/{fechafin}/{horaFin}/{estado}',  [
        'uses' => 'BovedaController@bovedaSubcuentas',
        'as'   => 'bovedaSubcuentas'
    ]);

    Route::get('/bovedaSubcuentasRetenciones/{fechainicio}/{horaInicio}/{fechafin}/{horaFin}/{estado}',  [
        'uses' => 'BovedaController@subcuentasRetenciones',
        'as'   => 'bovedaSubcuentasRetenciones'
    ]);

    Route::get('/bovedaRetenciones/{fechainicio}/{horaInicio}/{fechafin}/{horaFin}/{estado}',  [
        'uses' => 'BovedaController@bovedaRetenciones',
        'as'   => 'bovedaRetenciones'
    ]);

    Route::get('/excelBoveda/{tipo}',  [
        'uses' => 'BovedaController@excelBoveda',
        'as'   => 'excelBoveda'
    ]);

    Route::get('/excelBovedaRetenciones/{tipo}',  [
        'uses' => 'BovedaController@excelBovedaRetenciones',
        'as'   => 'excelBovedaRetenciones'
    ]);

    Route::get('/zipBoveda/{tipo}',  [
        'uses' => 'BovedaController@zipBoveda',
        'as'   => 'zipBoveda'
    ]);

    Route::get('/descargarPDF/{ruta}/{uuid}/{plantilla}/{fecha}',  [
        'uses' => 'BovedaController@descargarPDF',
        'as'   => 'descargarPDF'
    ]);
    //Fin Boveda


    //Inicio LCO
    Route::get('/lco/{rfc}/{certificado}/{estado}',  [
        'uses' => 'LcoController@lco',
        'as'   => 'lco'
    ]);

    Route::get('/excelLco',  [
        'uses' => 'LcoController@excelLco',
        'as'   => 'excelLco'
    ]);

    Route::get('/Inscritos/{rfc}/',  [
        'uses' => 'LcoController@inscritos',
        'as'   => 'Inscritos'
    ]);
    //Fin LCO

    //Inicio Reportes
    Route::get('/totalEmisor/{fechainicio}/{horaI}/{fechafin}/{horaF}/{estado}',  [
        'uses' => 'ReportesController@totalEmisor',
        'as'   => 'totalEmisor'
    ]);

    Route::get('/totalRFCEmisor/{fechainicio}/{horaI}/{fechafin}/{horaF}/{estado}',  [
        'uses' => 'ReportesController@totalRFCEmisor',
        'as'   => 'totalEmisor'
    ]);

    Route::get('/excelReportes',  [
        'uses' => 'ReportesController@excelReportes',
        'as'   => 'excelReportes'
    ]);
    //

    //Cancelacion
    /*Route::get('/cancelacion/{fechaInicio}/{fechaFin}',  [
        'uses' => 'CancelacionController@obtenerTotal',
        'as'   => 'cancelacion'
    ]);*/
    Route::get('/obtenerCancelados/{fechaI}/{horaI}/{fechaF}/{horaF}',  [
        'uses' => 'CancelacionController@obtenerCancelados',
        'as'   => 'obtenerCancelados'
    ]);

    Route::get('/excelCancelacion/{tipo}',  [
        'uses' => 'CancelacionController@excelBovedaCancelacion',
        'as'   => 'excelCancelacion'
    ]);
    //Fin Cancelacion

    Route::get('/Cancelados', 'UsuariosController@index')->name('index');
    Route::get('/AdmonSub', 'UsuariosController@index')->name('index');
    Route::get('/Reportes', 'UsuariosController@index')->name('index');
    Route::get('/Bitacora', 'UsuariosController@index')->name('index');
    Route::get('/Boveda', 'UsuariosController@index')->name('index');
    Route::get('/Lco', 'UsuariosController@index')->name('index');
    Route::get('/Inscritos', 'UsuariosController@index')->name('index');
    Route::get('/principal', 'UsuariosController@index')->name('index');
});



//Midleware SUPER USUARIO
Route::group(['middleware' => ['superUser']], function () {

    Route::get('/superuser', 'UsuariosController@superuser')->name('superuser');
    Route::post('/accesoTotal', 'UsuariosController@accesoTotal')->name('accesoTotal');
});
