<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Alerta de Estoque</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { background: #dc3545; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 20px 0; }
        .item { padding: 10px; border-left: 4px solid #dc3545; margin: 10px 0; background: #f8f9fa; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>⚠️ Alerta de Estoque</h2>
            <p>Sistema de Gestão Alimentar</p>
        </div>
        
        <div class="content">
            <p>Os seguintes itens estão com estoque baixo ou crítico:</p>
            
            @foreach($itens as $item)
            <div class="item">
                <strong>{{ $item->nome }}</strong><br>
                <small>Quantidade atual: {{ $item->quantidade }} {{ $item->unidade }}</small><br>
                <small>Status: <span style="color: #dc3545;">{{ $item->status }}</span></small>
            </div>
            @endforeach
            
            <p><strong>Ação necessária:</strong> Verifique os itens listados e providencie a reposição do estoque.</p>
        </div>
        
        <div class="footer">
            <p>Email enviado automaticamente em {{ $data }}</p>
            <p><strong>Criado Por CB. Walison</strong></p>
        </div>
    </div>
</body>
</html>
