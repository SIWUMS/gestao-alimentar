<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consumo extends Model
{
    use HasFactory;

    protected $table = 'consumo';

    protected $fillable = [
        'data',
        'turma_id',
        'alunos_presentes',
        'refeicoes_servidas',
        'cardapio',
        'observacoes',
        'user_id',
    ];

    protected $casts = [
        'data' => 'date',
    ];

    public function turma()
    {
        return $this->belongsTo(Turma::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTaxaAdesao()
    {
        return $this->alunos_presentes > 0 
            ? ($this->refeicoes_servidas / $this->alunos_presentes) * 100 
            : 0;
    }
}
