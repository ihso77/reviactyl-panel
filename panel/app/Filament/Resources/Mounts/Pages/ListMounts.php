<?php

namespace App\Filament\Resources\Mounts\Pages;

use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\Mounts\MountResource;

class ListMounts extends ListRecords
{
    protected static string $resource = MountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\CreateAction::make(),
        ];
    }
}
