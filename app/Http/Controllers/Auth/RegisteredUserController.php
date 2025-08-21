<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Inventories;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $inventories = Inventories::all(); 

        return Inertia::render('Auth/Register', [
            'inventories' => $inventories
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,staff', 
            'inventory_id' => [
                'required_if:role,staff',
                'exists:inventories,inventory_id',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->role === 'staff' && empty($value)) {
                        $fail('Inventory assignment is required for staff members.');
                    }
                    if ($request->role === 'admin' && !empty($value)) {
                        $fail('System administrators should not have inventory assignment.');
                    }
                }
            ],
        ]);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'inventory_id' => $request->role === 'staff' ? $request->inventory_id : null,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}