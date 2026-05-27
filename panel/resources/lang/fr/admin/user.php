<?php

return [
    'title' => 'User',
    'exceptions' => [
        'delete_self' => 'Vous ne pouvez pas supprimer votre propre compte.',
        'user_has_servers' => 'Impossible de supprimer un utilisateur dont le compte est associé à des serveurs actifs. Veuillez supprimer ses serveurs avant de continuer.',
    ],
    'notices' => [
        'account_created' => 'Le compte a été créé avec succès.',
        'account_updated' => 'Le compte a été mis à jour avec succès.',
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
