<?php

namespace Database\Factories;

use App\Models\User;
use Ramsey\Uuid\Uuid;
use App\Models\ServerCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServerCategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\ServerCategory>
     */
    protected $model = ServerCategory::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'uuid' => Uuid::uuid4()->toString(),
            'user_id' => User::factory(),
            'name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
            'color' => $this->faker->hexColor(),
            'position' => 0,
        ];
    }
}
