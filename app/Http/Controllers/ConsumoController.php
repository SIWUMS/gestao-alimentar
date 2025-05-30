<?php

namespace App\Http\Controllers;

use App\Models\Consumo;
use App\Models\Turma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ConsumoController extends Controller
{
    public function index()
    {
        $turmas = Turma::all();
        $consumos = Consumo::with('turma', 'user')
            ->orderBy('data', 'desc')
            ->paginate(20);

        $estatisticas = [
            'total_alunos' => $turmas->sum('total_alunos'),
            'refeicoes_hoje' => Consumo::whereDate('data', today())->sum('refeicoes_servidas'),
            'taxa_adesao' => $this->calcularTaxaAdesaoGeral(),
            'turmas_registradas' => Consumo::whereDate('data', today())->distinct('turma_id')->count(),
        ];

        return view('consumo.index', compact('turmas', 'consumos', 'estatisticas'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|date',
            'turma_id' => 'required|exists:turmas,id',
            'alunos_presentes' => 'required|integer|min:0',
            'refeicoes_servidas' => 'required|integer|min:0',
            'cardapio' => 'required|string|max:500',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $consumo = Consumo::create([
            'data' => $request->data,
            'turma_id' => $request->turma_id,
            'alunos_presentes' => $request->alunos_presentes,
            'refeicoes_servidas' => $request->refeicoes_servidas,
            'cardapio' => $request->cardapio,
            'observacoes' => $request->observacoes,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['success' => true, 'consumo' => $consumo->load('turma')]);
    }

    public function getConsumoData(Request $request)
    {
        $data = $request->get('data', today());
        
        $consumos = Consumo::with('turma')
            ->whereDate('data', $data)
            ->get();

        return response()->json($consumos);
    }

    private function calcularTaxaAdesaoGeral()
    {
        $consumos = Consumo::where('data', '>=', now()->subDays(7))->get();
        
        if ($consumos->isEmpty()) {
            return 0;
        }

        $totalPresentes = $consumos->sum('alunos_presentes');
        $totalServidas = $consumos->sum('refeicoes_servidas');

        return $totalPresentes > 0 ? round(($totalServidas / $totalPresentes) * 100, 1) : 0;
    }
}
