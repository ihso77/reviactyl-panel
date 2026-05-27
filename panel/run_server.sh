#!/bin/bash
export PATH=/home/z/local/php83/bin:/home/z/local/bin:$PATH
export LD_LIBRARY_PATH=/home/z/local/lib:$LD_LIBRARY_PATH
cd /home/z/my-project/panel

while true; do
    php -S 0.0.0.0:8080 -t public public/index.php 2>>/tmp/panel_error.log
    echo "Server crashed, restarting in 1s..." >> /tmp/panel_error.log
    sleep 1
done
