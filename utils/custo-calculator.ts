interface ConfiguracoesCusto {
  salarioCozinheira: number
  salarioAuxiliar1: number
  salarioAuxiliar2: number
  salarioAuxiliar3: number
  salarioAuxiliar4: number
}

interface MovimentacaoEstoque {
  id: number
  tipo: "Entrada" | "Saída"
  item: string
  quantidade: number
  unidade: string
  valorUnitario: number
  valorTotal: number
  data: string
  fornecedor?: string
  observacao?: string
}

export class CustoCalculator {
  private configuracoes: ConfiguracoesCusto
  private movimentacoes: MovimentacaoEstoque[]

  constructor(configuracoes: ConfiguracoesCusto, movimentacoes: MovimentacaoEstoque[] = []) {
    this.configuracoes = configuracoes
    this.movimentacoes = movimentacoes
  }

  // Calcular custos fixos mensais (apenas salários)
  calcularSalariosMensais(): number {
    return (
      this.configuracoes.salarioCozinheira +
      this.configuracoes.salarioAuxiliar1 +
      this.configuracoes.salarioAuxiliar2 +
      this.configuracoes.salarioAuxiliar3 +
      this.configuracoes.salarioAuxiliar4
    )
  }

  // Calcular custo de ingredientes por período
  calcularCustoIngredientes(dataInicio: Date, dataFim: Date): number {
    return this.movimentacoes
      .filter((mov) => {
        const dataMovimentacao = new Date(mov.data)
        return (
          mov.tipo === "Entrada" &&
          mov.item !== "Gás de Cozinha P45" &&
          dataMovimentacao >= dataInicio &&
          dataMovimentacao <= dataFim
        )
      })
      .reduce((total, mov) => total + mov.valorTotal, 0)
  }

  // Calcular custo do gás por período
  calcularCustoGas(dataInicio: Date, dataFim: Date): number {
    return this.movimentacoes
      .filter((mov) => {
        const dataMovimentacao = new Date(mov.data)
        return (
          mov.tipo === "Entrada" &&
          mov.item === "Gás de Cozinha P45" &&
          dataMovimentacao >= dataInicio &&
          dataMovimentacao <= dataFim
        )
      })
      .reduce((total, mov) => total + mov.valorTotal, 0)
  }

  // Calcular custo total por período
  calcularCustoTotal(dataInicio: Date, dataFim: Date): number {
    const custoIngredientes = this.calcularCustoIngredientes(dataInicio, dataFim)
    const custoGas = this.calcularCustoGas(dataInicio, dataFim)
    const salarios = this.calcularSalariosMensais()

    // Calcular proporção de dias no período para salários
    const diasPeriodo = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const diasMes = 30
    const proporcaoSalarios = diasPeriodo / diasMes

    return custoIngredientes + custoGas + salarios * proporcaoSalarios
  }

  // Calcular custo por refeição
  calcularCustoPorRefeicao(totalAlunos: number, diasLetivos = 22): number {
    const custoMensal = this.calcularCustoTotal(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    )
    const totalRefeicoes = totalAlunos * diasLetivos
    return custoMensal / totalRefeicoes
  }

  // Calcular custo por aluno
  calcularCustoPorAluno(totalAlunos: number): number {
    const custoMensal = this.calcularCustoTotal(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    )
    return custoMensal / totalAlunos
  }

  // Calcular custo de uma preparação específica
  calcularCustoPreparacao(
    ingredientes: MovimentacaoEstoque[],
    porcoes: number,
    totalAlunos: number,
  ): {
    custoIngredientes: number
    custoFixoProporcional: number
    custoTotal: number
    custoPorPorcao: number
  } {
    const custoIngredientes = ingredientes.reduce((total, item) => total + item.valorTotal, 0)

    // Calcular custo fixo proporcional baseado no número de porções vs total de refeições diárias
    const refeicoesDiarias = totalAlunos
    const proporcaoFixa = porcoes / refeicoesDiarias
    const custoFixoDiario = this.calcularSalariosMensais() / 30 // custo fixo por dia
    const custoFixoProporcional = custoFixoDiario * proporcaoFixa

    const custoTotal = custoIngredientes + custoFixoProporcional
    const custoPorPorcao = custoTotal / porcoes

    return {
      custoIngredientes,
      custoFixoProporcional,
      custoTotal,
      custoPorPorcao,
    }
  }

  // Gerar relatório de custos detalhado
  gerarRelatorioDetalhado(
    dataInicio: Date,
    dataFim: Date,
    totalAlunos: number,
  ): {
    periodo: { inicio: Date; fim: Date }
    custosFixos: {
      salarioCozinheira: number
      salarioAuxiliares: number
      total: number
    }
    custoIngredientes: number
    custoGas: number
    custoTotal: number
    custoPorAluno: number
    custoPorRefeicao: number
    movimentacoesPeriodo: MovimentacaoEstoque[]
  } {
    const custosFixos = {
      salarioCozinheira: this.configuracoes.salarioCozinheira,
      salarioAuxiliares:
        this.configuracoes.salarioAuxiliar1 +
        this.configuracoes.salarioAuxiliar2 +
        this.configuracoes.salarioAuxiliar3 +
        this.configuracoes.salarioAuxiliar4,
      total: this.calcularSalariosMensais(),
    }

    const custoIngredientes = this.calcularCustoIngredientes(dataInicio, dataFim)
    const custoGas = this.calcularCustoGas(dataInicio, dataFim)
    const custoTotal = this.calcularCustoTotal(dataInicio, dataFim)
    const custoPorAluno = this.calcularCustoPorAluno(totalAlunos)
    const custoPorRefeicao = this.calcularCustoPorRefeicao(totalAlunos)

    const movimentacoesPeriodo = this.movimentacoes.filter((mov) => {
      const dataMovimentacao = new Date(mov.data)
      return dataMovimentacao >= dataInicio && dataMovimentacao <= dataFim
    })

    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      custosFixos,
      custoIngredientes,
      custoGas,
      custoTotal,
      custoPorAluno,
      custoPorRefeicao,
      movimentacoesPeriodo,
    }
  }
}

// Função helper para carregar configurações do localStorage
export function carregarConfiguracoesCusto(): ConfiguracoesCusto {
  const configSalva = localStorage.getItem("configuracoes")
  if (configSalva) {
    const config = JSON.parse(configSalva)
    return {
      salarioCozinheira: Number(config.salarioCozinheira || 0),
      salarioAuxiliar1: Number(config.salarioAuxiliar1 || 0),
      salarioAuxiliar2: Number(config.salarioAuxiliar2 || 0),
      salarioAuxiliar3: Number(config.salarioAuxiliar3 || 0),
      salarioAuxiliar4: Number(config.salarioAuxiliar4 || 0),
    }
  }

  return {
    salarioCozinheira: 0,
    salarioAuxiliar1: 0,
    salarioAuxiliar2: 0,
    salarioAuxiliar3: 0,
    salarioAuxiliar4: 0,
  }
}

// Função helper para carregar movimentações do localStorage
export function carregarMovimentacoesEstoque(): MovimentacaoEstoque[] {
  const movimentacoesSalvas = localStorage.getItem("movimentacoesEstoque")
  if (movimentacoesSalvas) {
    return JSON.parse(movimentacoesSalvas)
  }

  // Dados de exemplo se não houver dados salvos
  return [
    {
      id: 1,
      tipo: "Entrada",
      item: "Arroz Branco",
      quantidade: 25,
      unidade: "KG",
      valorUnitario: 4.5,
      valorTotal: 112.5,
      data: "2024-05-15",
      fornecedor: "Distribuidora ABC",
      observacao: "Compra mensal",
    },
    {
      id: 2,
      tipo: "Saída",
      item: "Feijão Preto",
      quantidade: 5,
      unidade: "KG",
      valorUnitario: 6.8,
      valorTotal: 34,
      data: "2024-05-18",
      observacao: "Preparo cardápio semanal",
    },
    {
      id: 3,
      tipo: "Entrada",
      item: "Gás de Cozinha P45",
      quantidade: 1,
      unidade: "UN",
      valorUnitario: 120.0,
      valorTotal: 120,
      data: "2024-05-10",
      fornecedor: "Gás Brasilgás",
      observacao: "Reposição mensal",
    },
  ]
}

export default CustoCalculator
