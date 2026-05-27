<?php

return [
    'label' => 'Sunucu',
    'plural-label' => 'Sunucular',

    'sections' => [
        'identity' => [
            'title' => 'Kimlik',
            'description' => 'Temel sunucu bilgileri ve sahiplik.',
        ],
        'allocation' => [
            'title' => 'Tahsis',
            'description' => 'Bu sunucu için düğüm ve ağ tahsisini seçin.',
        ],
        'startup' => [
            'title' => 'Başlangıç',
            'description' => 'Egg, başlangıç komutu ve Docker görüntüsünü yapılandırın.',
        ],
        'resources' => [
            'title' => 'Kaynak Sınırları',
            'description' => 'Sunucu kaynak sınırlarını tanımlayın.',
        ],
        'feature_limits' => [
            'title' => 'Özellik Sınırları',
            'description' => 'Veritabanlarını, tahsisleri ve yedekleri sınırlayın.',
        ],
        'environment' => [
            'title' => 'Ortam Değişkenleri',
            'description' => 'Seçilen egg için ortam değerlerini ayarlayın.',
        ],
    ],

    'fields' => [
        'advanced_mode' => [
            'label' => 'Gelişmiş Mod',
            'helper' => 'Ek sunucu yapılandırma seçeneklerini göstermek için geçiş yapın. Sadece ek ayarların sonuçlarını anlıyorsanız açın.',
        ],
        'external_id' => [
            'label' => 'Harici Kimlik',
            'helper' => 'Bu sunucu için isteğe bağlı benzersiz tanımlayıcı.',
        ],
        'owner' => [
            'label' => 'Sahip',
            'helper' => 'Bu sunucuya sahip olan kullanıcıyı seçin.',
        ],
        'name' => [
            'label' => 'İsim',
            'placeholder' => 'Sunucu İsmi',
            'helper' => 'Bu sunucu için kısa bir isim.',
        ],
        'description' => [
            'label' => 'Açıklama',
            'placeholder' => 'Sunucu açıklaması',
            'helper' => 'Bu sunucu için isteğe bağlı açıklama.',
        ],
        'node' => [
            'label' => 'Düğüm',
            'helper' => 'Bu sunucunun dağıtılacağı düğüm.',
        ],
        'allocation' => [
            'label' => 'Birincil Tahsis',
            'helper' => 'Bu sunucu için varsayılan IP/port tahsisi.',
        ],
        'additional_allocations' => [
            'label' => 'Ek Tahsisler',
            'helper' => 'Atanacak isteğe bağlı ekstra tahsisler.',
        ],
        'nest' => [
            'label' => 'Nest',
            'helper' => 'Bu sunucu için hizmet nest\'i.',
        ],
        'egg' => [
            'label' => 'Egg',
            'helper' => 'Sunucu davranışını tanımlayan egg.',
        ],
        'startup' => [
            'label' => 'Başlangıç Komutu',
            'helper' => 'Sunucu için başlangıç komutu.',
        ],
        'image' => [
            'label' => 'Docker Görüntüsü',
            'placeholder' => 'e.g. ghcr.io/reviactyl/images:java_17',
            'helper' => 'Bu sunucuyu çalıştırmak için kullanılan Docker görüntüsü.',
            'custom' => 'Özel',
        ],
        'skip_scripts' => [
            'label' => 'Egg Komut Dosyalarını Atla',
            'helper' => 'Oluşturma sırasında egg kurulum komut dosyalarını atla.',
        ],
        'start_on_completion' => [
            'label' => 'Tamamlandığında Başlat',
            'helper' => 'Kurulumdan sonra sunucuyu otomatik olarak başlat.',
        ],
        'memory' => [
            'label' => 'Bellek',
            'helper' => 'Toplam bellek tahsisi. Sınırsız için 0 olarak ayarlayın. (Sınırsız Bellek, Başlangıç Komutu nedeniyle Minecraft Egg`lerinde çalışmaz)',
        ],
        'swap' => [
            'label' => 'Takas (Swap)',
            'helper' => 'Takas belleği tahsisi. Takası devre dışı bırakmak için 0 veya sınırsız takasa izin vermek için -1 olarak ayarlayın.',
        ],
        'disk' => [
            'label' => 'Disk',
            'helper' => 'Disk alanı tahsisi. Sınırsız için 0 olarak ayarlayın.',
        ],
        'io' => [
            'label' => 'IO Ağırlığı',
            'helper' => 'Göreceli disk G/Ç önceliği (10-1000).',
        ],
        'cpu' => [
            'label' => 'CPU',
            'helper' => 'Yüzde cinsinden CPU sınırı. %100 bir tam çekirdek anlamına gelir, %200 iki tam çekirdek anlmaına gelir vb.',
        ],
        'enter_size_in_gib' => [
            'label' => 'Boyutu GiB Cinsinden Girin',
            'helper' => '"GiB" son ekini kullanarak boyutları GiB cinsinden girebilirsiniz (örn. 10GiB = 10240MiB).',
        ],
        'threads' => [
            'label' => 'CPU İş Parçacıkları',
            'helper' => 'İsteğe bağlı iş parçacığı sabitleme. Örnek: 0-1,3.',
        ],
        'oom_disabled' => [
            'label' => 'OOM Killer`ı Devre Dışı Bırak',
            'helper' => 'Bellek tükendiğinde çekirdeğin işlemi sonlandırmasını önleyin.',
        ],
        'database_limit' => [
            'label' => 'Veritabanı Sınırı',
            'helper' => 'Maksimum veritabanı sayısı.',
        ],
        'allocation_limit' => [
            'label' => 'Tahsis Sınırı',
            'helper' => 'Maksimum tahsis sayısı.',
        ],
        'backup_limit' => [
            'label' => 'Yedek Sınırı',
            'helper' => 'Maksimum yedek sayısı.',
        ],
        'environment' => [
            'key' => 'Değişken',
            'value' => 'Değer',
            'helper' => 'Bu egg için ortam değişkenleri.',
        ],
        'use_custom_image' => [
            'label' => 'Özel Görüntü Kullan',
            'helper' => 'Egg tarafından sağlanan yerine özel bir Docker görüntüsü kullanmak için geçiş yapın.',
        ],
    ],

    'table' => [
        'id' => 'KİMLİK',
        'name' => 'İsim',
        'owner' => 'Sahip',
        'node' => 'Düğüm',
        'allocation' => 'Tahsis',
        'status' => 'Durum',
        'egg' => 'Egg',
        'memory' => 'Bellek',
        'disk' => 'Disk',
        'cpu' => 'CPU',
        'created' => 'Oluşturuldu',
        'updated' => 'Güncellendi',
        'installed' => 'Kuruldu',
        'no_status' => 'Durum Yok',
    ],

    'messages' => [
        'created' => 'Sunucu başarıyla oluşturuldu.',
        'updated' => 'Sunucu başarıyla güncellendi.',
        'deleted' => 'Sunucu başarıyla silindi.',
    ],

    'actions' => [
        'edit' => 'Düzenle',
        'toggle_install_status' => 'Kurulum Durumunu Değiştir',
        'suspend' => 'Askıya Al',
        'unsuspend' => 'Askıdan Al',
        'suspended' => 'Askıya Alındı',
        'unsuspended' => 'Askıdan Alındı',
        'reinstall' => 'Yeniden Kur',
        'delete' => 'Sil',
        'delete_forcibly' => 'Zorla Sil',
        'view' => 'Görüntüle',
    ],

    'exceptions' => [
        'no_new_default_allocation' => 'Bu sunucu için varsayılan tahsisi silmeye çalışıyorsunuz ancak kullanılabilecek yedek bir tahsis yok.',
        'marked_as_failed' => 'Bu sunucu önceki bir kurulumda başarısız olarak işaretlendi. Bu durumda durum değiştirilemez.',
        'bad_variable' => ':name değişkeni ile ilgili bir doğrulama hatası oluştu.',
        'daemon_exception' => 'Daemon ile iletişim kurulurken bir istisna oluştu ve HTTP/:code yanıt kodu alındı. Bu istisna günlüğe kaydedildi. (istek kimliği: :request_id)',
        'default_allocation_not_found' => 'İstenen varsayılan tahsis bu sunucunun tahsisleri arasında bulunamadı.',
    ],

    'alerts' => [
        'install_toggled' => 'Bu sunucu için kurulum durumu değiştirildi.',
        'server_suspended' => 'Sunucu durumu değiştirildi: :action.',
        'server_reinstalled' => 'Bu sunucu şuan başlayan bir yeniden kurulum için sıraya alındı.',
        'server_deleted' => 'Sunucu başarıyla sistemden silindi.',
        'server_delete_failed' => 'Sunucu silinemedi.',
        'startup_changed' => 'Bu sunucu için başlangıç yapılandırması güncellendi. Bu sunucunun nest veya egg\'i değiştirildiyse, şu anda bir yeniden kurulum gerçekleşecektir.',
        'server_created' => 'Sunucu panelde başarıyla oluşturuldu. Lütfen daemon\'ın bu sunucuyu tamamen kurması için birkaç dakika bekleyin.',
        'build_updated' => 'Bu sunucu için yapı detayları güncellendi. Bazı değişikliklerin etkili olması için yeniden başlatma gerekebilir.',
        'suspension_toggled' => 'Sunucu askıya alma durumu :status olarak değiştirildi.',
        'rebuild_on_boot' => 'Bu sunucu bir Docker Konteyneri yeniden oluşturması gerektirecek şekilde işaretlendi. Bu işlem sunucu bir sonraki başlatıldığında gerçekleşecektir.',
        'details_updated' => 'Sunucu detayları başarıyla güncellendi.',
        'docker_image_updated' => 'Bu sunucu için kullanılacak varsayılan Docker görüntüsü başarıyla değiştirildi. Bu değişikliği uygulamak için yeniden başlatma gereklidir.',
        'node_required' => 'Bu panele bir sunucu ekleyebilmeniz için önce en az bir düğüm yapılandırmış olmanız gerekir.',
        'transfer_nodes_required' => 'Sunucuları transfer edebilmeniz için önce en az iki düğüm yapılandırmış olmanız gerekir.',
        'transfer_started' => 'Sunucu transferi başlatıldı.',
        'transfer_not_viable' => 'Seçtiğiniz düğüm, bu sunucuyu barındırmak için gereken disk alanına veya belleğe sahip değil.',
    ],
];
