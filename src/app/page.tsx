import { cn } from "@/lib/utils"
import { RecentPost } from "./components/post"
import { RecipeGenerator } from "./components/recipe-generator"


export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Recipe Generator</h1>
          <p className="text-muted-foreground">
            Upload a photo of your ingredients and get delicious recipe suggestions
          </p>
        </header>
        <RecipeGenerator />
      </div>
    </main>
  )
}
