<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DevelopmentAdminSeeder extends Seeder
{
    /**
     * Seed the local development administrator account.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            throw new \RuntimeException(
                'The development administrator seeder cannot run in production.',
            );
        }

        User::updateOrCreate(
            ['email' => 'admin@commercehub.local'],
            [
                'name' => 'CommerceHub Admin',
                'password' => 'Admin@12345!',
                'email_verified_at' => now(),
            ],
        );
    }
}
