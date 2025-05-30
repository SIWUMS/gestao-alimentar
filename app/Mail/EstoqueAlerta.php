<?php

namespace App\Mail;

use App\Models\Estoque;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EstoqueAlerta extends Mailable
{
    use Queueable, SerializesModels;

    public $itensAlerta;

    public function __construct($itensAlerta)
    {
        $this->itensAlerta = $itensAlerta;
    }

    public function build()
    {
        return $this->subject('Alerta de Estoque - Sistema de Gestão Alimentar')
                    ->view('emails.estoque-alerta')
                    ->with([
                        'itens' => $this->itensAlerta,
                        'data' => now()->format('d/m/Y H:i')
                    ]);
    }
}
