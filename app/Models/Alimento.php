<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alimento extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'categoria',
        'calorias',
        'proteinas',
        'carboidratos',
        'gorduras',
        'fibras',
        'calcio',
        'ferro',
        'restricoes',
        'fonte',
    ];

    protected $casts = [
        'restricoes' => 'array',
        'calorias' => 'decimal:2',
        'proteinas' => 'decimal:2',
        'carboidratos' => 'decimal:2',
        'gorduras' => 'decimal:2',
        'fibras' => 'decimal:2',
        'calcio' => 'decimal:2',
        'ferro' => 'decimal:2',
    ];

    public function hasRestricoes()
    {
        return !empty($this->restricoes);
    }
}
