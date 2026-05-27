#!/bin/bash
cd /home/z/my-project/panel
export PATH=/home/z/local/php83/bin:/home/z/local/bin:$PATH
export LD_LIBRARY_PATH=/home/z/local/lib:$LD_LIBRARY_PATH

echo "============================================"
echo "  Reviactyl Panel v26"
echo "============================================"
echo ""
echo "  URL:    http://localhost:8080"
echo "  Email:  admin@example.com"
echo "  Pass:   password123"
echo ""
echo "============================================"
echo ""

pkill -f "artisan serve" 2>/dev/null
sleep 1

exec /home/z/local/php83/bin/php artisan serve --host=0.0.0.0 --port=8080
