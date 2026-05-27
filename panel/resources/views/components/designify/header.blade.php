<header class="relative z-10">
   <nav class="mx-auto flex items-center justify-between p-6">
      <div class="flex lg:flex-1">
         <a href="/" class="font-bold text-white flex items-center gap-2">
            <div class="flex flex-col">
               <span class="font-bold text-lg md:text-xl bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
               Designify
               </span>
               <span class="text-xs text-zinc-400 -mt-1 hidden md:block">
               Release v{{ config('app.version') }}
               </span>
            </div>
         </a>
      </div>
      <div class="flex lg:hidden">
         <a href="/admin" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-400">
            <x-heroicon-m-computer-desktop class="h-4 w-4"/>
         </a>
      </div>
      <div class="hidden items-center lg:flex lg:gap-x-12">
         <a href="{{ route('index') }}/admin"
            class="text-sm font-semibold text-white relative px-2 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm">
         Return to Admin Dashboard
         </a>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-2">
         @include('partials.designify.reset')
         <a href="{{ route('account') }}"
            class="flex items-center space-x-2 md:space-x-3 px-2 md:px-4 py-1.5 md:py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 rounded-lg transition-all duration-200 group">
            <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160"
               class="h-6 w-6 md:h-8 md:w-8 rounded-full ring-2 ring-zinc-600 group-hover:ring-sky-500">
            <div class="flex flex-col hidden md:block">
               <span class="text-sm font-medium text-zinc-200">
               {{ Auth::user()->name_first }} {{ Auth::user()->name_last }}
               </span>
            </div>
         </a>
      </div>
   </nav>
</header>