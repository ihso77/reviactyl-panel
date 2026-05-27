<?php

return [

    'label' => 'Mount',
    'plural_label' => 'Mounts',

    'sections' => [
        'configuration' => 'Mount Configuration',
    ],

    'fields' => [
        'name' => 'Nom',
        'description' => 'Description',
        'source' => 'Chemin Source',
        'target' => 'Chemin Cible',
        'read_only' => 'Lecture seule',
        'user_mountable' => 'User Mountable',
    ],

    'helpers' => [
        'name' => 'A unique name used to separate this mount from another.',
        'description' => 'A longer, human-readable description of this mount.',
        'source' => 'The file path on the host machine to mount to containers.',
        'target' => 'The path inside the container to mount this as.',
        'read_only' => 'If set, the mount will be read-only inside the container.',
        'user_mountable' => 'If set, users will be able to mount this to their servers.',
    ],

    'columns' => [
        'id' => 'ID',
        'name' => 'Nom',
        'source' => 'Source',
        'target' => 'Cible',
        'read_only' => 'Lecture seule',
        'user_mountable' => 'User Mountable',
    ],

    'actions' => [
        'attach_egg' => 'Attach Egg',
        'attach_node' => 'Attach Node',
    ],

];
