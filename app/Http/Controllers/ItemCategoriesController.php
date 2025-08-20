<?php

namespace App\Http\Controllers;

use App\Models\ItemCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = ItemCategory::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:item_categories,category_name',
            'description' => 'nullable|string',
        ]);

        $category = ItemCategory::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    public function show($id)
    {
        $category = ItemCategory::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = ItemCategory::findOrFail($id);

        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:item_categories,category_name,' . $id . ',category_id',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = ItemCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
