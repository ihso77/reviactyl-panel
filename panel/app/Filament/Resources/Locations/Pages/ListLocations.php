<?php

namespace App\Filament\Resources\Locations\Pages;

use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\Locations\LocationResource;

class ListLocations extends ListRecords
{
    protected static string $resource = LocationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\CreateAction::make(),
        ];
    }
}
