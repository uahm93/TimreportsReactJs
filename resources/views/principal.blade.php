<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
    <link rel="shortcut icon" href="https://expidetufactura.com.mx/XPD/img/favicon.ico" />
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Expires" content="0">

    <meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>


    <title>TimReports ADMINISTRADOR</title>

    <!-- Fonts -->
    <link rel="shortcut icon" href="https://expidetufactura.com.mx/XPD/img/favicon.ico" />
    <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Tangerine">
    <style>
        .titl {
            font-family: 'Tangerine', serif;
            font-size: 30px;
            text-shadow: 4px 4px 4px #aaa;
            color: #a2832f
        }

        .footer {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            text-align: center;
            background-color: #EAEDED;
        }
    </style>

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body>
    <div class="container" id="app">
        <Vista></Vista>
    </div>
    <script src="{{ asset('js/app.js') }}"></script>

</body>

</html>