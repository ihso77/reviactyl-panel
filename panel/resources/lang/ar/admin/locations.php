<?php

return [

    'label' => 'الموقع',
    'plural-label' => 'المواقع',

    'section' => [
        'title' => 'تفاصيل الموقع',
        'description' => 'حدد موقعا يمكن تعيين العقد إليه.',
    ],

    'fields' => [
        'short' => [
            'label' => 'رمز قصير',
            'placeholder' => 'us.nyc.1',
            'helper' => 'معرف قصير لهذا الموقع.',
        ],

        'long' => [
            'label' => 'الوصف',
            'placeholder' => 'مدينة نيويورك، نيويورك، الولايات المتحدة الأمريكية',
            'helper' => 'وصف أطول لهذا الموقع.',
        ],
    ],

    'table' => [
        'id' => 'المعرف',
        'short' => 'رمز قصير',
        'long' => 'الوصف',
        'nodes' => 'العقد',
        'servers' => 'الخوادم',
        'created' => 'تاريخ الإنشاء',
    ],

    'actions' => [
        'edit' => 'تعديل',
        'delete' => 'حذف',
    ],

    'messages' => [
        'cannot_delete_with_nodes' => 'لا يمكن حذف الموقع إذا كان مرتبطا بعقد.',
    ],

];
