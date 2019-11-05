<table>
    <thead>
        <tr>
            <th>Uuid</th>
            <th>RFC Emisor</th>
            <th>RFC Receptor</th>
            <th>Fecha</th>
            <th>Respuesta</th>
            <th>Codigo</th>
        </tr>
    </thead>
    <tbody>
        @foreach($cfdis as $cfdi)
        <tr>
            <td>{{ $cfdi['uuid'] }}</td>
            <td>{{ $cfdi['rfc_emisor'] }}</td>
            <td>{{ $cfdi['rfc_receptor'] }}</td>
            <td>{{ $cfdi['fechah'] }}</td>
            <td>{{ $cfdi['respuesta'] }}</td>
            <td>{{ $cfdi['codigo'] }}</td>
        </tr>
        @endforeach
    </tbody>
</table>