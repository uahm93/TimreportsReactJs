<table>
    <thead>
        <tr>
            <th>RFC Emisor</th>
            <th>RFC Receptor</th>
            <th>Uuid</th>
            <th>Monto</th>
            <th>serie</th>
            <th>Fecha Timbrado</th>
            <th>Fecha Emision</th>
        </tr>
    </thead>
    <tbody>
        @foreach($cfdis as $cfdi)
        <tr>

            <td>{{ $cfdi['rfc_emisor'] }}</td>
            <td>{{ $cfdi['rfc_receptor'] }}</td>
            <td>{{ $cfdi['uuid'] }}</td>
            <td>{{ $cfdi['monto'] }}</td>
            <td>{{ $cfdi['serie'] }}</td>
            <td>{{ $cfdi['fechah_timbrado'] }}</td>
            <td>{{ $cfdi['fechah_emision'] }}</td>

        </tr>
        @endforeach
    </tbody>
</table>