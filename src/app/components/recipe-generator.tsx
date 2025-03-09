"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { client } from "@/lib/client"

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
  const generateRecipes = async () => {
    if (!imagePreview && !manualIngredients.trim()) {
      console.warn("⚠️ No image or manual ingredients provided.");
      return;
    }
  
    console.log("🔍 Sending request to API...");
    console.log("📸 Image Preview:", imagePreview ? "Image detected" : "No image");
    console.log("📝 Manual Ingredients:", manualIngredients);
  
    setIsGenerating(true);
  
    try {

      
      const response = await client.image.getImageAnalysis.$post({
        text: manualIngredients,    
        imagePath: imagePreview || "",
      });

  
      if (!response.ok) {
        console.error("❌ API Error: Response not OK", response.status, response.statusText);
        return;
      }
  
      const data: { result?: { data?: { success?: boolean; message?: string; error?: string } } } = await response.json();
      console.log("✅ API Response:", data);
  
      if (data.result?.data?.success && data.result?.data?.message) {
        setRecipes([
          {
            title: "Generated Recipe",
            ingredients: ["Ingredient 1", "Ingredient 2"], // Replace with real API data
            instructions: ["Step 1", "Step 2"],
            image: imagePreview || "/placeholder.svg",
          },
        ]);
      } else {
        console.error("❌ API Error:", data.result?.data?.error || "Unknown error");
      }
    } catch (error) {
      console.error("🔥 Fetch Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  

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

