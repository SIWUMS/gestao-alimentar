import jsPDF from "jspdf"

export interface ConfiguracaoSistema {
  nomeEscola: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  anoLetivo: string
  diretor: string
  nutricionista: string
  cozinheiro: string
  logoEsquerda?: string
  logoDireita?: string
}

export interface CardapioPDF {
  id: number
  nome: string
  periodo: string
  status: string
  tipo: string
  dataInicio: string
  dataFim: string
  observacoes?: string
  refeicoes: Array<{
    dia: string
    prato: string
    calorias: number
    custo?: number
  }>
}

export const generateCardapioPDF = async (cardapio: CardapioPDF, configuracao: ConfiguracaoSistema): Promise<Blob> => {
  const pdf = new jsPDF()

  // Configurações
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // Função para adicionar texto centralizado
  const addCenteredText = (text: string, y: number, fontSize = 12) => {
    pdf.setFontSize(fontSize)
    const textWidth = pdf.getTextWidth(text)
    const x = (pageWidth - textWidth) / 2
    pdf.text(text, x, y)
    return y + fontSize * 0.5
  }

  // Função para adicionar linha
  const addLine = (y: number) => {
    pdf.line(margin, y, pageWidth - margin, y)
    return y + 5
  }

  // Cabeçalho
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  yPosition = addCenteredText(configuracao.nomeEscola.toUpperCase(), yPosition, 16)

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  yPosition = addCenteredText(`CNPJ: ${configuracao.cnpj}`, yPosition + 5, 10)
  yPosition = addCenteredText(configuracao.endereco, yPosition + 3, 10)
  yPosition = addCenteredText(`Tel: ${configuracao.telefone} | Email: ${configuracao.email}`, yPosition + 3, 10)

  yPosition = addLine(yPosition + 10)

  // Título do documento
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  yPosition = addCenteredText(`CARDÁPIO - ${cardapio.nome.toUpperCase()}`, yPosition + 10, 18)

  yPosition += 20

  // Informações do cardápio
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")

  const info = [
    [`Período:`, cardapio.periodo],
    [`Tipo:`, cardapio.tipo.charAt(0).toUpperCase() + cardapio.tipo.slice(1)],
    [`Status:`, cardapio.status],
    [`Ano Letivo:`, configuracao.anoLetivo],
  ]

  info.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold")
    pdf.text(label, margin, yPosition)
    pdf.setFont("helvetica", "normal")
    pdf.text(value, margin + 30, yPosition)
    yPosition += 8
  })

  if (cardapio.observacoes) {
    yPosition += 5
    pdf.setFont("helvetica", "bold")
    pdf.text("Observações:", margin, yPosition)
    yPosition += 8
    pdf.setFont("helvetica", "normal")

    // Quebrar texto longo
    const splitText = pdf.splitTextToSize(cardapio.observacoes, pageWidth - 2 * margin)
    pdf.text(splitText, margin, yPosition)
    yPosition += splitText.length * 6
  }

  // Refeições
  if (cardapio.refeicoes.length > 0) {
    yPosition += 15
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("DETALHAMENTO DAS REFEIÇÕES", margin, yPosition)
    yPosition += 15

    // Resumo
    const totalCalorias = cardapio.refeicoes.reduce((sum, r) => sum + r.calorias, 0)
    const totalCusto = cardapio.refeicoes.reduce((sum, r) => sum + (r.custo || 0), 0)
    const mediaCalorias = totalCalorias / cardapio.refeicoes.length

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.text(`Total de Refeições: ${cardapio.refeicoes.length}`, margin, yPosition)
    pdf.text(`Média de Calorias: ${mediaCalorias.toFixed(0)} kcal`, margin + 80, yPosition)
    pdf.text(`Custo Total: R$ ${totalCusto.toFixed(2)}`, margin + 160, yPosition)
    yPosition += 15

    // Lista de refeições
    cardapio.refeicoes.forEach((refeicao, index) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text(`${refeicao.dia}:`, margin, yPosition)
      yPosition += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)

      // Quebrar texto do prato
      const pratoText = pdf.splitTextToSize(refeicao.prato, pageWidth - 2 * margin - 10)
      pdf.text(pratoText, margin + 10, yPosition)
      yPosition += pratoText.length * 5

      pdf.text(`Calorias: ${refeicao.calorias} kcal`, margin + 10, yPosition)
      pdf.text(`Custo: R$ ${refeicao.custo?.toFixed(2) || "0,00"}`, margin + 100, yPosition)
      yPosition += 12
    })
  } else {
    yPosition += 15
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "italic")
    yPosition = addCenteredText("Nenhuma refeição cadastrada para este cardápio.", yPosition + 20, 12)
  }

  // Assinaturas
  yPosition = Math.max(yPosition + 30, pageHeight - 80)

  const assinaturas = [
    configuracao.diretor || "Diretor",
    configuracao.nutricionista || "Nutricionista",
    configuracao.cozinheiro || "Cozinheiro",
  ]

  const assinaturaTitulos = ["Diretor", "Nutricionista Responsável", "Responsável pela Cozinha"]

  const assinaturaWidth = (pageWidth - 2 * margin) / 3

  assinaturas.forEach((nome, index) => {
    const x = margin + index * assinaturaWidth

    // Linha para assinatura
    pdf.line(x, yPosition, x + assinaturaWidth - 20, yPosition)

    // Nome
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    const nomeWidth = pdf.getTextWidth(nome)
    pdf.text(nome, x + (assinaturaWidth - 20 - nomeWidth) / 2, yPosition + 8)

    // Título
    pdf.setFont("helvetica", "normal")
    const tituloWidth = pdf.getTextWidth(assinaturaTitulos[index])
    pdf.text(assinaturaTitulos[index], x + (assinaturaWidth - 20 - tituloWidth) / 2, yPosition + 15)
  })

  // Rodapé
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "normal")
  const rodape = `Sistema de Gestão Alimentar - Documento gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`
  const rodapeWidth = pdf.getTextWidth(rodape)
  pdf.text(rodape, (pageWidth - rodapeWidth) / 2, pageHeight - 10)

  return new Blob([pdf.output("blob")], { type: "application/pdf" })
}
