<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController
{
    public function live(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'commercehub-api',
        ]);
    }

    public function ready(): JsonResponse
    {
        try {
            DB::connection()->select('select 1');

            return response()->json([
                'status' => 'ok',
                'dependencies' => [
                    'database' => 'ok',
                ],
            ]);
        } catch (Throwable) {
            return response()->json([
                'status' => 'error',
                'dependencies' => [
                    'database' => 'unavailable',
                ],
            ], 503);
        }
    }
}
