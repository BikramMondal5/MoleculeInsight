import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { FeedbackModal } from "@/components/ui/feedback-modal"

// Default testimonial data
const defaultTestimonials = [
    {
        name: "Dr. Sarah Chen",
        country: "USA",
        type: "Researcher",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        feedback: "MoleculeInsight cut our preliminary research phase by 60%. The agentic AI orchestration finds connections across patents and clinical trials we missed manually.",
        rating: 5,
    },
    {
        name: "James Wilson",
        country: "UK",
        type: "Student",
        avatar: "https://i.pravatar.cc/150?u=james",
        feedback: "The comprehensive PDF reports generated are board-ready. It's like having a dedicated analyst team working 24/7 on molecule repurposing opportunities.",
        rating: 5,
    },
    {
        name: "Elena Rodriguez",
        country: "Spain",
        type: "Researcher",
        avatar: "https://i.pravatar.cc/150?u=elena",
        feedback: "Deep data retrieval from multiple sources is seamless. I can trust the data quality because it links directly to the source documents.",
        rating: 5,
    },
    {
        name: "Akira Tanaka",
        country: "Japan",
        type: "Student",
        avatar: "https://i.pravatar.cc/150?u=akira",
        feedback: "For evaluating biotech startups, this tool is indispensable. It quickly validates claims and highlights the competitive landscape in minutes.",
        rating: 5,
    },
    {
        name: "Dr. Emily Clarke",
        country: "Canada",
        type: "Researcher",
        avatar: "https://i.pravatar.cc/150?u=emily",
        feedback: "The ease of use is remarkable. Just entering a molecule name gives me a holistic view from molecular properties to current market status.",
        rating: 5,
    },
    {
        name: "Michael Chang",
        country: "Singapore",
        type: "Researcher",
        avatar: "https://i.pravatar.cc/150?u=michael",
        feedback: "We pivoted our drug candidate based on insights from MoleculeInsight. It identified a saturation in our original target indication that saved us millions.",
        rating: 5,
    },
]

const people = [
    {
        id: 1,
        name: "John Doe",
        designation: "Software Engineer",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
        id: 2,
        name: "Robert Johnson",
        designation: "Product Manager",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 3,
        name: "Jane Smith",
        designation: "Data Scientist",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 4,
        name: "Emily Davis",
        designation: "UX Designer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 5,
        name: "Tyler Durden",
        designation: "Soap Developer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
        id: 6,
        name: "Dora",
        designation: "The Explorer",
        image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
];

// Simple AnimatedTooltip component
function AnimatedTooltip({ items }: { items: typeof people }) {
    return (
        <div className="flex flex-row items-center">
            {items.map((item, idx) => (
                <div
                    key={item.id}
                    className="relative group -ml-4 first:ml-0"
                    style={{ zIndex: items.length - idx }}
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-full border-2 border-background object-cover transition-transform group-hover:scale-110"
                    />
                </div>
            ))}
        </div>
    );
}

export default function TestimonialCarousel() {
    const [testimonials] = useState(defaultTestimonials)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const router = useRouter()
    const [userFeedbacks, setUserFeedbacks] = useState<any[]>([])
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const allTestimonials = [...testimonials, ...userFeedbacks]

    useEffect(() => {
        // Check if user is authenticated
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                setIsAuthenticated(data.authenticated || false)
            })
            .catch(err => {
                console.error('Failed to check auth:', err)
                setIsAuthenticated(false)
            })
            .finally(() => {
                setIsCheckingAuth(false)
            })
    }, [])

    const fetchFeedbacks = async () => {
        try {
            // Get current user session for latest avatar
            const sessionRes = await fetch('/api/auth/session')
            const sessionData = await sessionRes.json()
            const currentUserEmail = sessionData.authenticated ? sessionData.user.email : null
            const currentUserAvatar = sessionData.authenticated ? sessionData.user.avatar : null
            const currentUserName = sessionData.authenticated ? sessionData.user.name : null

            const res = await fetch('/api/get-feedbacks')
            const data = await res.json()
            
            if (data.feedbacks) {
            const formatted = data.feedbacks.map((f: any) => ({
                name: f.userEmail === currentUserEmail ? (currentUserName || f.userName) : f.userName,
                country: f.country || 'Unknown',
                type: f.userType,
                avatar: f.userEmail === currentUserEmail ? currentUserAvatar : (f.userAvatar || null),
                feedback: f.feedback,
                rating: f.rating,
            }))
            setUserFeedbacks(formatted)
            }
        } catch (err) {
            console.error('Failed to fetch feedbacks:', err)
        }
        }

        useEffect(() => {
        fetchFeedbacks()
        
        // Listen for feedback updates
        const handleFeedbackUpdate = () => {
            fetchFeedbacks()
        }
        
        window.addEventListener('feedbackSubmitted', handleFeedbackUpdate)
        return () => window.removeEventListener('feedbackSubmitted', handleFeedbackUpdate)
        }, [])

    useEffect(() => {
        const handleAvatarUpdate = (event: any) => {
            const { avatar } = event.detail
            // Refresh feedbacks to update avatar
            fetchFeedbacks()
        }
        
        window.addEventListener('userUpdated', handleAvatarUpdate)
        return () => window.removeEventListener('userUpdated', handleAvatarUpdate)
        }, [])

    const handleStartAnalysis = () => {
        if (!isAuthenticated) {
            router.push('/login')
        } else {
            router.push('/analysis')
        }
    }

    const handleShareFeedback = () => {
        if (!isAuthenticated) {
            router.push('/login')
        } else {
            setShowFeedbackModal(true)
        }
        }

    return (
        <section id="testimonials" className="pt-20 pb-4 bg-background overflow-hidden relative">
            <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-500">
                    Trusted by Researchers
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    See how students and researchers are accelerating discovery with MoleculeInsight.
                </p>

                {/* Avatars Section */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="flex flex-row items-center justify-center w-full">
                        <AnimatedTooltip items={people} />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Join 573+ researchers</p>
                </div>
            </div>

            <div className="relative overflow-hidden w-full py-4 mb-2">
                {/* Gradients for fade effect on edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    className="flex animate-marquee"
                    style={{
                        width: 'max-content',
                    }}
                >
                    {allTestimonials.map((testimonial, index) => (
                        <div
                            key={`first-${index}`}
                            className="px-4 flex-shrink-0"
                            style={{ width: '400px' }}
                        >
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                        ))}

                        {allTestimonials.map((testimonial, index) => (
                        <div
                            key={`second-${index}`}
                            className="px-4 flex-shrink-0"
                            style={{ width: '400px' }}
                        >
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                        ))}
                </div>

                <div className="flex justify-center mt-8 pb-1">
                    <Button 
                        onClick={handleShareFeedback}
                        disabled={isCheckingAuth}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-full px-8 h-12"
                    >
                        {isCheckingAuth ? 'Loading...' : 'Share Feedback'}
                    </Button>
                </div>
            </div>
            <FeedbackModal 
            isOpen={showFeedbackModal}
            onOpenChange={setShowFeedbackModal}
            onAuthRequired={() => router.push('/login')}
            />

            <style jsx global>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
    return (
        <Card className="relative group transition-all duration-300 h-full border border-border/50 bg-card hover:shadow-lg rounded-xl overflow-hidden"
            style={{ minHeight: '260px' }}
        >
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-4">
                    {testimonial.avatar ? (
                        <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full border border-border object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                        <User className="w-6 h-6 text-primary" />
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-foreground text-base">
                        {testimonial.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{testimonial.country}</p>
                    </div>
                    </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic flex-grow mb-4">
                    "{testimonial.feedback}"
                </p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/40">
                    <div className="flex space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-4 w-4 ${
                                    star <= (testimonial.rating || 5)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-none text-muted-foreground/30'
                                }`}
                            />
                        ))}
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-medium rounded-full ${
                        testimonial.type === "Student"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}>
                        {testimonial.type}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}