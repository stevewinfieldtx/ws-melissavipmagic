import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Castle, Ship, Compass, Crown, 
  Play, ChevronLeft, ChevronRight, 
  Star, Sparkles, Mail, Phone, MapPin,
  Instagram, Facebook, Youtube, Send,
  Check, Calendar, Users, Heart,
  Award, Gift, MessageCircle,
  BookOpen, Camera, PhoneCall,
  ArrowRight, ChevronDown, Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FloatingChat } from '@/components/chat';

gsap.registerPlugin(ScrollTrigger);

// Video data from original website
const youtubeVideos = [
  { id: 'cNAYhwnhZ4o', title: 'Disney Dream Concierge Lounge Tour', duration: '8:02' },
  { id: 'x16kyarCj84', title: "Disney's Best Kept Secret", duration: '0:24' },
  { id: 'yqRz_5VaSvA', title: 'Royal Suite Experience', duration: '0:46' },
  { id: 'jgMFktnFiuE', title: 'Palo Brunch Review', duration: '1:30' },
];

const testimonials = [
  {
    name: 'The Talley Family',
    text: "I can't put into words how much our Disney experience improved from 2 years ago with Melissa's planning!! The parks were crowded yet we never waited over 15 minutes to ride the rides of our choice!! Our meals were planned just at the right times and we saw parades and fireworks this time that we missed our last trip!! The extra tip info and guides she sent us to use not to mention the extra battery backup gift all just made our trip so smooth and enjoyable!! I never waited on any questions throughout the entire planning - even when we were in Disney and she was on a cruise!",
    rating: 5
  },
  {
    name: 'The Scherer Family',
    text: "So fun & helpful to have someone who speaks fluent 'Disney!' This was my 4th trip - but the first time I've used an agent. I had such a great experience with Melissa that I will most definitely be using her again. Being able to bounce my ideas and questions off of someone so knowledgeable and using her suggestions and tips made our trip even more 'magical!'",
    rating: 5
  },
  {
    name: 'The Ruthstrom Family',
    text: "Melissa Jiles was AMAZING in helping my family plan our Disney trip. She was extremely knowledgeable and provided an itinerary that worked for us. The amount of Disney knowledge she has is insane! She provided us with hidden Disney secrets from all of her experiences. Thanks to her help we were able to secure every dining and fast pass reservation on our list. Melissa also helped secure our tickets for Disney Villain Night - TOTALLY AWESOME! We celebrated my daughter's 7th birthday in Disney and it was a magical trip she will never forget. If you're looking to book any Disney trip I HIGHLY recommend Melissa Jiles!",
    rating: 5
  },
  {
    name: 'The Johnson Family',
    text: "We just got back from a magical trip to Walt Disney World. I highly recommend using Melissa to help plan your Disney vacation. She is extremely knowledgeable and dedicated. Every detail was taken care of and we didn't have to worry about a thing!",
    rating: 5
  },
  {
    name: 'The Martinez Family',
    text: "Melissa made our Disney experience the most amazing and magical week! Her attention to detail and insider knowledge saved us so much time and stress. We got to experience so much more than we ever could have planned on our own. Worth every penny!",
    rating: 5
  },
  {
    name: 'The Williams Family',
    text: "Working with Melissa was an absolute game-changer for our family vacation. She thought of everything - from the perfect resort selection to dining reservations at the best restaurants. Our kids had the time of their lives and we made memories that will last forever!",
    rating: 5
  }
];

const services = [
  {
    icon: Castle,
    title: 'Disney Parks',
    description: 'Experience the parks in ways you could only imagine! With my complimentary service, enjoy VIP treatment at every turn.',
    image: '/images/service-parks.jpg'
  },
  {
    icon: Ship,
    title: 'Disney Cruise Line',
    description: 'Magic is here! Cruises are sailing to more than a dozen magical locations all over the world!',
    image: '/images/service-cruise.jpg'
  },
  {
    icon: Compass,
    title: 'Adventures By Disney',
    description: 'Join a magnificent community who travels the world together! Your next step if you are ALL THINGS DISNEY!',
    image: '/images/service-adventures.jpg'
  },
  {
    icon: Crown,
    title: 'Custom VIP Experience',
    description: 'Red carpet experiences crafted just for you. Over ten years of creating Disney dream vacations!',
    image: '/images/service-vip.jpg'
  }
];

const destinations = [
  {
    name: 'Walt Disney World',
    description: 'Four iconic theme parks, two water parks, 31 resort hotels, and endless magic in Orlando, Florida.',
    image: '/images/dest-wdw.jpg'
  },
  {
    name: 'Disneyland Resort',
    description: 'The original magic kingdom plus Disney California Adventure Park in Anaheim, California.',
    image: '/images/dest-disneyland.jpg'
  },
  {
    name: 'Disney Cruise Line',
    description: 'Sail to magical destinations with Broadway-quality shows, themed dining, and Disney hospitality at sea.',
    image: '/images/dest-cruise.jpg'
  },
  {
    name: 'Adventures By Disney',
    description: 'Guided tours to destinations around the world with Disney\'s signature service and storytelling.',
    image: '/images/dest-adventures.jpg'
  },
  {
    name: 'Aulani Resort',
    description: 'Paradise in Hawaii with Disney magic, featuring pools, beaches, and Hawaiian culture.',
    image: '/images/dest-aulani.jpg'
  }
];

const faqs = [
  {
    question: "Are your services really free?",
    answer: "Yes! My Disney vacation planning services are 100% FREE to you. Disney pays travel agents a commission, so you get expert planning at no additional cost. You'll pay the same price booking through me as you would booking directly with Disney - but with personalized service and insider knowledge!"
  },
  {
    question: "Can you help if I already booked with Disney?",
    answer: "Absolutely! If you've already booked your Disney vacation directly with Disney within the last 30 days, I can transfer your reservation to my agency at no cost to you. You'll still receive all the benefits of my planning services, including itinerary planning, dining reservations, and insider tips!"
  },
  {
    question: "How far in advance should I book?",
    answer: "The earlier, the better! For Walt Disney World and Disneyland, I recommend booking 6-12 months in advance to secure the best resort availability and dining reservations. For Disney Cruise Line, booking 12-18 months ahead gives you the best selection of staterooms and itineraries. Adventures by Disney often books up 12+ months in advance."
  },
  {
    question: "What's included in your planning service?",
    answer: "Everything! I handle resort recommendations and booking, dining reservations (180 days out for Disney World), Genie+ strategy, park itineraries customized to your family, special occasion celebrations, transportation advice, packing tips, and I'm available throughout your trip for any questions or changes."
  },
  {
    question: "Do you offer payment plans?",
    answer: "Disney offers flexible payment options! For Walt Disney World and Disneyland packages, you only need a $200 deposit to secure your reservation, with the final payment due 30 days before arrival. Disney Cruise Line requires a deposit at booking with final payment typically 90 days before sailing. I'll help you understand all payment options!"
  },
  {
    question: "Can you help with special dietary needs or celebrations?",
    answer: "Absolutely! I specialize in making every vacation magical, including special dietary accommodations, birthday and anniversary celebrations, accessible travel needs, and more. Just let me know what you need, and I'll make sure every detail is taken care of!"
  }
];

const blogPosts = [
  {
    title: "5 Hidden Gems at Magic Kingdom Most People Miss",
    excerpt: "Discover the secret spots and lesser-known attractions that will make your Magic Kingdom visit truly magical...",
    image: "/images/service-parks.jpg",
    date: "January 15, 2024"
  },
  {
    title: "Disney Cruise Line First-Timer's Complete Guide",
    excerpt: "Everything you need to know before your first Disney cruise - from embarkation to Castaway Cay...",
    image: "/images/service-cruise.jpg",
    date: "January 8, 2024"
  },
  {
    title: "Best Times to Visit Disney World in 2024",
    excerpt: "Crowd calendars, weather patterns, and special events to help you plan the perfect trip...",
    image: "/images/dest-wdw.jpg",
    date: "December 28, 2023"
  }
];

const instagramPosts = [
  { image: "/images/service-parks.jpg", likes: 234 },
  { image: "/images/service-cruise.jpg", likes: 189 },
  { image: "/images/service-adventures.jpg", likes: 312 },
  { image: "/images/service-vip.jpg", likes: 267 },
  { image: "/images/dest-wdw.jpg", likes: 456 },
  { image: "/images/dest-disneyland.jpg", likes: 398 },
];

const quizQuestions = [
  {
    question: "What's your family's ideal vacation pace?",
    options: [
      { text: "Go, go, go! We want to see and do EVERYTHING", value: "parks" },
      { text: "A mix of adventure and relaxation", value: "cruise" },
      { text: "Slow and immersive, soaking in the culture", value: "abd" },
      { text: "Beach time with a touch of magic", value: "aulani" }
    ]
  },
  {
    question: "What excites your family most about Disney?",
    options: [
      { text: "The rides and attractions!", value: "parks" },
      { text: "Character experiences and shows", value: "cruise" },
      { text: "Learning about new places and cultures", value: "abd" },
      { text: "Making memories together in paradise", value: "aulani" }
    ]
  },
  {
    question: "How do you feel about planning?",
    options: [
      { text: "I love having every minute scheduled", value: "parks" },
      { text: "I want options but also time to relax", value: "cruise" },
      { text: "I want an expert to handle everything", value: "abd" },
      { text: "Minimal planning sounds perfect", value: "aulani" }
    ]
  }
];

// Particle Component
function MagicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      opacity: number;
    }> = [];
    
    const colors = ['#F5A623', '#E91E8C', '#7B2D8E', '#FFFFFF'];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedY: -Math.random() * 1 - 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    let animationId: number;
    
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.y += particle.speedY;
        particle.x += particle.speedX + Math.sin(particle.y * 0.01) * 0.5;
        
        if (particle.y < -10 && canvas) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
        
        if (ctx) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity;
          ctx.fill();
        }
      });
      
      if (ctx) ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-30"
    />
  );
}

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => observer.disconnect();
  }, [end, duration]);
  
  return <span ref={counterRef}>{count}{suffix}</span>;
}

// Top Contact Bar
function TopBar() {
  return (
    <div className="bg-[#4A148C] text-white py-2 px-4 text-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-2">
        <div className="flex items-center gap-6">
          <a href="mailto:melissa@melissavipmagic.com" className="flex items-center gap-2 hover:text-[#F5A623] transition-colors">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">melissa@melissavipmagic.com</span>
          </a>
          <span className="hidden md:flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            <span>Contact via email for phone consultation</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[#F5A623]">
            <Award className="w-4 h-4" />
            Authorized Disney Vacation Planner
          </span>
        </div>
      </div>
    </div>
  );
}

// Stats Section
function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card',
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  const stats = [
    { icon: Calendar, value: 13, suffix: '+', label: 'Years Experience' },
    { icon: Users, value: 2500, suffix: '+', label: 'Families Helped' },
    { icon: Heart, value: 5000, suffix: '+', label: 'Vacations Booked' },
    { icon: Star, value: 100, suffix: '%', label: 'Satisfaction Rate' },
  ];
  
  return (
    <section ref={sectionRef} className="py-16 px-6 bg-gradient-to-r from-[#7B2D8E] via-[#9B59B6] to-[#E91E8C]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Choose Melissa Section
function WhyChooseMelissa() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card',
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  const features = [
    {
      icon: Award,
      title: 'Authorized Disney Expert',
      description: 'Official Disney Vacation Planner with Diamond Earmarked status. I have direct access to Disney and extensive training on all Disney destinations.',
      color: 'from-[#7B2D8E] to-[#9B59B6]'
    },
    {
      icon: Heart,
      title: 'Personalized Service',
      description: 'Every itinerary is custom-crafted for YOUR family. I take time to understand your preferences, budget, and dreams to create the perfect vacation.',
      color: 'from-[#E91E8C] to-[#F8BBD9]'
    },
    {
      icon: Gift,
      title: '100% Free Service',
      description: "You never pay a planning fee. Disney compensates me, so you get expert planning at absolutely no additional cost to you. It's a win-win!",
      color: 'from-[#F5A623] to-[#FFD700]'
    }
  ];
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
            Why Choose Melissa?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference of working with a true Disney expert
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className={`bg-gradient-to-br ${feature.color} rounded-3xl p-8 text-white h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>{feature.title}</h3>
                <p className="text-white/90 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.step-card',
        { x: index => index % 2 === 0 ? -50 : 50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  const steps = [
    {
      number: '01',
      icon: MessageCircle,
      title: 'Free Consultation',
      description: "Tell me about your dream vacation! We'll discuss your family, preferences, budget, and must-do experiences."
    },
    {
      number: '02',
      icon: Map,
      title: 'Custom Planning',
      description: "I'll create a personalized itinerary with resort recommendations, dining suggestions, and a day-by-day plan."
    },
    {
      number: '03',
      icon: Calendar,
      title: 'Booking & Reservations',
      description: "I handle all bookings, dining reservations (180 days out!), and special requests on your behalf."
    },
    {
      number: '04',
      icon: BookOpen,
      title: 'Pre-Trip Prep',
      description: "Receive packing lists, park tips, Genie+ strategy, and everything you need for a smooth trip."
    },
    {
      number: '05',
      icon: Sparkles,
      title: 'Magical Vacation',
      description: "Enjoy your stress-free Disney vacation! I'm available throughout your trip for any questions or changes."
    },
    {
      number: '06',
      icon: Camera,
      title: 'Share Your Story',
      description: "Come back and share your magical memories! I'd love to hear about your adventure and plan your next one."
    }
  ];
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#f8f4fc] via-white to-[#fff0f7]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From dream to reality - your magical journey in 6 simple steps
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7B2D8E] via-[#E91E8C] to-[#F5A623] hidden md:block" />
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className={`step-card flex flex-col md:flex-row items-start gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 md:text-right">
                  <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow ${index % 2 === 1 ? 'md:text-left' : ''}`}>
                    <h3 className="text-xl font-bold mb-2 text-[#7B2D8E]" style={{ fontFamily: 'Cinzel, serif' }}>{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7B2D8E] to-[#E91E8C] rounded-full flex items-center justify-center text-white shadow-lg">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-item',
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about planning with Melissa
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-[#f8f4fc] to-[#fff0f7] rounded-xl text-left hover:shadow-md transition-shadow"
              >
                <span className="font-semibold text-[#7B2D8E] pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[#7B2D8E] flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="p-5 bg-white border border-[#f8f4fc] rounded-b-xl mt-1">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Transfer Your Reservation Section
function TransferSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.transfer-content',
        { scale: 0.95, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.7, 
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#2D388E] to-[#7B2D8E]">
      <div className="max-w-4xl mx-auto">
        <div className="transfer-content bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-[#F5A623]/20 text-[#F5A623] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Gift className="w-4 h-4" />
                Already Booked with Disney?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#7B2D8E]" style={{ fontFamily: 'Cinzel, serif' }}>
                Transfer Your Reservation!
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                If you booked your Disney vacation directly with Disney within the last 30 days, 
                I can transfer your reservation to my agency at <strong>absolutely no cost to you</strong>.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Keep the same reservation and pricing',
                  'Get all my planning services FREE',
                  'Personalized itinerary and tips',
                  'Dining reservation assistance',
                  'Support throughout your trip'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#E91E8C] hover:bg-[#C4186D] text-white px-8 py-6 rounded-full font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Transfer My Reservation
              </Button>
            </div>
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gradient-to-br from-[#7B2D8E] to-[#E91E8C] rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl font-bold">FREE</div>
                  <div className="text-lg">Transfer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Blog Section
function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.blog-card',
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#f0f8ff] via-white to-[#fff5f8]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
              Disney Travel Tips
            </h2>
            <p className="text-lg text-gray-600">
              Insider secrets to make your vacation even more magical
            </p>
          </div>
          <Button variant="outline" className="border-[#7B2D8E] text-[#7B2D8E] hover:bg-[#7B2D8E] hover:text-white rounded-full">
            View All Tips
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="blog-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={`Blog post featured image: ${post.title} - Disney vacation tips and insider secrets`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  itemProp="image"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h3 className="text-xl font-bold mb-3 text-[#7B2D8E] group-hover:text-[#E91E8C] transition-colors" style={{ fontFamily: 'Cinzel, serif' }}>
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <button className="text-[#F5A623] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instagram Feed Section
function InstagramSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.insta-card',
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#E91E8C] mb-4">
            <Instagram className="w-6 h-6" />
            <span className="font-semibold">@melissavipmagic</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
            Magical Moments
          </h2>
          <p className="text-lg text-gray-600">
            Real photos from real families' Disney adventures
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <div key={index} className="insta-card group relative aspect-square rounded-xl overflow-hidden cursor-pointer" role="img" aria-label={`Instagram photo from Disney vacation - ${post.likes} likes`}>
              <img 
                src={post.image} 
                alt={`Instagram photo ${index + 1} from Melissa VIP Magic's Disney vacation gallery - ${post.likes} likes`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white flex items-center gap-1">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            onClick={() => toast.info('Follow @melissavipmagic on Instagram for daily Disney magic!')}
            className="bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white px-8 py-6 rounded-full font-semibold"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Follow on Instagram
          </Button>
        </div>
      </div>
    </section>
  );
}

// Quiz Section
function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };
  
  const getResult = () => {
    const counts: Record<string, number> = {};
    answers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    
    const results: Record<string, { name: string; description: string; image: string }> = {
      parks: { 
        name: 'Walt Disney World', 
        description: 'The ultimate Disney theme park experience with four incredible parks to explore!',
        image: '/images/dest-wdw.jpg'
      },
      cruise: { 
        name: 'Disney Cruise Line', 
        description: 'The perfect blend of Disney magic and relaxation at sea!',
        image: '/images/dest-cruise.jpg'
      },
      abd: { 
        name: 'Adventures By Disney', 
        description: 'Immersive guided tours to incredible destinations worldwide!',
        image: '/images/dest-adventures.jpg'
      },
      aulani: { 
        name: 'Aulani Resort', 
        description: 'Paradise in Hawaii with Disney magic and Hawaiian culture!',
        image: '/images/dest-aulani.jpg'
      }
    };
    
    return results[winner];
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.quiz-container',
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#7B2D8E] via-[#9B59B6] to-[#E91E8C]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Find Your Perfect Disney Destination
          </h2>
          <p className="text-lg text-white/80">
            Take this quick quiz to discover which Disney experience is right for your family!
          </p>
        </div>
        
        <div className="quiz-container bg-white rounded-3xl p-8 shadow-2xl">
          {!showResult ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7B2D8E] to-[#E91E8C] transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-6 text-[#7B2D8E]" style={{ fontFamily: 'Cinzel, serif' }}>
                {quizQuestions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-4 text-left bg-gradient-to-r from-[#f8f4fc] to-[#fff0f7] rounded-xl hover:shadow-md transition-all hover:scale-[1.02] border-2 border-transparent hover:border-[#7B2D8E]"
                  >
                    <span className="font-medium text-gray-700">{option.text}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#F5A623] rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#7B2D8E]" style={{ fontFamily: 'Cinzel, serif' }}>
                Your Perfect Match:
              </h3>
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src={getResult().image} 
                  alt={`Your recommended Disney destination: ${getResult().name} - ${getResult().description}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h4 className="text-3xl font-bold mb-3 text-[#E91E8C]" style={{ fontFamily: 'Cinzel, serif' }}>
                {getResult().name}
              </h4>
              <p className="text-gray-600 mb-8">{getResult().description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#E91E8C] hover:bg-[#C4186D] text-white px-8 py-6 rounded-full font-semibold"
                >
                  Start Planning This Trip!
                </Button>
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="border-[#7B2D8E] text-[#7B2D8E] hover:bg-[#7B2D8E] hover:text-white px-8 py-6 rounded-full"
                >
                  Take Quiz Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Contact Form Section
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDates: '',
    travelers: '',
    budget: '',
    message: ''
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! Melissa will contact you within 24 hours to start planning your magical vacation!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      destination: '',
      travelDates: '',
      travelers: '',
      budget: '',
      message: ''
    });
  };
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-form',
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#f8f4fc] via-white to-[#fff0f7]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
            Get Your Free Quote
          </h2>
          <p className="text-lg text-gray-600">
            Tell me about your dream vacation and I'll create a custom plan just for you
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="contact-form bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Smith"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination Interest *</label>
              <select
                required
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select a destination</option>
                <option value="wdw">Walt Disney World</option>
                <option value="disneyland">Disneyland Resort</option>
                <option value="cruise">Disney Cruise Line</option>
                <option value="abd">Adventures By Disney</option>
                <option value="aulani">Aulani Resort</option>
                <option value="not-sure">Not Sure - Help Me Choose!</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Dates (or timeframe)</label>
              <Input
                value={formData.travelDates}
                onChange={(e) => setFormData({...formData, travelDates: e.target.value})}
                placeholder="June 2024 or Flexible"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
              <Input
                value={formData.travelers}
                onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                placeholder="2 adults, 2 kids"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select budget range</option>
                <option value="economy">Economy ($3,000-$5,000)</option>
                <option value="moderate">Moderate ($5,000-$8,000)</option>
                <option value="deluxe">Deluxe ($8,000-$15,000)</option>
                <option value="luxury">Luxury ($15,000+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Occasion?</label>
              <Input
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Birthday, Anniversary, etc."
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tell Me About Your Dream Vacation</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="What are you most excited about? Any must-do experiences? Special needs or requests?"
              className="w-full min-h-[120px]"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              * Required fields. Your information is never shared.
            </p>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-[#7B2D8E] to-[#E91E8C] hover:opacity-90 text-white px-10 py-6 rounded-full font-semibold text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get My Free Quote
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

// Hero Section
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title span', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: 'back.out(1.7)', delay: 0.6 }
      );
      
      gsap.fromTo('.hero-subtitle',
        { x: -30, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out', delay: 1 }
      );
      
      gsap.fromTo('.hero-cta',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 1.2 }
      );
      
      gsap.fromTo('.nav-item',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 1.4 }
      );
    }, heroRef);
    
    return () => ctx.revert();
  }, []);
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1920"
        >
          <source 
            src="https://video.wixstatic.com/video/007ec4_59e4ba2cb8e4498fba018e0ae4ad6242/1080p/mp4/file.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>
      
      {/* Particles */}
      <MagicParticles />
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a 
            href="#" 
            className="text-white font-bold text-xl" 
            style={{ fontFamily: 'Cinzel, serif' }}
            aria-label="Melissa VIP Magic - Home"
          >
            Melissa VIP Magic
          </a>
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Services', 'Destinations', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="nav-item text-white/90 hover:text-white transition-colors text-sm font-medium"
                aria-label={`Navigate to ${item} section`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Content */}
      <div ref={contentRef} className="relative z-40 h-full flex flex-col items-center justify-center px-6">
        <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-6 whitespace-nowrap" style={{ fontFamily: 'Cinzel, serif' }} itemProp="headline">
          {'Where the Magic Begins'.split('').map((char, i) => (
            <span key={i} className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </h1>
        <p className="hero-subtitle text-xl md:text-2xl text-white/90 text-center max-w-2xl mb-10" itemProp="description">
          Your Dream Disney Vacation, Perfectly Planned
        </p>
        <Button 
          onClick={() => scrollToSection('services')}
          className="hero-cta bg-[#F5A623] hover:bg-[#E09512] text-white px-8 py-6 text-lg font-semibold rounded-full magic-glow-pulse"
          aria-label="Start planning your Disney vacation adventure"
        >
          <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
          Start Your Adventure
        </Button>
      </div>
    </section>
  );
}

// Services Section
function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-title',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { 
          clipPath: 'inset(0 0% 0 0)', 
          opacity: 1, 
          duration: 0.7, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
      
      gsap.fromTo('.service-card',
        { rotateY: -90, opacity: 0 },
        { 
          rotateY: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.12,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section id="services" ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#f8f4fc] via-white to-[#fff0f7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="services-title text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
            Magical Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every detail of your Disney vacation, expertly crafted
          </p>
        </div>
        
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative bg-white rounded-3xl overflow-hidden shadow-xl card-3d preserve-3d shimmer"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={`${service.title} - Disney vacation planning service by Melissa VIP Magic`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  itemProp="image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#F5A623] flex items-center justify-center float-animation">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{service.title}</h3>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-container',
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#7B2D8E] via-[#9B59B6] to-[#E91E8C]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Magical Stories
          </h2>
          <p className="text-lg text-white/80">
            Hear from families who experienced the magic
          </p>
        </div>
        
        <div className="testimonial-container relative">
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12">
            <div className="absolute -top-6 left-8 text-8xl text-[#F5A623] opacity-50">"</div>
            
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-10'
                }`}
              >
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-[#F5A623] fill-[#F5A623]" />
                  ))}
                </div>
                <p className="text-white text-lg md:text-xl text-center leading-relaxed mb-8">
                  {testimonial.text}
                </p>
                <p className="text-[#F5A623] text-xl font-semibold text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-[#F5A623] w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Video Gallery Section
function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.video-card',
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#1a1a2e]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            See the Magic
          </h2>
          <p className="text-lg text-white/70">
            Watch moments from magical vacations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {youtubeVideos.map((video, index) => (
            <div
              key={index}
              onClick={() => setSelectedVideo(video.id)}
              className="video-card group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Play video: ${video.title}`}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedVideo(video.id)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={`YouTube video thumbnail: ${video.title} - Click to watch`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#F5A623] flex items-center justify-center transform group-hover:scale-110 transition-transform magic-glow-pulse">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h3>
                <span className="text-white/70 text-xs">{video.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <DialogTitle className="sr-only">Video Player</DialogTitle>
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// About Section
function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-photo',
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
        { 
          clipPath: 'circle(100% at 50% 50%)', 
          opacity: 1, 
          duration: 0.9, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
      
      gsap.fromTo('.about-content > *',
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section id="about" ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="about-photo relative" itemScope itemType="https://schema.org/Person">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/melissa-portrait.jpg"
                alt="Melissa Jiles - Authorized Disney Vacation Planner with 13+ years experience planning magical Disney vacations for families"
                className="w-full h-auto"
                loading="lazy"
                itemProp="image"
              />
              <meta itemProp="name" content="Melissa Jiles" />
              <meta itemProp="jobTitle" content="Authorized Disney Vacation Planner" />
              <meta itemProp="description" content="Disney travel expert with 13+ years experience" />
              <div className="absolute inset-0 ring-4 ring-[#F5A623]/30 rounded-3xl" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F5A623] rounded-full flex items-center justify-center float-animation">
              <div className="text-center text-white">
                <div className="text-3xl font-bold">13+</div>
                <div className="text-xs">Years</div>
              </div>
            </div>
          </div>
          
          <div className="about-content">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
              Hi, thanks for dropping by!
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Understanding the unique experience and benefits of each Disney Destination is key to pairing the right vacation with the right family. Over the past thirteen years I have experienced every world-wide Disney Destination, most of them too many times to count.
              </p>
              <p>
                Using my experience, I help each of my guests select the perfect destination for their vacation and experience a bit of &quot;Disney magic&quot; anywhere they decide to adventure!
              </p>
              <p>
                I specialize in high end Disney travel experiences. Ask me about my Concierge Services and luxury Disney experiences such as cottages, bungalows, cabanas on Castaway Cay, adding Adventures by Disney to your cruise and specialty accommodations to add a bit of pixie dust to your vacation.
              </p>
              <p>
                I am a fully licensed Travel Professional with <a href="https://crazyimaginationtravel.com/melissa" target="_blank" rel="noopener noreferrer" className="text-[#7B2D8E] font-semibold hover:underline">Crazy Imagination Travel</a>, an Authorized Disney Vacation Planner and top tier Travel Agency recognized by Disney.
              </p>
            </div>
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 bg-[#7B2D8E] hover:bg-[#4A148C] text-white px-8 py-6 text-lg font-semibold rounded-full"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Let&apos;s Work Together!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Destinations Section
function Destinations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.destinations-title',
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % destinations.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  
  return (
    <section id="destinations" ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-[#f0f8ff] via-white to-[#fff5f8]">
      <div className="max-w-6xl mx-auto">
        <div className="destinations-title text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Cinzel, serif' }}>
            Magical Destinations
          </h2>
          <p className="text-lg text-gray-600">
            Explore Disney destinations around the world
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {destinations.map((dest, index) => (
                <div key={index} className="w-full flex-shrink-0 relative">
                  <div className="aspect-[16/9] md:aspect-[21/9]">
                    <img
                      src={dest.image}
                      alt={`${dest.name} - ${dest.description}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      itemProp="image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                      {dest.name}
                    </h3>
                    <p className="text-white/90 text-lg max-w-2xl mb-4">
                      {dest.description}
                    </p>
                    <Button 
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-[#F5A623] hover:bg-[#E09512] text-white px-6 py-3 rounded-full"
                    >
                      Book Today
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-[#7B2D8E]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-[#7B2D8E]" />
          </button>
          
          <div className="flex justify-center gap-2 mt-6">
            {destinations.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-[#7B2D8E] w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-content',
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 px-6 gradient-bg-animated relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `sparkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="cta-content max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          Ready to Start Your Magical Journey?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Let&apos;s create your perfect Disney vacation together.
        </p>
        <Button 
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#F5A623] hover:bg-[#E09512] text-white px-10 py-6 text-lg font-semibold rounded-full magic-glow-pulse"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Get Started Today
        </Button>
        <p className="mt-6 text-white/70 text-sm">
          Free consultation • No obligation • Expert advice
        </p>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const [email, setEmail] = useState('');
  const footerRef = useRef<HTMLDivElement>(null);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing! You\'ll receive magical travel tips soon.');
      setEmail('');
    }
  };
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-content > *',
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          }
        }
      );
    }, footerRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <footer id="contact" ref={footerRef} className="bg-[#1a1a2e] text-white py-16 px-6">
      <div className="footer-content max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              Melissa VIP Magic
            </h3>
            <p className="text-white/70 mb-6">
              Creating magical Disney vacations since 2010. Your trusted Authorized Disney Vacation Planner.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#F5A623] rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#F5A623] rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#F5A623] rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Services', 'Destinations', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-white/70 hover:text-[#F5A623] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-[#F5A623]" />
                <span>melissa@melissavipmagic.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-[#F5A623]" />
                <span>Contact via email</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-[#F5A623]" />
                <span>Authorized Disney Vacation Planner</span>
              </div>
            </div>
            
            <form onSubmit={handleSubscribe}>
              <p className="text-sm text-white/70 mb-3">Get the latest travel tips & insider secrets</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button type="submit" className="bg-[#F5A623] hover:bg-[#E09512] px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2024 Melissa VIP Magic. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-white/50 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App
function App() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <Hero />
      <StatsSection />
      <WhyChooseMelissa />
      <Services />
      <HowItWorks />
      <Testimonials />
      <VideoGallery />
      <TransferSection />
      <FAQSection />
      <QuizSection />
      <Destinations />
      <BlogSection />
      <InstagramSection />
      <About />
      <ContactForm />
      <CTA />
      <Footer />
      <FloatingChat
        guideName="Melissa Jiles"
        guideTitle="Disney VIP Travel Expert"
        guideAvatar="/images/melissa-portrait.jpg"
        primaryColor="#7B2D8E"
        secondaryColor="#E91E8C"
        accentColor="#F5A623"
        apiKey={import.meta.env.VITE_OPENROUTER_API_KEY || ''}
        modelId={import.meta.env.VITE_OPENROUTER_MODEL_ID || 'openai/gpt-4o-mini'}
      />
    </div>
  );
}

export default App;
