"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface FeedbackModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onAuthRequired: () => void
}

export function FeedbackModal({ isOpen, onOpenChange, onAuthRequired }: FeedbackModalProps) {
  const [session, setSession] = useState<{ user: { name: string; email: string; avatar?: string; role?: string } } | null>(null)
  const { toast } = useToast()
  const [feedbackText, setFeedbackText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    fetch('/api/auth/session')
        .then(res => res.json())
        .then(data => {
        if (data.authenticated) {
            setSession({ user: data.user })
        }
        })
    }, [])

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      onAuthRequired()
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedbackText,
          rating: rating,
        }),
      })

      if (response.ok) {
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for your feedback. It will appear shortly.",
        })
        onOpenChange(false)
        setFeedbackText('')
        setRating(0)
        window.location.reload()
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setRating(0)
    setHoverRating(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Submit Your Feedback
          </DialogTitle>
          <DialogDescription>
            Share your experience with MoleculeInsight. Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4 mt-4">
          {session?.user && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-3">
                {session.user.avatar && (
                  <img 
                    src={session.user.avatar} 
                    alt={session.user.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                  />
                )}
                <div>
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{session.user.role}</p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-3 block">
              Rate Your Experience
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-none text-gray-400 stroke-2'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                You rated: {rating} star{rating > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="feedback" className="text-sm font-medium mb-2 block">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              placeholder="Share your experience..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
              rows={6}
              className="resize-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              className="flex-1 bg-[#3591e2] text-white hover:bg-[#2a7bc8]"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}