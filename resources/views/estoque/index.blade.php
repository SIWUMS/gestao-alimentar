@extends('layouts.app')

@section('title', 'Controle de Estoque')
@section('page-title', 'Controle de Estoque')

@section('page-actions')
<div class="btn-group" role="group">
    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#entradaModal">
        <i class="bi bi-plus-circle me-1"></i> Entrada
    </button>
    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#saidaModal">
        <i class="bi bi-dash-circle me-1"></i> Saída
    </button>
</div>
@endsection

@section('content')
<!-- Alertas de Estoque -->
@if(count($alertas) > 0)
<div class="alert alert-warning" role="alert">
    <h5 class="alert-heading">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Alertas de Estoque ({{ count($alertas) }})
    </h5>
    <div class="row">
        @foreach($alertas as $item)
        <div class="col-md-6 mb-2">
            <div class="d-flex justify-content-between align-items-center p-2 bg-white rounded">
                <div>
                    <strong>{{ $item->nome }}</strong>
                    <small class="text-muted d-block">{{ $item->quantidade }} {{ $item->unidade }} restantes</small>
                </div>
                <span class="badge 
                    @if($item->status == 'Crítico') bg-danger
                    @else bg-warning
                    @endif">
                    {{ $item->status }}
                </span>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endif

<!-- Filtros -->
<div class="card mb-4">
    <div class="card-body">
        <div class="row">
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" id="searchInput" placeholder="Buscar itens...">
                </div>
            </div>
            <div class="col-md-3">
                <select class="form-select" id="categoryFilter">
                    <option value="">Todas as Categorias</option>
                    <option value="Cereais">Cereais</option>
                    <option value="Leguminosas">Leguminosas</option>
                    <option value="Carnes">Carnes</option>
                    <option value="Verduras">Verduras</option>
                    <option value="Óleos">Óleos</option>
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select" id="statusFilter">
                    <option value="">Todos os Status</option>
                    <option value="Normal">Normal</option>
                    <option value="Baixo">Baixo</option>
                    <option value="Crítico">Crítico</option>
                </select>
            </div>
        </div>
    </div>
</div>

<!-- Tabela de Estoque -->
<div class="card">
    <div class="card-header">
        <h6 class="m-0 font-weight-bold text-primary">
            <i class="bi bi-box me-2"></i>
            Estoque Atual
        </h6>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover" id="estoqueTable">
                <thead class="table-light">
                    <tr>
                        <th>Item</th>
                        <th>Categoria</th>
                        <th>Quantidade</th>
                        <th>Nível</th>
                        <th>Vencimento</th>
                        <th>Valor Unit.</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($itens as $item)
                    <tr data-categoria="{{ $item->categoria }}" data-status="{{ $item->status }}">
                        <td class="fw-bold">{{ $item->nome }}</td>
                        <td>{{ $item->categoria }}</td>
                        <td>{{ $item->quantidade }} {{ $item->unidade }}</td>
                        <td style="width: 120px;">
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar 
                                    @if($item->getProgressPercentage() < 30) bg-danger
                                    @elseif($item->getProgressPercentage() < 60) bg-warning
                                    @else bg-success
                                    @endif" 
                                    role="progressbar" 
                                    style="width: {{ $item->getProgressPercentage() }}%">
                                </div>
                            </div>
                            <small class="text-muted">{{ number_format($item->getProgressPercentage(), 1) }}%</small>
                        </td>
                        <td>{{ $item->data_vencimento->format('d/m/Y') }}</td>
                        <td>R$ {{ number_format($item->valor_unitario, 2, ',', '.') }}</td>
                        <td>
                            <span class="badge 
                                @if($item->status == 'Normal') bg-success
                                @elseif($item->status == 'Baixo') bg-warning
                                @else bg-danger
                                @endif">
                                {{ $item->status }}
                            </span>
                        </td>
                        <td>
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-outline-primary" 
                                        onclick="editarItem({{ $item->id }})" 
                                        title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button type="button" class="btn btn-outline-success" 
                                        onclick="adicionarEstoque({{ $item->id }})" 
                                        title="Adicionar">
                                    <i class="bi bi-plus"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger" 
                                        onclick="removerEstoque({{ $item->id }})" 
                                        title="Remover">
                                    <i class="bi bi-dash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal de Entrada -->
<div class="modal fade" id="entradaModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-plus-circle me-2"></i>
                    Registrar Entrada
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="entradaForm">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="itemEntrada" class="form-label">Item</label>
                        <select class="form-select" id="itemEntrada" required>
                            <option value="">Selecione o item</option>
                            @foreach($itens as $item)
                            <option value="{{ $item->id }}">{{ $item->nome }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="quantidadeEntrada" class="form-label">Quantidade</label>
                                <input type="number" class="form-control" id="quantidadeEntrada" step="0.01" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="unidadeEntrada" class="form-label">Unidade</label>
                                <select class="form-select" id="unidadeEntrada" required>
                                    <option value="">Selecione</option>
                                    <option value="KG">KG - Quilograma</option>
                                    <option value="UN">UN - Unidade</option>
                                    <option value="LT">LT - Litro</option>
                                    <option value="G">G - Grama</option>
                                    <option value="ML">ML - Mililitro</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="dataEntrada" class="form-label">Data</label>
                                <input type="date" class="form-control" id="dataEntrada" value="{{ date('Y-m-d') }}" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="valorUnitarioEntrada" class="form-label">Valor Unitário (R$)</label>
                                <input type="number" class="form-control" id="valorUnitarioEntrada" step="0.01" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="valorTotalEntrada" class="form-label">Valor Total (R$)</label>
                                <input type="number" class="form-control" id="valorTotalEntrada" step="0.01" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="dataVencimentoEntrada" class="form-label">Data Vencimento</label>
                                <input type="date" class="form-control" id="dataVencimentoEntrada" required>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="fornecedorEntrada" class="form-label">Fornecedor</label>
                        <input type="text" class="form-control" id="fornecedorEntrada" required>
                    </div>
                    <div class="mb-3">
                        <label for="observacaoEntrada" class="form-label">Observação</label>
                        <input type="text" class="form-control" id="observacaoEntrada" placeholder="Observações sobre a entrada">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-success">
                        <i class="bi bi-check me-1"></i>
                        Registrar Entrada
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal de Saída -->
<div class="modal fade" id="saidaModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-dash-circle me-2"></i>
                    Registrar Saída
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="saidaForm">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="itemSaida" class="form-label">Item</label>
                        <select class="form-select" id="itemSaida" required>
                            <option value="">Selecione o item</option>
                            @foreach($itens as $item)
                            <option value="{{ $item->id }}">{{ $item->nome }} ({{ $item->quantidade }} {{ $item->unidade }})</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="quantidadeSaida" class="form-label">Quantidade</label>
                                <input type="number" class="form-control" id="quantidadeSaida" step="0.01" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="dataSaida" class="form-label">Data</label>
                                <input type="date" class="form-control" id="dataSaida" value="{{ date('Y-m-d') }}" required>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="observacaoSaida" class="form-label">Observação</label>
                        <input type="text" class="form-control" id="observacaoSaida" placeholder="Ex: Preparo cardápio semanal">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger">
                        <i class="bi bi-check me-1"></i>
                        Registrar Saída
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
$(document).ready(function() {
    // Filtros
    $('#searchInput, #categoryFilter, #statusFilter').on('input change', function() {
        filterTable();
    });

    function filterTable() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        const categoryFilter = $('#categoryFilter').val();
        const statusFilter = $('#statusFilter').val();

        $('#estoqueTable tbody tr').each(function() {
            const row = $(this);
            const nome = row.find('td:first').text().toLowerCase();
            const categoria = row.data('categoria');
            const status = row.data('status');

            const matchesSearch = nome.includes(searchTerm);
            const matchesCategory = !categoryFilter || categoria === categoryFilter;
            const matchesStatus = !statusFilter || status === statusFilter;

            if (matchesSearch && matchesCategory && matchesStatus) {
                row.show();
            } else {
                row.hide();
            }
        });
    }

    // Formulário de Entrada
    $('#entradaForm').on('submit', function(e) {
        e.preventDefault();
        
        const data = {
            item_id: $('#itemEntrada').val(),
            quantidade: $('#quantidadeEntrada').val(),
            data: $('#dataEntrada').val(),
            fornecedor: $('#fornecedorEntrada').val(),
            observacao: $('#observacaoEntrada').val(),
            tipo: 'entrada'
        };

        $.post('/estoque/movimentacao', data)
            .done(function(response) {
                if (response.success) {
                    showNotification('Entrada registrada com sucesso!');
                    $('#entradaModal').modal('hide');
                    location.reload();
                }
            })
            .fail(function(xhr) {
                showNotification('Erro ao registrar entrada: ' + xhr.responseJSON.message, 'error');
            });
    });

    // Formulário de Saída
    $('#saidaForm').on('submit', function(e) {
        e.preventDefault();
        
        const data = {
            item_id: $('#itemSaida').val(),
            quantidade: $('#quantidadeSaida').val(),
            data: $('#dataSaida').val(),
            observacao: $('#observacaoSaida').val(),
            tipo: 'saida'
        };

        $.post('/estoque/movimentacao', data)
            .done(function(response) {
                if (response.success) {
                    showNotification('Saída registrada com sucesso!');
                    $('#saidaModal').modal('hide');
                    location.reload();
                }
            })
            .fail(function(xhr) {
                showNotification('Erro ao registrar saída: ' + xhr.responseJSON.message, 'error');
            });
    });
});

function editarItem(id) {
    // Implementar edição de item
    console.log('Editar item:', id);
}

function adicionarEstoque(id) {
    $('#itemEntrada').val(id);
    $('#entradaModal').modal('show');
}

function removerEstoque(id) {
    $('#itemSaida').val(id);
    $('#saidaModal').modal('show');
}

// Calcular valor total automaticamente
$('#quantidadeEntrada, #valorUnitarioEntrada').on('input', function() {
    const quantidade = parseFloat($('#quantidadeEntrada').val()) || 0;
    const valorUnitario = parseFloat($('#valorUnitarioEntrada').val()) || 0;
    const valorTotal = quantidade * valorUnitario;
    $('#valorTotalEntrada').val(valorTotal.toFixed(2));
});

// Atualizar formulário de entrada para incluir novos campos
$('#entradaForm').off('submit').on('submit', function(e) {
    e.preventDefault();
    
    const data = {
        item_id: $('#itemEntrada').val(),
        quantidade: $('#quantidadeEntrada').val(),
        unidade: $('#unidadeEntrada').val(),
        valor_unitario: $('#valorUnitarioEntrada').val(),
        valor_total: $('#valorTotalEntrada').val(),
        data: $('#dataEntrada').val(),
        data_vencimento: $('#dataVencimentoEntrada').val(),
        fornecedor: $('#fornecedorEntrada').val(),
        observacao: $('#observacaoEntrada').val(),
        tipo: 'entrada'
    };

    $.post('/estoque/movimentacao', data)
        .done(function(response) {
            if (response.success) {
                showNotification('Entrada registrada com sucesso!');
                $('#entradaModal').modal('hide');
                location.reload();
            }
        })
        .fail(function(xhr) {
            showNotification('Erro ao registrar entrada: ' + xhr.responseJSON.message, 'error');
        });
});
</script>
@endpush
