<?php

namespace App\Console\Commands;

use App\Models\Estoque;
use App\Models\User;
use App\Mail\EstoqueAlerta;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class VerificarEstoque extends Command
{
    protected $signature = 'estoque:verificar';
    protected $description = 'Verifica itens com estoque baixo e envia alertas por email';

    public function handle()
    {
        $itensAlerta = Estoque::whereIn('status', ['Baixo', 'Crítico'])->get();

        if ($itensAlerta->count() > 0) {
            $admins = User::where('role', 'admin')->get();
            $nutricionistas = User::where('role', 'nutricionista')->get();
            
            $destinatarios = $admins->merge($nutricionistas);

            foreach ($destinatarios as $user) {
                Mail::to($user->email)->send(new EstoqueAlerta($itensAlerta));
            }

            $this->info("Alertas enviados para {$destinatarios->count()} usuários sobre {$itensAlerta->count()} itens.");
        } else {
            $this->info('Nenhum item com estoque baixo encontrado.');
        }

        return 0;
    }
}
