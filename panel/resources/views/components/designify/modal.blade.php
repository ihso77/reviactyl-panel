@props([
'id',
'title' => 'Confirm',
'variant' => 'danger',
])

@php
    $variants = [
        'danger' => [
            'iconBg' => 'bg-red-500/15',
            'iconColor' => 'text-red-500',
            'button' => 'bg-red-600 hover:bg-red-500 text-white',
            'icon' => 'heroicon-o-exclamation-triangle',
        ],
        'success' => [
            'iconBg' => 'bg-emerald-500/15',
            'iconColor' => 'text-emerald-400',
            'button' => 'bg-emerald-600 hover:bg-emerald-500 text-white',
            'icon' => 'heroicon-o-check-circle',
        ],
    ];

    $v = $variants[$variant] ?? $variants['danger'];
@endphp

<div id="{{ $id }}"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 opacity-0">
    <div
        class="modal-panel bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-8 border border-zinc-800 transform transition-all duration-200 scale-95 opacity-0 text-center">
        <div class="mx-auto mb-5 flex items-center justify-center w-14 h-14 rounded-full {{ $v['iconBg'] }}">
            <x-dynamic-component :component="$v['icon']" class="w-7 h-7 {{ $v['iconColor'] }}" />
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">
            {{ $title }}
        </h2>
        <div class="text-zinc-400 mb-6">
            {{ $slot }}
        </div>
        <div class="flex gap-3">
            {{ $footer }}
        </div>
    </div>
</div>
