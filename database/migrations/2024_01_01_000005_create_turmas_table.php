<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('turmas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('faixa_etaria');
            $table->integer('total_alunos');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('turmas');
    }
};
