<?php

namespace App\Providers;


use Illuminate\Auth\EloquentUserProvider as UserProvider;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;


class MyuserProvider extends UserProvider
{
    public function validateCredentials(UserContract $user, array $credentials)
    {
        $plain = $credentials['contrasena'];  // will depend on the name of the input on the login form
        return ($plain ==  $user->getAuthKey());
    }
}
