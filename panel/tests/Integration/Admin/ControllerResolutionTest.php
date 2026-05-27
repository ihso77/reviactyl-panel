<?php

namespace Tests\Integration\Admin;

use Tests\Integration\IntegrationTestCase;
use App\Services\Nodes\NodeCreationService;
use App\Services\Activity\ActivityLogService;

class ControllerResolutionTest extends IntegrationTestCase
{
    public function testActivityLogServiceResolves()
    {
        $service = $this->app->make(ActivityLogService::class);
        $this->assertNotNull($service);
    }

    public function testNodeCreationServiceResolves()
    {
        $service = $this->app->make(NodeCreationService::class);
        $this->assertNotNull($service);
    }
}
