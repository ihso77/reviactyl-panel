@props([
'route',
'icon',
'label',
'active' => false
])
<a href="{{ $route }}"
   class="{{ $active ? 'bg-sky-600/30 border border-sky-500/30 ring-2 ring-sky-500' : '' }}
   group relative flex items-center justify-center h-12 w-12 rounded-xl
   text-sky-500 hover:bg-sky-600/30 hover:text-sky-300 transition-all duration-200">
<i class="{{ $icon }}"></i>
<span class="absolute top-full ml-2 px-2 py-1 bg-zinc-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap hidden md:block">
{{ $label }}
</span>
</a>