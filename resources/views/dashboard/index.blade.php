@extends('layouts.app')

@section('title', 'Dashboard - Sistema de Gestão Alimentar')
@section('page-title', 'Dashboard')

@section('content')
<div class="row">
    <!-- Cards de Estatísticas -->
    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card stats-card h-100">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Refeições Hoje
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">{{ number_format($refeicoesHoje) }}</div>
                        <div class="text-xs text-muted">+12% em relação a ontem</div>
                    </div>
                    <div class="col-auto">
                        <i class="bi bi-people text-primary" style="font-size: 2rem;"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card stats-card h-100">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Itens em Estoque
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">{{ $itensEstoque }}</div>
                        <div class="text-xs text-muted">{{ $estoqueAlerta }} itens com estoque baixo</div>
                    </div>
                    <div class="col-auto">
                        <i class="bi bi-box text-success" style="font-size: 2rem;"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card stats-card h-100">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Custo Mensal
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {{ number_format($custoMensal, 2, ',', '.') }}</div>
                        <div class="text-xs text-muted">+3.2% em relação ao mês anterior</div>
                    </div>
                    <div class="col-auto">
                        <i class="bi bi-currency-dollar text-info" style="font-size: 2rem;"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card stats-card h-100">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Alertas
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">{{ count($alertas) }}</div>
                        <div class="text-xs text-muted">Itens precisam de atenção</div>
                    </div>
                    <div class="col-auto">
                        <i class="bi bi-exclamation-triangle text-warning" style="font-size: 2rem;"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <!-- Gráfico de Consumo Semanal -->
    <div class="col-lg-8 mb-4">
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="bi bi-bar-chart me-2"></i>
                    Consumo Semanal por Faixa Etária
                </h6>
            </div>
            <div class="card-body">
                <canvas id="consumoChart" width="400" height="200"></canvas>
            </div>
        </div>
    </div>

    <!-- Status do Estoque -->
    <div class="col-lg-4 mb-4">
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="bi bi-pie-chart me-2"></i>
                    Status do Estoque
                </h6>
            </div>
            <div class="card-body">
                @foreach($estoqueStatus as $item)
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="small font-weight-bold">{{ $item['name'] }}</span>
                        <span class="small">{{ number_format($item['value'], 1) }}%</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar 
                            @if($item['value'] < 30) bg-danger
                            @elseif($item['value'] < 60) bg-warning
                            @else bg-success
                            @endif" 
                            role="progressbar" 
                            style="width: {{ $item['value'] }}%">
                        </div>
                    </div>
                    @if($item['value'] < 30)
                        <small class="text-danger">
                            <i class="bi bi-exclamation-triangle"></i> Estoque Baixo
                        </small>
                    @endif
                </div>
                @endforeach
            </div>
        </div>
    </div>
</div>

<div class="row">
    <!-- Evolução de Custos -->
    <div class="col-lg-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="bi bi-graph-up me-2"></i>
                    Evolução de Custos
                </h6>
            </div>
            <div class="card-body">
                <canvas id="custoChart" width="400" height="200"></canvas>
            </div>
        </div>
    </div>

    <!-- Alertas e Notificações -->
    <div class="col-lg-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="bi bi-bell me-2"></i>
                    Alertas e Notificações
                </h6>
            </div>
            <div class="card-body">
                @if(count($alertas) > 0)
                    @foreach($alertas as $alerta)
                    <div class="d-flex align-items-center mb-3">
                        <div class="me-3">
                            @if($alerta['urgencia'] == 'Urgente')
                                <i class="bi bi-exclamation-triangle text-danger" style="font-size: 1.5rem;"></i>
                            @else
                                <i class="bi bi-info-circle text-warning" style="font-size: 1.5rem;"></i>
                            @endif
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ $alerta['titulo'] }}</h6>
                            <p class="mb-0 text-muted small">{{ $alerta['descricao'] }}</p>
                        </div>
                        <div>
                            <span class="badge 
                                @if($alerta['urgencia'] == 'Urgente') bg-danger
                                @else bg-warning
                                @endif">
                                {{ $alerta['urgencia'] }}
                            </span>
                        </div>
                    </div>
                    @endforeach
                @else
                    <div class="text-center text-muted">
                        <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                        <p class="mt-2">Nenhum alerta no momento</p>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
$(document).ready(function() {
    // Dados do consumo semanal
    const consumoData = @json($consumoSemanal);
    
    // Gráfico de Consumo Semanal
    const ctx1 = document.getElementById('consumoChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: consumoData.map(item => item.dia),
            datasets: [{
                label: 'Creche',
                data: consumoData.map(item => item.creche),
                backgroundColor: 'rgba(40, 167, 69, 0.8)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1
            }, {
                label: 'Fundamental',
                data: consumoData.map(item => item.fundamental),
                backgroundColor: 'rgba(0, 123, 255, 0.8)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Refeições Servidas por Dia'
                }
            }
        }
    });

    // Dados do custo mensal
    const custoData = @json($custoMensal);
    
    // Gráfico de Evolução de Custos
    const ctx2 = document.getElementById('custoChart').getContext('2d');
    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: custoData.map(item => item.mes),
            datasets: [{
                label: 'Custo (R$)',
                data: custoData.map(item => item.custo),
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Evolução dos Custos Mensais'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Custo: R$ ' + context.parsed.y.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });

    // Atualizar alertas a cada 5 minutos
    setInterval(function() {
        $.get('/api/alertas', function(data) {
            // Atualizar contador de alertas na sidebar
            if (data.length > 0) {
                $('.alert-badge').text(data.length).show();
            } else {
                $('.alert-badge').hide();
            }
        });
    }, 300000); // 5 minutos
});
</script>
@endpush
