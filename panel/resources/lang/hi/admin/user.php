<?php

return [
    'title' => 'User',
    'exceptions' => [
        'delete_self' => 'आप अपना स्वयं का खाता नहीं हटा सकते।',
        'user_has_servers' => 'सक्रिय सर्वर वाले उपयोगकर्ता को हटाया नहीं जा सकता। कृपया जारी रखने से पहले उनके सर्वर हटाएं।',
    ],
    'notices' => [
        'account_created' => 'खाता सफलतापूर्वक बनाया गया है।',
        'account_updated' => 'खाता सफलतापूर्वक अपडेट किया गया है।',
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
