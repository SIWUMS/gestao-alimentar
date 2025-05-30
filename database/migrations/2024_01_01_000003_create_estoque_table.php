<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('estoque', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('categoria');
            $table->decimal('quantidade', 10, 2);
            $table->string('unidade');
            $table->decimal('estoque_minimo', 10, 2);
            $table->decimal('estoque_maximo', 10, 2);
            $table->decimal('valor_unitario', 8, 2);
            $table->date('data_vencimento');
            $table->string('fornecedor');
            $table->enum('status', ['Normal', 'Baixo', 'Crítico'])->default('Normal');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('estoque');
    }
};
