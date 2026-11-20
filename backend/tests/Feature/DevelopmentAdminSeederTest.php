<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DevelopmentAdminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('creates the verified development administrator with a hashed password', function () {
    $this->seed(DevelopmentAdminSeeder::class);

    $user = User::query()
        ->where('email', 'admin@commercehub.local')
        ->firstOrFail();

    expect($user->name)->toBe('CommerceHub Admin')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(Hash::check('Admin@12345!', $user->password))->toBeTrue();
});

it('does not create duplicate accounts when seeded repeatedly', function () {
    $this->seed(DevelopmentAdminSeeder::class);
    $firstUserId = User::query()
        ->where('email', 'admin@commercehub.local')
        ->value('id');

    $this->seed(DevelopmentAdminSeeder::class);

    expect(User::query()->where('email', 'admin@commercehub.local')->count())
        ->toBe(1)
        ->and(User::query()
            ->where('email', 'admin@commercehub.local')
            ->value('id'))
        ->toBe($firstUserId);
});

it('refuses to seed the development administrator in production', function () {
    $this->app['env'] = 'production';

    expect(fn () => $this->app->make(DevelopmentAdminSeeder::class)->run())
        ->toThrow(
            RuntimeException::class,
            'The development administrator seeder cannot run in production.',
        );

    expect(User::query()->count())->toBe(0);
});

it('integrates the development administrator without removing existing seeding', function () {
    $this->seed(DatabaseSeeder::class);

    expect(User::query()->where('email', 'admin@commercehub.local')->exists())
        ->toBeTrue()
        ->and(User::query()->where('email', 'test@example.com')->exists())
        ->toBeTrue();
});

it('authenticates the seeded account through the existing login endpoint', function () {
    $this->app['env'] = 'testing';
    $this->withHeader('Origin', 'http://localhost:5173');
    $this->app->make(DevelopmentAdminSeeder::class)->run();

    $user = User::query()
        ->where('email', 'admin@commercehub.local')
        ->firstOrFail();

    $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@commercehub.local',
        'password' => 'Admin@12345!',
    ])
        ->assertOk()
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonPath('data.user.email', 'admin@commercehub.local')
        ->assertJsonMissingPath('data.user.password')
        ->assertJsonMissingPath('data.user.remember_token');

    $this->assertAuthenticatedAs($user, 'web');
});
