<?php

namespace App\Http\Middleware;
use Auth;

use Closure;

class Clientes
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
         

        if(!session()->get('key')){
            \Session::flash('message', '<div class="alert alert-danger alert-dismissible fade show" role="alert">Inicia sesión para acceder a esa ruta<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');     
            return redirect('/');
        }
        return $next($request);
    }
}
