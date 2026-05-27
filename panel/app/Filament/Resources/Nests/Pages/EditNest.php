<?php

namespace App\Filament\Resources\Nests\Pages;

use Filament\Resources\Pages\EditRecord;
use App\Filament\Resources\Nests\NestResource;

class EditNest extends EditRecord
{
    protected static string $resource = NestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\DeleteAction::make(),
        ];
    }
}
