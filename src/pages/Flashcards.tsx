import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  RotateCcw,
  CheckCircle,
  X,
  Play,
  BarChart3,
  Calendar,
  Brain,
  Target
} from "lucide-react"

interface FlashcardDeck {
  id: string
  title: string
  course: string
  totalCards: number
  masteredCards: number
  dueCards: number
  lastStudied: string
  accuracy: number
  source: string
}

interface Flashcard {
  id: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed: string
  nextReview: string
  streak: number
}

export default function Flashcards() {
  const [studyMode, setStudyMode] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null)

  const decks: FlashcardDeck[] = [
    {
      id: "1",
      title: "Machine Learning Fundamentals",
      course: "CS 229",
      totalCards: 25,
      masteredCards: 18,
      dueCards: 7,
      lastStudied: "2024-01-15",
      accuracy: 85,
      source: "Introduction to Machine Learning - Chapter 3"
    },
    {
      id: "2",
      title: "Organic Chemistry Reactions",
      course: "CHEM 101",
      totalCards: 32,
      masteredCards: 12,
      dueCards: 15,
      lastStudied: "2024-01-14",
      accuracy: 72,
      source: "Organic Chemistry Lecture Notes"
    },
    {
      id: "3",
      title: "Industrial Revolution",
      course: "HIST 200",
      totalCards: 28,
      masteredCards: 22,
      dueCards: 3,
      lastStudied: "2024-01-13",
      accuracy: 91,
      source: "World History - Industrial Revolution"
    }
  ]

  const sampleCards: Flashcard[] = [
    {
      id: "1",
      question: "What is supervised learning?",
      answer: "Supervised learning is a machine learning approach where algorithms learn from labeled training data to make predictions or decisions on new, unseen data.",
      difficulty: "medium",
      lastReviewed: "2024-01-14",
      nextReview: "2024-01-16",
      streak: 3
    },
    {
      id: "2",
      question: "What are the main types of supervised learning?",
      answer: "The two main types are: 1) Classification (predicting discrete categories/classes) and 2) Regression (predicting continuous numerical values).",
      difficulty: "easy",
      lastReviewed: "2024-01-13",
      nextReview: "2024-01-15",
      streak: 5
    }
  ]

  const startStudySession = (deck: FlashcardDeck) => {
    setSelectedDeck(deck)
    setStudyMode(true)
    setCurrentCard(0)
    setShowAnswer(false)
  }

  const flipCard = () => {
    setShowAnswer(!showAnswer)
  }

  const handleAnswer = (difficulty: 'easy' | 'medium' | 'hard') => {
    // Handle spaced repetition logic here
    if (currentCard < sampleCards.length - 1) {
      setCurrentCard(currentCard + 1)
      setShowAnswer(false)
    } else {
      // End study session
      setStudyMode(false)
      setSelectedDeck(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500 hover:bg-green-600'
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'hard':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  if (studyMode && selectedDeck) {
    const progress = ((currentCard + 1) / sampleCards.length) * 100
    const card = sampleCards[currentCard]

    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Study Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedDeck.title}</h1>
              <p className="text-muted-foreground">Card {currentCard + 1} of {sampleCards.length}</p>
            </div>
            <Button variant="outline" onClick={() => setStudyMode(false)}>
              <X className="h-4 w-4 mr-2" />
              Exit Study
            </Button>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <Progress value={progress} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress: {Math.round(progress)}%</span>
                <span>{sampleCards.length - currentCard - 1} cards remaining</span>
              </div>
            </CardContent>
          </Card>

          {/* Flashcard */}
          <Card className="min-h-96 cursor-pointer" onClick={flipCard}>
            <CardContent className="p-8 flex items-center justify-center text-center min-h-96">
              <div className="space-y-4">
                <Badge variant="outline" className="mb-4">
                  {showAnswer ? 'Answer' : 'Question'}
                </Badge>
                <div className="text-xl md:text-2xl font-medium leading-relaxed">
                  {showAnswer ? card.answer : card.question}
                </div>
                {!showAnswer && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Click to reveal answer
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Answer Buttons */}
          {showAnswer && (
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => handleAnswer('hard')}
                className={getDifficultyColor('hard')}
              >
                <X className="h-4 w-4 mr-2" />
                Hard (1 day)
              </Button>
              <Button
                onClick={() => handleAnswer('medium')}
                className={getDifficultyColor('medium')}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Medium (3 days)
              </Button>
              <Button
                onClick={() => handleAnswer('easy')}
                className={getDifficultyColor('easy')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Easy (1 week)
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flashcards</h1>
          <p className="text-muted-foreground mt-1">Review your AI-generated flashcards with spaced repetition</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Cards",
              value: decks.reduce((sum, deck) => sum + deck.totalCards, 0),
              icon: BookOpen,
              color: "text-blue-600"
            },
            {
              title: "Due Today",
              value: decks.reduce((sum, deck) => sum + deck.dueCards, 0),
              icon: Calendar,
              color: "text-orange-600"
            },
            {
              title: "Mastered",
              value: decks.reduce((sum, deck) => sum + deck.masteredCards, 0),
              icon: Target,
              color: "text-green-600"
            },
            {
              title: "Avg Accuracy",
              value: Math.round(decks.reduce((sum, deck) => sum + deck.accuracy, 0) / decks.length) + "%",
              icon: BarChart3,
              color: "text-purple-600"
            }
          ].map((stat, index) => (
            <Card key={index} className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flashcard Decks */}
        <div className="grid gap-4">
          {decks.map((deck) => (
            <Card key={deck.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{deck.title}</h3>
                      <Badge variant="outline">{deck.course}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      From: {deck.source}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{deck.totalCards}</div>
                        <div className="text-xs text-muted-foreground">Total Cards</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{deck.dueCards}</div>
                        <div className="text-xs text-muted-foreground">Due Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{deck.masteredCards}</div>
                        <div className="text-xs text-muted-foreground">Mastered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{deck.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Last studied: {new Date(deck.lastStudied).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Brain className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button 
                          onClick={() => startStudySession(deck)}
                          className="bg-primary hover:bg-primary-light"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Study Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {decks.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No flashcard decks yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload documents to automatically generate flashcards from your study materials
              </p>
              <Button className="bg-primary hover:bg-primary-light">
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}