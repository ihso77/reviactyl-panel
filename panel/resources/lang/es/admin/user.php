<?php

return [
    'title' => 'User',
    'exceptions' => [
        'delete_self' => 'No puedes eliminar tu propia cuenta.',
        'user_has_servers' => 'No se puede eliminar un usuario con servidores activos vinculados a su cuenta. Por favor elimina sus servidores antes de continuar.',
    ],
    'notices' => [
        'account_created' => 'La cuenta ha sido creada exitosamente.',
        'account_updated' => 'La cuenta ha sido actualizada exitosamente.',
    ],
    'details' => [
        'account_details' => 'Account Details',
        'external_id' => 'External ID',
        'username' => 'Username',
        'email' => 'Email Address',
        'first_name' => 'First Name',
        'last_name' => 'Last Name',
        'language' => 'Language',
        'geolocate' => 'Geolocate (Automatic)',
        'password' => 'Password',
        'password_confirmation' => 'Confirm Password',
        'root_admin' => 'Root Administrator',
        'root_admin_desc' => 'This user will have full access to all servers and settings on the system.',
        'privileges' => 'Privileges',
        'admin_status' => 'Admin Status',
    ],
];
