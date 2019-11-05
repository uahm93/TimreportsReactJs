<?php

namespace App\Http\Middleware;
use Auth;

use Closure;

class Super
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
         
        $super = session()->get('key');
        $quetzalcoatl = $super['usuario'];
        if($quetzalcoatl != 'quetzalcoatl'){
            \Session::flash('message', '<div class="alert alert-danger alert-dismissible fade show" role="alert"><center><b>¡¡Acceso restringido!!</b></center><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');     
            return redirect('/');
        }
        return $next($request);
    }
}
