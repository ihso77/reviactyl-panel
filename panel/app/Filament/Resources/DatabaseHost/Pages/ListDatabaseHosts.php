<?php

namespace App\Filament\Resources\DatabaseHost\Pages;

use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\DatabaseHost\DatabaseHostResource;

class ListDatabaseHosts extends ListRecords
{
    protected static string $resource = DatabaseHostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\CreateAction::make(),
        ];
    }
}
