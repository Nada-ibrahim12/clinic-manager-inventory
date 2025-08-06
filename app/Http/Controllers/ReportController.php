<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function inventory()
    {
        return Inertia::render('Reports/Inventory');
    }

    public function sales()
    {
        return Inertia::render('Reports/Sales');
    }
}
