<?php

namespace App\Http\Controllers;

use App\Models\Estoque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EstoqueController extends Controller
{
    public function index()
    {
        $itens = Estoque::orderBy('nome')->get();
        $alertas = Estoque::whereIn('status', ['Baixo', 'Crítico'])->get();
        
        return view('estoque.index', compact('itens', 'alertas'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'quantidade' => 'required|numeric|min:0',
            'unidade' => 'required|string|max:50',
            'estoque_minimo' => 'required|numeric|min:0',
            'estoque_maximo' => 'required|numeric|min:0',
            'valor_unitario' => 'required|numeric|min:0',
            'data_vencimento' => 'required|date',
            'fornecedor' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item = Estoque::create($request->all());
        $item->updateStatus();

        return response()->json(['success' => true, 'item' => $item]);
    }

    public function update(Request $request, Estoque $estoque)
    {
        $validator = Validator::make($request->all(), [
            'quantidade' => 'required|numeric|min:0',
            'observacao' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $estoque->update(['quantidade' => $request->quantidade]);
        $estoque->updateStatus();

        // Registrar movimentação
        // MovimentacaoEstoque::create([...]);

        return response()->json(['success' => true, 'item' => $estoque]);
    }

    public function destroy(Estoque $estoque)
    {
        $estoque->delete();
        return response()->json(['success' => true]);
    }

    public function getAlertas()
    {
        $alertas = Estoque::whereIn('status', ['Baixo', 'Crítico'])
            ->orderBy('status', 'desc')
            ->get();

        return response()->json($alertas);
    }
}
