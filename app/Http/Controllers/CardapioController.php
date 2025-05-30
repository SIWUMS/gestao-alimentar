<?php

namespace App\Http\Controllers;

use App\Models\Cardapio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CardapioController extends Controller
{
    public function index()
    {
        $cardapios = Cardapio::with('user')
            ->orderBy('data_inicio', 'desc')
            ->paginate(10);

        return view('cardapios.index', compact('cardapios'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'tipo' => 'required|in:diario,semanal,mensal',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after_or_equal:data_inicio',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cardapio = Cardapio::create([
            'nome' => $request->nome,
            'tipo' => $request->tipo,
            'data_inicio' => $request->data_inicio,
            'data_fim' => $request->data_fim,
            'observacoes' => $request->observacoes,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['success' => true, 'cardapio' => $cardapio]);
    }

    public function update(Request $request, Cardapio $cardapio)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:Rascunho,Pendente,Aprovado',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cardapio->update(['status' => $request->status]);

        return response()->json(['success' => true, 'cardapio' => $cardapio]);
    }

    public function destroy(Cardapio $cardapio)
    {
        $cardapio->delete();
        return response()->json(['success' => true]);
    }
}
