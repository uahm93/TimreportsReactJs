<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class reportes_timbradores extends Authenticatable
{
    protected $table = 'reportes_timbradores';
    protected $fillable = ['id', 'usuario', 'fechah_registro', 'doble_verificacion', 'timbrado_diarioC', 'codigos_respuesta', 'fecha_modificacion', 'correo'];
}
