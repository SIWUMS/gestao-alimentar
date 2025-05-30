<?php

namespace App\Http\Controllers;

use App\Models\Consumo;
use App\Models\Turma;
use App\Models\Alimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class RelatorioController extends Controller
{
    public function index()
    {
        $dadosNutricionais = $this->getDadosNutricionais();
        $dadosConsumo = $this->getDadosConsumo();
        $dadosCustos = $this->getDadosCustos();

        return view('relatorios.index', compact('dadosNutricionais', 'dadosConsumo', 'dadosCustos'));
    }

    public function nutricional(Request $request)
    {
        $dataInicio = $request->data_inicio;
        $dataFim = $request->data_fim;
        $faixaEtaria = $request->faixa_etaria;

        $dados = $this->calcularMediasNutricionais($dataInicio, $dataFim, $faixaEtaria);

        if ($request->formato === 'pdf') {
            $pdf = Pdf::loadView('relatorios.nutricional-pdf', compact('dados', 'dataInicio', 'dataFim'));
            return $pdf->download('relatorio-nutricional.pdf');
        }

        // Retornar Excel ou JSON
        return response()->json($dados);
    }

    public function consumo(Request $request)
    {
        $dataInicio = $request->data_inicio;
        $dataFim = $request->data_fim;
        $turmaId = $request->turma_id;

        $consumos = Consumo::with('turma')
            ->whereBetween('data', [$dataInicio, $dataFim])
            ->when($turmaId, function ($query, $turmaId) {
                return $query->where('turma_id', $turmaId);
            })
            ->orderBy('data', 'desc')
            ->get();

        if ($request->formato === 'pdf') {
            $pdf = Pdf::loadView('relatorios.consumo-pdf', compact('consumos', 'dataInicio', 'dataFim'));
            return $pdf->download('relatorio-consumo.pdf');
        }

        return response()->json($consumos);
    }

    public function financeiro(Request $request)
    {
        $dataInicio = $request->data_inicio;
        $dataFim = $request->data_fim;

        $dados = $this->calcularCustosFinanceiros($dataInicio, $dataFim);

        if ($request->formato === 'pdf') {
            $pdf = Pdf::loadView('relatorios.financeiro-pdf', compact('dados', 'dataInicio', 'dataFim'));
            return $pdf->download('relatorio-financeiro.pdf');
        }

        return response()->json($dados);
    }

    private function getDadosNutricionais()
    {
        return [
            'creche' => [
                'calorias' => 320,
                'proteinas' => 18,
                'carboidratos' => 45,
                'fibras' => 8
            ],
            'fundamental' => [
                'calorias' => 450,
                'proteinas' => 25,
                'carboidratos' => 65,
                'fibras' => 12
            ]
        ];
    }

    private function getDadosConsumo()
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

    private function getDadosCustos()
    {
        return [
            ['mes' => 'Jan', 'custo' => 15000],
            ['mes' => 'Fev', 'custo' => 16200],
            ['mes' => 'Mar', 'custo' => 15800],
            ['mes' => 'Abr', 'custo' => 17100],
            ['mes' => 'Mai', 'custo' => 16500],
        ];
    }

    private function calcularMediasNutricionais($dataInicio, $dataFim, $faixaEtaria)
    {
        // Implementar cálculo das médias nutricionais baseado nos cardápios servidos
        return [
            'periodo' => "$dataInicio a $dataFim",
            'faixa_etaria' => $faixaEtaria,
            'medias' => [
                'calorias' => 435,
                'proteinas' => 23,
                'carboidratos' => 62,
                'fibras' => 11
            ]
        ];
    }

    private function calcularCustosFinanceiros($dataInicio, $dataFim)
    {
        // Implementar cálculo dos custos financeiros
        return [
            'periodo' => "$dataInicio a $dataFim",
            'custo_total' => 16500,
            'custo_por_aluno' => 55.37,
            'custo_por_refeicao' => 2.75,
            'total_refeicoes' => 6000
        ];
    }
}
