<aside class="w-80 mr-4 flex flex-col text-white">
   <div class="flex items-center space-x-1 bg-zinc-800 p-1 rounded-lg border border-zinc-700">
      <x-designify.tab-button
         :route="route('designify.general')"
         icon="fa-solid fa-bolt"
         label="General Options"
         :active="Route::currentRouteName() === 'designify.general'" />
      <x-designify.tab-button
         :route="route('designify.colors')"
         icon="fa-solid fa-palette"
         label="Color Options"
         :active="str_starts_with(Route::currentRouteName(),'designify.colors')" />
      <x-designify.tab-button
         :route="route('designify.looks')"
         icon="fa-solid fa-swatchbook"
         label="Look 'N Feel"
         :active="str_starts_with(Route::currentRouteName(),'designify.looks')" />
      <x-designify.tab-button
         :route="route('designify.alerts')"
         icon="fa-solid fa-bullhorn"
         label="Alerts"
         :active="str_starts_with(Route::currentRouteName(),'designify.alerts')" />
      <x-designify.tab-button
         :route="route('designify.site')"
         icon="fa-solid fa-gear"
         label="Site Meta Settings"
         :active="str_starts_with(Route::currentRouteName(),'designify.site')" />
      <x-designify.tab-button
         :route="route('designify.errors')"
         icon="fa-solid fa-triangle-exclamation"
         label="Error Pages"
         :active="str_starts_with(Route::currentRouteName(),'designify.errors')" />
      <x-designify.tab-button
         :route="route('designify.sidebar-buttons')"
         icon="fa-solid fa-link"
         label="Sidebar Buttons"
         :active="str_starts_with(Route::currentRouteName(),'designify.sidebar-buttons')" />
      @include('partials.designify.save')
   </div>
   <div class="flex-1 overflow-y-auto mt-2 pr-1 text-white p-1">
      @if($errors->any())
      <div class="mb-4 bg-blue-900/20 border border-blue-800 text-blue-300 px-4 py-3 rounded-xl">
         <ul>
            @foreach($errors->all() as $error)
            <li>{{ $error }}</li>
            @endforeach
         </ul>
      </div>
      @endif
      {{ $slot }}
   </div>
</aside>
