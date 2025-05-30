<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EstoqueController;
use App\Http\Controllers\ConsumoController;
use App\Http\Controllers\CardapioController;
use App\Http\Controllers\AlimentoController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\CustoController;
use App\Http\Controllers\ConfiguracaoController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('auth.login');
});

Auth::routes();

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Estoque
    Route::prefix('estoque')->name('estoque.')->group(function () {
        Route::get('/', [EstoqueController::class, 'index'])->name('index');
        Route::post('/', [EstoqueController::class, 'store'])->name('store');
        Route::put('/{estoque}', [EstoqueController::class, 'update'])->name('update');
        Route::delete('/{estoque}', [EstoqueController::class, 'destroy'])->name('destroy');
        Route::post('/movimentacao', [EstoqueController::class, 'movimentacao'])->name('movimentacao');
    });
    
    // Consumo
    Route::prefix('consumo')->name('consumo.')->group(function () {
        Route::get('/', [ConsumoController::class, 'index'])->name('index');
        Route::post('/', [ConsumoController::class, 'store'])->name('store');
        Route::get('/data', [ConsumoController::class, 'getConsumoData'])->name('data');
    });
    
    // Cardápios
    Route::prefix('cardapios')->name('cardapios.')->group(function () {
        Route::get('/', [CardapioController::class, 'index'])->name('index');
        Route::post('/', [CardapioController::class, 'store'])->name('store');
        Route::put('/{cardapio}', [CardapioController::class, 'update'])->name('update');
        Route::delete('/{cardapio}', [CardapioController::class, 'destroy'])->name('destroy');
    });
    
    // Alimentos
    Route::prefix('alimentos')->name('alimentos.')->group(function () {
        Route::get('/', [AlimentoController::class, 'index'])->name('index');
        Route::post('/', [AlimentoController::class, 'store'])->name('store');
        Route::put('/{alimento}', [AlimentoController::class, 'update'])->name('update');
        Route::delete('/{alimento}', [AlimentoController::class, 'destroy'])->name('destroy');
        Route::post('/importar-taco', [AlimentoController::class, 'importarTaco'])->name('importar-taco');
    });
    
    // Relatórios
    Route::prefix('relatorios')->name('relatorios.')->group(function () {
        Route::get('/', [RelatorioController::class, 'index'])->name('index');
        Route::post('/nutricional', [RelatorioController::class, 'nutricional'])->name('nutricional');
        Route::post('/consumo', [RelatorioController::class, 'consumo'])->name('consumo');
        Route::post('/financeiro', [RelatorioController::class, 'financeiro'])->name('financeiro');
    });
    
    // Custos
    Route::prefix('custos')->name('custos.')->group(function () {
        Route::get('/', [CustoController::class, 'index'])->name('index');
        Route::post('/calcular', [CustoController::class, 'calcular'])->name('calcular');
    });
    
    // Configurações
    Route::prefix('configuracoes')->name('configuracoes.')->group(function () {
        Route::get('/', [ConfiguracaoController::class, 'index'])->name('index');
        Route::post('/', [ConfiguracaoController::class, 'update'])->name('update');
    });
});

// API Routes
Route::prefix('api')->middleware(['auth'])->group(function () {
    Route::get('/alertas', [EstoqueController::class, 'getAlertas']);
    Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);
});
