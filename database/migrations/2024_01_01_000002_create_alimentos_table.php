<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alimentos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('categoria');
            $table->decimal('calorias', 8, 2);
            $table->decimal('proteinas', 8, 2);
            $table->decimal('carboidratos', 8, 2);
            $table->decimal('gorduras', 8, 2);
            $table->decimal('fibras', 8, 2);
            $table->decimal('calcio', 8, 2);
            $table->decimal('ferro', 8, 2);
            $table->json('restricoes')->nullable();
            $table->string('fonte')->default('TACO');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('alimentos');
    }
};
