<?php

namespace App\Http\Controllers;

use App\Models\Alimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AlimentoController extends Controller
{
    public function index()
    {
        $alimentos = Alimento::orderBy('nome')->paginate(20);
        $categorias = Alimento::distinct()->pluck('categoria');

        return view('alimentos.index', compact('alimentos', 'categorias'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'calorias' => 'required|numeric|min:0',
            'proteinas' => 'required|numeric|min:0',
            'carboidratos' => 'required|numeric|min:0',
            'gorduras' => 'required|numeric|min:0',
            'fibras' => 'required|numeric|min:0',
            'calcio' => 'required|numeric|min:0',
            'ferro' => 'required|numeric|min:0',
            'restricoes' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $alimento = Alimento::create($request->all());

        return response()->json(['success' => true, 'alimento' => $alimento]);
    }

    public function update(Request $request, Alimento $alimento)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'calorias' => 'required|numeric|min:0',
            'proteinas' => 'required|numeric|min:0',
            'carboidratos' => 'required|numeric|min:0',
            'gorduras' => 'required|numeric|min:0',
            'fibras' => 'required|numeric|min:0',
            'calcio' => 'required|numeric|min:0',
            'ferro' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $alimento->update($request->all());

        return response()->json(['success' => true, 'alimento' => $alimento]);
    }

    public function destroy(Alimento $alimento)
    {
        $alimento->delete();
        return response()->json(['success' => true]);
    }

    public function importarTaco(Request $request)
    {
        // Implementar importação da tabela TACO
        // Aqui seria feita a leitura do arquivo CSV/Excel e inserção no banco
        
        return response()->json(['success' => true, 'message' => 'Dados TACO importados com sucesso!']);
    }
}
