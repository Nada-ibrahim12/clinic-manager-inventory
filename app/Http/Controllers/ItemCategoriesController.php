<?php

namespace App\Http\Controllers;

use App\Models\ItemCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Display all categories
    public function index()
    {
        $categories = ItemCategory::all();
        return response()->json($categories);
    }

    // Store a new category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:item_categories,name',
            'description' => 'nullable|string',
        ]);

        $category = ItemCategory::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    // Show a single category
    public function show($id)
    {
        $category = ItemCategory::findOrFail($id);
        return response()->json($category);
    }

    // Update a category
    public function update(Request $request, $id)
    {
        $category = ItemCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:item_categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    // Delete a category
    public function destroy($id)
    {
        $category = ItemCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
