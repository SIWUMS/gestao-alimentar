<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turma extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'faixa_etaria',
        'total_alunos',
    ];

    public function consumos()
    {
        return $this->hasMany(Consumo::class);
    }

    public function getMediaPresenca()
    {
        return $this->consumos()
            ->where('data', '>=', now()->subDays(30))
            ->avg('alunos_presentes') ?? 0;
    }

    public function getTaxaAdesao()
    {
        $consumos = $this->consumos()
            ->where('data', '>=', now()->subDays(7))
            ->get();

        if ($consumos->isEmpty()) {
            return 0;
        }

        $totalPresentes = $consumos->sum('alunos_presentes');
        $totalServidas = $consumos->sum('refeicoes_servidas');

        return $totalPresentes > 0 ? ($totalServidas / $totalPresentes) * 100 : 0;
    }
}
