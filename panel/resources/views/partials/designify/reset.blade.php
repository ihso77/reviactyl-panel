<form id="resetForm" action="{{ route('designify.reset') }}" method="POST">
    @csrf
    <button type="button"
        onclick="openModal('resetModal')"
        class="group relative flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-red-800/50 border border-red-700 text-red-400 hover:bg-red-700/50 hover:text-red-300 transition-all duration-200">

        <x-heroicon-o-trash class="w-5 h-5"/>

    </button>
</form>
<x-designify.modal id="resetModal" title="Reset settings?" variant="danger">
    Are you sure you want to reset Reviactyl settings to default? This action cannot be undone.
    <x-slot name="footer">
        <button onclick="closeModal('resetModal')"
            class="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
            Cancel
        </button>
        <button onclick="document.getElementById('resetForm').submit()"
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white">
            Confirm
        </button>
    </x-slot>
</x-designify.modal>
