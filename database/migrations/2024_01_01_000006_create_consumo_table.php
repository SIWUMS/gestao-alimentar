<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('consumo', function (Blueprint $table) {
            $table->id();
            $table->date('data');
            $table->foreignId('turma_id')->constrained();
            $table->integer('alunos_presentes');
            $table->integer('refeicoes_servidas');
            $table->string('cardapio');
            $table->text('observacoes')->nullable();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('consumo');
    }
};
