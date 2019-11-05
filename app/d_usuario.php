<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class d_usuario extends Authenticatable
{
    protected $table = 'd_usuario';
    protected $fillable = ['usuario', 'contrasena', 'fechah_registro', 'fechah_fin', 'servidor', 'timbra_disponible', 'alta_por', 'nivel'];

    public function getAuthKey()
    {
        return $this->contrasena;
    }
}
