@extends('layouts.designify', ['sideEditor' => true])

@section('title')
    Sidebar Buttons
@endsection

@section('content')
    @php
        $configuredButtons = config('designify.sidebarButtons');

        if (is_string($configuredButtons)) {
            $decodedButtons = json_decode($configuredButtons, true);
            $configuredButtons = is_array($decodedButtons) ? $decodedButtons : [];
        }

        if (!is_array($configuredButtons)) {
            $configuredButtons = [];
        }
    @endphp

    <form id="designifyEditor" action="" method="POST" class="h-full flex flex-col">
        @csrf
        @method('PATCH')
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-white mb-2">Sidebar buttons</h1>
            <p class="text-zinc-400 text-sm">Add custom quick links next to the dashboard button (for example PhpMyAdmin).</p>
        </div>
        <div class="flex-1 space-y-6">
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Buttons
                    </label>
                    <button id="add-sidebar-button" type="button"
                        class="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg transition-colors duration-200">
                        Add Button
                    </button>
                </div>

                <div id="sidebar-buttons-list" class="space-y-4"></div>
                <p class="text-xs text-zinc-500">Use absolute URLs or relative paths like <code>/admin</code>. Leave empty entries will be ignored.</p>
            </div>
        </div>
    </form>

    <script>
        (() => {
            const buttonsList = document.getElementById('sidebar-buttons-list');
            const addButton = document.getElementById('add-sidebar-button');
            let buttons = @json(old('sidebar_buttons', $configuredButtons));

            const escapeHtml = (value) => {
                const div = document.createElement('div');
                div.textContent = value;
                return div.innerHTML;
            };

            const normalizeButton = (button) => ({
                label: button && typeof button.label === 'string' ? button.label : '',
                url: button && typeof button.url === 'string' ? button.url : '',
                newTab: button && (button.newTab === true || button.newTab === 1 || button.newTab === '1'),
            });

            const render = () => {
                if (!Array.isArray(buttons)) {
                    buttons = [];
                }

                buttons = buttons.map(normalizeButton);

                if (buttons.length === 0) {
                    buttons.push({
                        label: '',
                        url: '',
                        newTab: false,
                    });
                }

                buttonsList.innerHTML = buttons.map((button, index) => `
                    <div class="p-4 bg-zinc-800/40 border border-zinc-700 rounded-xl space-y-3" data-index="${index}">
                        <div class="flex items-center justify-between gap-3">
                            <h3 class="text-sm text-zinc-200 font-medium">Button #${index + 1}</h3>
                            <button type="button" class="remove-sidebar-button px-2 py-1 text-xs bg-red-900/30 border border-red-700 text-red-300 rounded-lg hover:bg-red-800/40 disabled:opacity-50 disabled:cursor-not-allowed" data-index="${index}" ${buttons.length === 1 ? 'disabled' : ''}>
                                Remove
                            </button>
                        </div>
                        <input
                            type="text"
                            name="sidebar_buttons[${index}][label]"
                            class="sidebar-button-label w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Label (e.g. PhpMyAdmin)"
                            value="${escapeHtml(button.label)}"
                        />
                        <input
                            type="text"
                            name="sidebar_buttons[${index}][url]"
                            class="sidebar-button-url w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="URL (e.g. /admin or https://example.com/phpmyadmin)"
                            value="${escapeHtml(button.url)}"
                        />
                        <select
                            name="sidebar_buttons[${index}][newTab]"
                            class="sidebar-button-new-tab w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="0" ${button.newTab ? '' : 'selected'}>Open in same tab</option>
                            <option value="1" ${button.newTab ? 'selected' : ''}>Open in new tab</option>
                        </select>
                    </div>
                `).join('');
            };

            addButton.addEventListener('click', () => {
                buttons.push({
                    label: '',
                    url: '',
                    newTab: false,
                });
                render();
            });

            buttonsList.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement) || !target.classList.contains('remove-sidebar-button')) {
                    return;
                }

                const index = Number(target.dataset.index);
                if (Number.isNaN(index)) {
                    return;
                }

                buttons.splice(index, 1);
                render();
            });

            const handleFieldChange = (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
                    return;
                }

                const wrapper = target.closest('[data-index]');
                if (!(wrapper instanceof HTMLElement)) {
                    return;
                }

                const index = Number(wrapper.dataset.index);
                if (Number.isNaN(index) || !buttons[index]) {
                    return;
                }

                if (target.classList.contains('sidebar-button-label')) {
                    buttons[index].label = target.value;
                }

                if (target.classList.contains('sidebar-button-url')) {
                    buttons[index].url = target.value;
                }

                if (target.classList.contains('sidebar-button-new-tab')) {
                    buttons[index].newTab = target.value === '1';
                }
            };

            buttonsList.addEventListener('input', handleFieldChange);
            buttonsList.addEventListener('change', handleFieldChange);
            render();
        })();
    </script>
@endsection
