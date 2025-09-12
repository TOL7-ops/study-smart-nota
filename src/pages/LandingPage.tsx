import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import { 
  BookOpen, 
  Brain, 
  Zap, 
  Star, 
  Check,
  ArrowRight,
  Users,
  FileText,
  BarChart3
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-hero">
            Transform Your Study Notes with AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload documents, get instant summaries, create flashcards, and ace your exams. 
            The ultimate AI study companion for students.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="btn-hero">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="btn-hero-outline">
                Try Free Demo
              </Button>
            </Link>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col items-center p-6 rounded-xl glass">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Summarization</h3>
                <p className="text-muted-foreground text-center">
                  Get instant, intelligent summaries of your study materials
                </p>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col items-center p-6 rounded-xl glass">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Flashcards</h3>
                <p className="text-muted-foreground text-center">
                  Auto-generate flashcards from your notes and documents
                </p>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col items-center p-6 rounded-xl glass">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Answers</h3>
                <p className="text-muted-foreground text-center">
                  Ask questions and get instant answers from your materials
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground">Start free, upgrade when you need more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative bg-gradient-card border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-lg text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  5 document uploads per month
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  Basic AI summaries
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  50 flashcards
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  Community support
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative bg-gradient-card border-2 border-primary shadow-glow">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>For serious students</CardDescription>
              <div className="text-3xl font-bold">$9<span className="text-lg text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  Unlimited document uploads
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  Advanced AI features
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  Unlimited flashcards
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-success mr-3" />
                  Export & sharing
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-primary hover:bg-primary-light">
                  Start Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
          <p className="text-xl text-muted-foreground">Join thousands of students improving their grades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Sarah Chen",
              role: "Computer Science Student",
              content: "Nota helped me ace my final exams. The AI summaries saved me hours of studying!",
              rating: 5
            },
            {
              name: "Marcus Johnson",
              role: "Medical Student",
              content: "The flashcard generation is incredible. It creates perfect study cards from my textbooks.",
              rating: 5
            },
            {
              name: "Emily Rodriguez",
              role: "Business Major",
              content: "I went from B's to A's after using Nota. The instant answers feature is a game-changer.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-gradient-hero rounded-2xl mx-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Study Routine?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who are already studying smarter, not harder.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Nota</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Nota. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}