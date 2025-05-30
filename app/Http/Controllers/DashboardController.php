<?php

namespace App\Http\Controllers;

use App\Models\Consumo;
use App\Models\Estoque;
use App\Models\Turma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Estatísticas gerais
        $refeicoesHoje = Consumo::whereDate('data', today())->sum('refeicoes_servidas');
        $itensEstoque = Estoque::count();
        $estoqueAlerta = Estoque::whereIn('status', ['Baixo', 'Crítico'])->count();
        $custoMensal = 16500; // Valor exemplo - calcular baseado nos dados reais

        // Dados para gráficos
        $consumoSemanal = $this->getConsumoSemanal();
        $estoqueStatus = $this->getEstoqueStatus();
        $custoMensal = $this->getCustoMensal();
        $alertas = $this->getAlertas();

        return view('dashboard.index', compact(
            'refeicoesHoje',
            'itensEstoque',
            'estoqueAlerta',
            'custoMensal',
            'consumoSemanal',
            'estoqueStatus',
            'alertas'
        ));
    }

    private function getConsumoSemanal()
    {
        $dados = [];
        for ($i = 6; $i >= 0; $i--) {
            $data = now()->subDays($i);
            $consumos = Consumo::whereDate('data', $data)
                ->join('turmas', 'consumo.turma_id', '=', 'turmas.id')
                ->select(
                    DB::raw('SUM(CASE WHEN turmas.faixa_etaria LIKE "%0-3%" THEN refeicoes_servidas ELSE 0 END) as creche'),
                    DB::raw('SUM(CASE WHEN turmas.faixa_etaria NOT LIKE "%0-3%" THEN refeicoes_servidas ELSE 0 END) as fundamental')
                )
                ->first();

            $dados[] = [
                'dia' => $data->format('D'),
                'creche' => $consumos->creche ?? 0,
                'fundamental' => $consumos->fundamental ?? 0
            ];
        }
        return $dados;
    }

    private function getEstoqueStatus()
    {
        return Estoque::select('nome', 'quantidade', 'estoque_maximo', 'status')
            ->orderBy('status', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->nome,
                    'value' => ($item->quantidade / $item->estoque_maximo) * 100,
                    'status' => $item->status
                ];
            });
    }

    private function getCustoMensal()
    {
        // Dados exemplo - implementar cálculo real baseado nos custos
        return [
            ['mes' => 'Jan', 'custo' => 15000],
            ['mes' => 'Fev', 'custo' => 16200],
            ['mes' => 'Mar', 'custo' => 15800],
            ['mes' => 'Abr', 'custo' => 17100],
            ['mes' => 'Mai', 'custo' => 16500],
        ];
    }

    private function getAlertas()
    {
        $alertas = [];

        // Alertas de estoque
        $estoqueCritico = Estoque::where('status', 'Crítico')->get();
        foreach ($estoqueCritico as $item) {
            $alertas[] = [
                'tipo' => 'estoque',
                'titulo' => "Estoque de {$item->nome} Baixo",
                'descricao' => "Apenas {$item->quantidade}% do estoque disponível",
                'urgencia' => 'Urgente'
            ];
        }

        return $alertas;
    }
}
