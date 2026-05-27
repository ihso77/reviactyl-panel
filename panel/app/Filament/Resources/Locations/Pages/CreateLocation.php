<?php

namespace App\Filament\Resources\Locations\Pages;

use Filament\Resources\Pages\CreateRecord;
use App\Filament\Resources\Locations\LocationResource;

class CreateLocation extends CreateRecord
{
    protected static string $resource = LocationResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
