<div class="fixed top-4 right-4 z-50 space-y-3">
    @foreach (Alert::getMessages() as $type => $messages)
        @foreach ($messages as $message)
            @php
                $alertClass = match ($type) {
                    'danger' => 'bg-red-900/80 border-red-700 text-red-200',
                    'success' => 'bg-green-900/80 border-green-700 text-green-200',
                    default => 'bg-blue-900/80 border-blue-700 text-blue-200',
                };

                $iconClass = match ($type) {
                    'danger' => 'fas fa-times-circle text-red-300',
                    'success' => 'fas fa-check-circle text-green-300',
                    default => 'fas fa-info-circle text-blue-300',
                };
            @endphp
            <div class="w-72 border px-4 py-3 rounded-xl shadow-lg backdrop-blur-md animate-fade-in-up {{ $alertClass }}">
                <div class="flex items-start space-x-2">
                    <i class="{{ $iconClass }} mt-1 text-sm"></i>
                    <div class="text-sm">{{ $message }}</div>
                </div>
            </div>
        @endforeach
    @endforeach
</div>