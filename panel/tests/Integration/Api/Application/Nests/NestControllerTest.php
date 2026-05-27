<?php

namespace Tests\Integration\Api\Application\Nests;

use Illuminate\Http\Response;
use App\Contracts\Repository\NestRepositoryInterface;
use App\Transformers\Api\Application\NestTransformer;
use Tests\Integration\Api\Application\ApplicationApiIntegrationTestCase;

class NestControllerTest extends ApplicationApiIntegrationTestCase
{
    private NestRepositoryInterface $repository;

    /**
     * Setup tests.
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->repository = $this->app->make(NestRepositoryInterface::class);
    }

    /**
     * Test that the expected nests are returned by the request.
     */
    public function testNestResponse()
    {
        \App\Models\Nest::factory()->count(2)->create();

        /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Nest> $nests */
        $nests = $this->repository->all();

        $response = $this->getJson('/api/application/nests');
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonCount(count($nests), 'data');
        $response->assertJsonStructure([
            'object',
            'data' => [['object', 'attributes' => ['id', 'uuid', 'author', 'name', 'description', 'created_at', 'updated_at']]],
            'meta' => ['pagination' => ['total', 'count', 'per_page', 'current_page', 'total_pages']],
        ]);

        $response->assertJson([
            'object' => 'list',
            'data' => [],
            'meta' => [
                'pagination' => [
                    'total' => count($nests),
                    'count' => count($nests),
                    'per_page' => 50,
                    'current_page' => 1,
                    'total_pages' => 1,
                ],
            ],
        ]);

        foreach ($nests as $nest) {
            $response->assertJsonFragment([
                'object' => 'nest',
                'attributes' => $this->getTransformer(NestTransformer::class)->transform($nest),
            ]);
        }
    }

    /**
     * Test that getting a single nest returns the expected result.
     */
    public function testSingleNestResponse()
    {
        $nest = \App\Models\Nest::factory()->create();

        $response = $this->getJson('/api/application/nests/' . $nest->id);
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonStructure([
            'object',
            'attributes' => ['id', 'uuid', 'author', 'name', 'description', 'created_at', 'updated_at'],
        ]);

        $response->assertJson([
            'object' => 'nest',
            'attributes' => $this->getTransformer(NestTransformer::class)->transform($nest),
        ]);
    }

    /**
     * Test that including eggs in the response works as expected.
     */
    public function testSingleNestWithEggsIncluded()
    {
        $nest = \App\Models\Nest::factory()->create();
        \App\Models\Egg::factory()->count(2)->create([
            'nest_id' => $nest->id,
            'author' => 'authors@reviactyl.app',
            'docker_images' => ['ghcr.io/reviactyl/images:java_21'],
            'config_files' => '[]',
            'config_startup' => '{"done":"Server marked as running"}',
            'config_logs' => '[]',
            'config_stop' => 'end',
        ]);
        $nest->loadMissing('eggs');

        $response = $this->getJson('/api/application/nests/' . $nest->id . '?include=servers,eggs');
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonStructure([
            'object',
            'attributes' => [
                'relationships' => [
                    'eggs' => ['object', 'data' => []],
                    'servers' => ['object', 'data' => []],
                ],
            ],
        ]);

        $response->assertJsonCount(count($nest->getRelation('eggs')), 'attributes.relationships.eggs.data');
    }

    /**
     * Test that a missing nest returns a 404 error.
     */
    public function testGetMissingNest()
    {
        $response = $this->getJson('/api/application/nests/nil');
        $this->assertNotFoundJson($response);
    }

    /**
     * Test that an authentication error occurs if a key does not have permission
     * to access a resource.
     */
    public function testErrorReturnedIfNoPermission()
    {
        $nest = \App\Models\Nest::factory()->create();
        $this->createNewDefaultApiKey($this->getApiUser(), ['r_nests' => 0]);

        $response = $this->getJson('/api/application/nests/' . $nest->id);
        $this->assertAccessDeniedJson($response);
    }
}
