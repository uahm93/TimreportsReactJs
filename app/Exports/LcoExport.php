<?php

namespace App\Exports;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WhithHeadings;

class LcoExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */

    public function collection()
    {   
                
        $excelLco  = session()->get('excelLco');       
        
        return collect($excelLco);
     
    }
}
