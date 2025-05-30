<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Turma;
use App\Models\Alimento;
use App\Models\Estoque;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Criar usuários
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@escola.com',
            'password' => Hash::make('123456'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Nutricionista',
            'email' => 'nutricionista@escola.com',
            'password' => Hash::make('123456'),
            'role' => 'nutricionista',
        ]);

        // Criar turmas
        $turmas = [
            ['nome' => 'Creche I', 'faixa_etaria' => '0-2 anos', 'total_alunos' => 25],
            ['nome' => 'Creche II', 'faixa_etaria' => '2-3 anos', 'total_alunos' => 30],
            ['nome' => 'Pré I', 'faixa_etaria' => '4 anos', 'total_alunos' => 28],
            ['nome' => 'Pré II', 'faixa_etaria' => '5 anos', 'total_alunos' => 32],
            ['nome' => '1º Ano', 'faixa_etaria' => '6 anos', 'total_alunos' => 35],
            ['nome' => '2º Ano', 'faixa_etaria' => '7 anos', 'total_alunos' => 33],
            ['nome' => '3º Ano', 'faixa_etaria' => '8 anos', 'total_alunos' => 31],
            ['nome' => '4º Ano', 'faixa_etaria' => '9 anos', 'total_alunos' => 29],
            ['nome' => '5º Ano', 'faixa_etaria' => '10 anos', 'total_alunos' => 27],
        ];

        foreach ($turmas as $turma) {
            Turma::create($turma);
        }

        // Criar alimentos baseados na TACO
        $alimentos = [
            [
                'nome' => 'Arroz Branco Cozido',
                'categoria' => 'Cereais',
                'calorias' => 128,
                'proteinas' => 2.5,
                'carboidratos' => 28.1,
                'gorduras' => 0.1,
                'fibras' => 1.6,
                'calcio' => 4,
                'ferro' => 0.3,
                'restricoes' => null,
            ],
            [
                'nome' => 'Feijão Preto Cozido',
                'categoria' => 'Leguminosas',
                'calorias' => 77,
                'proteinas' => 4.5,
                'carboidratos' => 14.0,
                'gorduras' => 0.5,
                'fibras' => 8.4,
                'calcio' => 29,
                'ferro' => 1.5,
                'restricoes' => null,
            ],
            [
                'nome' => 'Frango Peito Grelhado',
                'categoria' => 'Carnes',
                'calorias' => 165,
                'proteinas' => 31.0,
                'carboidratos' => 0,
                'gorduras' => 3.6,
                'fibras' => 0,
                'calcio' => 14,
                'ferro' => 0.9,
                'restricoes' => null,
            ],
        ];

        foreach ($alimentos as $alimento) {
            Alimento::create($alimento);
        }

        // Criar itens de estoque
        $estoqueItens = [
            [
                'nome' => 'Arroz Branco',
                'categoria' => 'Cereais',
                'quantidade' => 150,
                'unidade' => 'kg',
                'estoque_minimo' => 50,
                'estoque_maximo' => 200,
                'valor_unitario' => 4.50,
                'data_vencimento' => '2024-12-15',
                'fornecedor' => 'Distribuidora ABC',
                'status' => 'Normal',
            ],
            [
                'nome' => 'Feijão Preto',
                'categoria' => 'Leguminosas',
                'quantidade' => 25,
                'unidade' => 'kg',
                'estoque_minimo' => 30,
                'estoque_maximo' => 100,
                'valor_unitario' => 6.80,
                'data_vencimento' => '2024-11-20',
                'fornecedor' => 'Grãos & Cia',
                'status' => 'Baixo',
            ],
        ];

        foreach ($estoqueItens as $item) {
            Estoque::create($item);
        }
    }
}
