<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\VerificarEstoque::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        // Verificar estoque todos os dias às 8h
        $schedule->command('estoque:verificar')
                 ->dailyAt('08:00')
                 ->emailOutputTo(['admin@escola.com']);

        // Atualizar status do estoque a cada hora
        $schedule->call(function () {
            \App\Models\Estoque::chunk(100, function ($itens) {
                foreach ($itens as $item) {
                    $item->updateStatus();
                }
            });
        })->hourly();
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
