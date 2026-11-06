<?php

use Illuminate\Support\Facades\DB;

it('returns a successful liveness response', function () {
    $this->getJson('/api/v1/health/live')
        ->assertOk()
        ->assertExactJson([
            'status' => 'ok',
            'service' => 'commercehub-api',
        ]);
});

it('returns a successful readiness response when the database is available', function () {
    $connection = Mockery::mock();

    $connection->shouldReceive('select')
        ->once()
        ->with('select 1')
        ->andReturn([]);

    DB::shouldReceive('connection')
        ->once()
        ->andReturn($connection);

    $this->getJson('/api/v1/health/ready')
        ->assertOk()
        ->assertExactJson([
            'status' => 'ok',
            'dependencies' => [
                'database' => 'ok',
            ],
        ]);
});

it('returns service unavailable when the database is unavailable', function () {
    DB::shouldReceive('connection')
        ->once()
        ->andThrow(new RuntimeException('Database unavailable'));

    $this->getJson('/api/v1/health/ready')
        ->assertServiceUnavailable()
        ->assertExactJson([
            'status' => 'error',
            'dependencies' => [
                'database' => 'unavailable',
            ],
        ]);
});
