<!DOCTYPE html>
<html class="dark">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Designify - @yield('title')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="_token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" href="/reviactyl/designify.png">
    <meta name="msapplication-config" content="/favicons/browserconfig.xml">

    @include('layouts.scripts')

    @section('scripts')
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
    @show
</head>

<body id="app" class="antialiased bg-zinc-900">
    <x-designify.header />
    <main>
        <div class="lg:hidden px-4 py-12 mx-auto max-w-lg text-lg text-center text-white">
            Unfortunately, not optimized for mobile devices ;(
        </div>
        <div class="hidden lg:block">
            <div class="flex h-[calc(100vh-6rem)] px-6 mb-16">
                <x-designify.sidebar>
                    @yield('content')
                </x-designify.sidebar>
                <x-designify.preview />
            </div>
        </div>
    </main>
    <x-designify.alerts />
    <x-designify.scripts />
</body>
</html>