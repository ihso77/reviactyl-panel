<?php

namespace App\Http\Middleware;

use App\Models\Extension;
use Illuminate\Http\Request;
use App\Services\Extensions\ExtensionFilesystemService;

class ConfigureExtensionFilesystem
{
    public function handle(Request $request, \Closure $next, string $identifier)
    {
        $extension = Extension::query()->where('identifier', $identifier)->first();

        if ($extension !== null) {
            app(ExtensionFilesystemService::class)->configurePlaceholderDisks(
                $extension->identifier,
                $extension->install_path
            );
        }

        return $next($request);
    }
}
