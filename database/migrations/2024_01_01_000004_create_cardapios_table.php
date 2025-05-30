<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cardapios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->enum('tipo', ['diario', 'semanal', 'mensal']);
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->enum('status', ['Rascunho', 'Pendente', 'Aprovado'])->default('Rascunho');
            $table->text('observacoes')->nullable();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cardapios');
    }
};
