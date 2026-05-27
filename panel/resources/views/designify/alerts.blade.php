@extends('layouts.designify', ['sideEditor' => true])

@section('title')
    Alert Settings
@endsection

@section('content')
    @php
        $fallbackMessage = '**Welcome to Reviactyl!** You can modify Theme Look & Feel using [Designify](/admin/designify) at the administration area.';
        $configuredAlerts = config('designify.alerts');

        if (is_string($configuredAlerts)) {
            $decodedAlerts = json_decode($configuredAlerts, true);
            $configuredAlerts = is_array($decodedAlerts) ? $decodedAlerts : [];
        }

        if (!is_array($configuredAlerts) || empty($configuredAlerts)) {
            $configuredAlerts = [[
                'type' => config('designify.alertType', 'info'),
                'message' => config('designify.alertMessage', $fallbackMessage),
            ]];
        }
    @endphp

    <form id="designifyEditor" action="" method="POST" class="h-full flex flex-col">
        @csrf
        @method('PATCH')
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-white mb-2">Alert settings</h1>
            <p class="text-zinc-400 text-sm">Create one or more alerts with custom type and message.</p>
        </div>
        <div class="flex-1 space-y-6">
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Alerts
                    </label>
                    <button id="add-alert" type="button"
                        class="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg transition-colors duration-200">
                        Add Alert
                    </button>
                </div>

                <div id="alerts-list" class="space-y-4"></div>
                <input type="hidden" name="designify:alerts" id="designify:alerts" value="">
            </div>
        </div>
    </form>

    <script>
        (() => {
            const alertsList = document.getElementById('alerts-list');
            const addAlertButton = document.getElementById('add-alert');
            const hiddenAlertsField = document.getElementById('designify:alerts');
            const form = document.getElementById('designifyEditor');
            const validTypes = ['info', 'announcement', 'success', 'warning', 'danger', 'disabled'];
            let alerts = @json(old('alerts', $configuredAlerts));

            const escapeHtml = (value) => {
                const div = document.createElement('div');
                div.textContent = value;
                return div.innerHTML;
            };

            const normalizeType = (type) => (validTypes.includes(type) ? type : 'info');

            const normalizeAlert = (alert) => ({
                type: normalizeType(alert && typeof alert.type === 'string' ? alert.type : 'info'),
                message: alert && typeof alert.message === 'string' ? alert.message : '',
            });

            const serializeAlerts = () => {
                hiddenAlertsField.value = JSON.stringify(alerts.map(normalizeAlert));
            };

            const typeOptions = (selectedType) => validTypes.map((type) => `
                <option value="${type}" ${selectedType === type ? 'selected' : ''}>
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
            `).join('');

            const render = () => {
                if (!Array.isArray(alerts)) {
                    alerts = [];
                }

                alerts = alerts.map(normalizeAlert);

                if (alerts.length === 0) {
                    alerts.push({ type: 'info', message: '' });
                }

                alertsList.innerHTML = alerts.map((alert, index) => `
                    <div class="p-4 bg-zinc-800/40 border border-zinc-700 rounded-xl space-y-3" data-index="${index}">
                        <div class="flex items-center justify-between gap-3">
                            <h3 class="text-sm text-zinc-200 font-medium">Alert #${index + 1}</h3>
                            <button type="button" class="remove-alert px-2 py-1 text-xs bg-red-900/30 border border-red-700 text-red-300 rounded-lg hover:bg-red-800/40 disabled:opacity-50 disabled:cursor-not-allowed" data-index="${index}" ${alerts.length === 1 ? 'disabled' : ''}>
                                Remove
                            </button>
                        </div>
                        <select name="alerts[${index}][type]" class="alert-type w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            ${typeOptions(alert.type)}
                        </select>
                        <input
                            type="text"
                            name="alerts[${index}][message]"
                            class="alert-message w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="**bold** [link](https://reviactyl.dev)"
                            value="${escapeHtml(alert.message)}"
                        />
                    </div>
                `).join('');

                serializeAlerts();
            };

            addAlertButton.addEventListener('click', () => {
                alerts.push({ type: 'info', message: '' });
                render();
            });

            alertsList.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement) || !target.classList.contains('remove-alert')) {
                    return;
                }

                const index = Number(target.dataset.index);
                if (Number.isNaN(index)) {
                    return;
                }

                alerts.splice(index, 1);
                render();
            });

            const handleAlertFieldChange = (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
                    return;
                }

                const wrapper = target.closest('[data-index]');
                if (!(wrapper instanceof HTMLElement)) {
                    return;
                }

                const index = Number(wrapper.dataset.index);
                if (Number.isNaN(index) || !alerts[index]) {
                    return;
                }

                if (target.classList.contains('alert-type')) {
                    alerts[index].type = normalizeType(target.value);
                }

                if (target.classList.contains('alert-message')) {
                    alerts[index].message = target.value;
                }

                serializeAlerts();
            };

            alertsList.addEventListener('input', handleAlertFieldChange);
            alertsList.addEventListener('change', handleAlertFieldChange);

            form.addEventListener('submit', serializeAlerts);
            render();
        })();
    </script>
@endsection
