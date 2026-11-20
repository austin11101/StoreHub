<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->withHeader('Origin', 'http://localhost:5173');
});

it('allows a user to log in with valid credentials', function () {
    $user = User::factory()->create([
        'password' => 'CorrectPassword123!',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => $user->email,
        'password' => 'CorrectPassword123!',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonPath('data.user.name', $user->name)
        ->assertJsonPath('data.user.email', $user->email)
        ->assertJsonMissingPath('data.user.password')
        ->assertJsonMissingPath('data.user.remember_token');

    $this->assertAuthenticatedAs($user, 'web');
});

it('rejects login with an incorrect password', function () {
    $user = User::factory()->create([
        'password' => 'CorrectPassword123!',
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email' => $user->email,
        'password' => 'IncorrectPassword123!',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');

    $this->assertGuest('web');
});

it('rejects login with an invalid email address', function () {
    $this->postJson('/api/v1/auth/login', [
        'email' => 'not-an-email',
        'password' => 'CorrectPassword123!',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

it('requires email and password to log in', function () {
    $this->postJson('/api/v1/auth/login', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
            'password',
        ]);
});

it('returns the authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->getJson('/api/v1/auth/user')
        ->assertOk()
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonPath('data.user.email', $user->email)
        ->assertJsonMissingPath('data.user.password')
        ->assertJsonMissingPath('data.user.remember_token');
});

it('rejects access to the current user endpoint when unauthenticated', function () {
    $this->getJson('/api/v1/auth/user')
        ->assertUnauthorized();
});

it('allows an authenticated user to log out', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/v1/auth/logout')
        ->assertOk()
        ->assertJson([
            'message' => 'Logged out successfully.',
        ]);

    $this->assertGuest('web');
});

it('prevents access to the current user endpoint after logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web');

    $this->postJson('/api/v1/auth/logout')
        ->assertOk();

    // Simulate the authentication guard being recreated for a new request.
    $this->app['auth']->forgetGuards();

    $this->getJson('/api/v1/auth/user')
        ->assertUnauthorized();
});
