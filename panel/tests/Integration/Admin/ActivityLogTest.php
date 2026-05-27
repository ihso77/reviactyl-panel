<?php

namespace Tests\Integration\Admin;

use App\Models\Node;
use App\Models\User;
use Livewire\Livewire;
use App\Models\Location;
use App\Models\ActivityLog;
use Tests\Integration\IntegrationTestCase;
use App\Filament\Resources\ActivityLogResource;
use App\Filament\Resources\Nodes\Pages\CreateNode;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ActivityLogTest extends IntegrationTestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Test that creating a server generates an activity log.
     */
    public function testServerCreationGeneratesLog()
    {
        $admin = User::factory()->create(['root_admin' => 1]);
        $this->actingAs($admin);

        $location = Location::factory()->create();

        Livewire::test(CreateNode::class)
            ->fillForm([
                'name' => 'Test Node',
                'location_id' => $location->id,
                'fqdn' => 'node.test.com',
                'scheme' => false,
                'memory' => 1024,
                'memory_overallocate' => 0,
                'disk' => 1024,
                'disk_overallocate' => 0,
                'upload_size' => 100,
                'daemonSFTP' => 2022,
                'daemonListen' => 8080,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertDatabaseHas('activity_logs', [
            'event' => 'node:create',
        ]);

        $node = Node::query()->where('name', 'Test Node')->first();
        $this->assertNotNull($node);

        $log = ActivityLog::query()->where('event', 'node:create')->orderByDesc('timestamp')->first();
        $this->assertNotNull($log);
        $this->assertEquals('Test Node', $log->subjects->first()?->subject?->name);

    }

    /**
     * Test that the admin index page loads and shows activity logs.
     */
    public function testAdminIndexShowsLogs()
    {
        $admin = User::factory()->create(['root_admin' => 1]);
        $this->actingAs($admin);

        $log = new ActivityLog();
        $log->timestamp = now();
        $log->event = 'test:event';
        $log->ip = '127.0.0.1';
        $log->actor_id = $admin->id;
        $log->actor_type = User::class;
        $log->properties = collect();
        $log->save();

        $response = $this->get(ActivityLogResource::getUrl('index'));
        $response->assertStatus(200);
        $response->assertSee('test:event');
    }
}
