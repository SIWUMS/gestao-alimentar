<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estoque extends Model
{
    use HasFactory;

    protected $table = 'estoque';

    protected $fillable = [
        'nome',
        'categoria',
        'quantidade',
        'unidade',
        'estoque_minimo',
        'estoque_maximo',
        'valor_unitario',
        'data_vencimento',
        'fornecedor',
        'status',
    ];

    protected $casts = [
        'quantidade' => 'decimal:2',
        'estoque_minimo' => 'decimal:2',
        'estoque_maximo' => 'decimal:2',
        'valor_unitario' => 'decimal:2',
        'data_vencimento' => 'date',
    ];

    public function updateStatus()
    {
        if ($this->quantidade <= $this->estoque_minimo * 0.5) {
            $this->status = 'Crítico';
        } elseif ($this->quantidade <= $this->estoque_minimo) {
            $this->status = 'Baixo';
        } else {
            $this->status = 'Normal';
        }
        $this->save();
    }

    public function getProgressPercentage()
    {
        return ($this->quantidade / $this->estoque_maximo) * 100;
    }
}
