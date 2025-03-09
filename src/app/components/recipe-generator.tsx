"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type MealType = "breakfast" | "lunch" | "dinner"
type Recipe = {
  title: string
  ingredients: string[]
  instructions: string[]
  image: string
}

export function RecipeGenerator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast")
  const [isGenerating, setIsGenerating] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [manualIngredients, setManualIngredients] = useState<string>("")

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setRecipes([]) // Clear previous recipes
    }
  }

  // Handle meal type selection
  const handleMealTypeChange = (value: string) => {
    setSelectedMeal(value as MealType)
  }

  // Generate recipes based on image and meal type
  const generateRecipes = () => {
    if (!imagePreview && !manualIngredients.trim()) {
      return
    }

    setIsGenerating(true)

    // Simulate API call with mock data
    setTimeout(() => {
      const mockRecipes: Recipe[] = [
        {
          title: `${
            selectedMeal === "breakfast"
              ? "Fluffy Pancakes"
              : selectedMeal === "lunch"
                ? "Vegetable Stir Fry"
                : "Baked Salmon with Vegetables"
          }`,
          ingredients: [
            "2 cups all-purpose flour",
            "2 tablespoons sugar",
            "1 tablespoon baking powder",
            "1/2 teaspoon salt",
            "2 eggs",
            "1 1/2 cups milk",
            "2 tablespoons melted butter",
          ],
          instructions: [
            "Mix dry ingredients in a bowl.",
            "In another bowl, whisk eggs, milk, and butter.",
            "Combine wet and dry ingredients until just mixed.",
            "Heat a lightly oiled griddle over medium-high heat.",
            "Pour batter onto the griddle, using approximately 1/4 cup for each pancake.",
            "Cook until bubbles form and edges are dry, then flip and cook until browned.",
          ],
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: `${
            selectedMeal === "breakfast"
              ? "Avocado Toast"
              : selectedMeal === "lunch"
                ? "Quinoa Salad"
                : "Pasta Primavera"
          }`,
          ingredients: [
            "2 slices whole grain bread",
            "1 ripe avocado",
            "2 eggs",
            "Salt and pepper to taste",
            "Red pepper flakes (optional)",
            "Lemon juice",
          ],
          instructions: [
            "Toast bread until golden and firm.",
            "Remove pits from avocados and scoop into a bowl.",
            "Add lemon juice, salt and pepper and mash until desired consistency.",
            "Spread avocado mixture on the toast.",
            "Top with fried or poached eggs.",
            "Sprinkle with additional salt, pepper, and red pepper flakes if desired.",
          ],
          image: "/placeholder.svg?height=300&width=400",
        },
      ]

      setRecipes(mockRecipes)
      setIsGenerating(false)
    }, 1500)
  }

  // Text-to-speech function
  const speakRecipe = (recipe: Recipe) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const text = `Recipe for ${recipe.title}. Ingredients: ${recipe.ingredients.join(", ")}. Instructions: ${recipe.instructions.join(" ")}`
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      {/* Image upload section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full max-w-md h-64">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Uploaded ingredients"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">Click to upload an image of your ingredients</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* Manual ingredients input */}
            <div className="w-full max-w-md mt-4">
              <label htmlFor="manual-ingredients" className="block text-sm font-medium mb-2">
                Or enter your ingredients manually (one per line)
              </label>
              <Textarea
                id="manual-ingredients"
                placeholder="e.g., 2 eggs&#10;1 cup flour&#10;1/2 cup milk&#10;salt and pepper"
                rows={4}
                value={manualIngredients}
                onChange={(e) => setManualIngredients(e.target.value)}
                className="resize-none"
              />
            </div>

            {/* Meal type selection */}
            <div className="w-full max-w-md">
              <Tabs defaultValue="breakfast" onValueChange={handleMealTypeChange}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                  <TabsTrigger value="lunch">Lunch</TabsTrigger>
                  <TabsTrigger value="dinner">Dinner</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Generate button */}
            <Button
              className="w-full max-w-md"
              onClick={generateRecipes}
              disabled={(!imagePreview && !manualIngredients.trim()) || isGenerating}
            >
              {isGenerating ? "Generating Recipes..." : "Generate Recipes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results section */}
      {recipes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recipe Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <div className="relative w-full h-48">
                    <Image
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">{recipe.title}</h3>
                      <Button variant="ghost" size="icon" onClick={() => speakRecipe(recipe)} title="Read recipe aloud">
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Ingredients:</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Instructions:</h4>
                      <ol className="list-decimal pl-5 text-sm">
                        {recipe.instructions.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

