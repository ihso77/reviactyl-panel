<?php

namespace App\Database\Schema\Grammars;

use Illuminate\Database\Schema\Grammars\SQLiteGrammar;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Fluent;

class CustomSQLiteGrammar extends SQLiteGrammar
{
    public function compileDropIndex(Blueprint $blueprint, Fluent $command)
    {
        [$schema] = $this->connection->getSchemaBuilder()->parseSchemaAndTable($blueprint->getTable());

        return sprintf('drop index if exists %s%s',
            $schema ? $this->wrapValue($schema).'.' : '',
            $this->wrap($command->index)
        );
    }
}
