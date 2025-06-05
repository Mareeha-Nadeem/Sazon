import React, { useState } from 'react';
import { Clock, Star, BarChart3, Lightbulb, Quote, Brain } from 'lucide-react';
import Masonry from 'react-masonry-css';
import './Explore.css';

// Simple Recipe Card Component
const RecipeCard = () => {
  return (
    <div className="card-inner">
      <div className="card-image-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80" 
          alt="Pasta"
          className="card-image"
        />
        <div className="card-image-overlay" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Creamy Garlic Pasta</h3>
        <p className="card-description">A luxurious homemade pasta with rich garlic cream sauce and fresh herbs</p>
        <div className="card-meta">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.8</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">25 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Poll Card Component
const PollCard = () => {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const options = [
    { id: 'pizza', text: 'Pizza', votes: 45, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80' },
    { id: 'burger', text: 'Burger', votes: 32, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
    { id: 'pasta', text: 'Pasta', votes: 28, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=200&q=80' }
  ];

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = (optionId) => {
    setSelectedOption(optionId);
    setVoted(true);
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.5)', 
          padding: '12px', 
          borderRadius: '12px' 
        }}>
          <BarChart3 style={{ width: '24px', height: '24px', color: '#E11D48' }} />
        </div>
        <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a' }}>Quick Poll</h3>
      </div>

      <h4 style={{ 
        fontSize: '1.25rem', 
        color: '#1a1a1a', 
        marginBottom: '24px',
        fontWeight: '600'
      }}>
        What's your favorite food?
      </h4>

      {!voted ? (
        <div style={{ display: 'grid', gap: '12px' }}>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              style={{
                position: 'relative',
                width: '100%',
                height: '80px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                ':hover': {
                  transform: 'translateX(8px)'
                }
              }}
            >
              <img 
                src={option.image}
                alt={option.text}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                transition: 'background 0.3s ease'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '1.125rem',
                  fontWeight: '500'
                }}>
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {options.map((option) => {
            const percentage = Math.round((option.votes / totalVotes) * 100);
            const isSelected = option.id === selectedOption;
            
            return (
              <div 
                key={option.id}
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  padding: '16px',
                  position: 'relative',
                  border: isSelected ? '2px solid #E11D48' : '2px solid transparent'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <span style={{
                    color: '#1a1a1a',
                    fontSize: '1rem',
                    fontWeight: isSelected ? '600' : '500'
                  }}>
                    {option.text}
                    {isSelected && <span style={{ marginLeft: '8px', color: '#E11D48' }}>✓</span>}
                  </span>
                  <span style={{
                    color: '#4b5563',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {percentage}%
                  </span>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    background: isSelected ? '#E11D48' : '#9CA3AF',
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
                
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  {option.votes} votes
                </div>
              </div>
            );
          })}
          
          <button
            onClick={() => setVoted(false)}
            style={{
              background: 'white',
              border: '1px solid #E11D48',
              color: '#E11D48',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '8px',
              ':hover': {
                background: '#FEE2E2'
              }
            }}
          >
            Vote Again
          </button>
        </div>
      )}
    </div>
  );
};

// Simple Food Hack Card
const FoodHackCard = () => {
  return (
    <div className="card-inner">
      <div className="card-header">
        <div className="icon-wrapper">
          <Lightbulb className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="card-title">Food Hack</h3>
      </div>
      <div className="card-image-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&q=80"
          alt="Bananas"
          className="card-image"
        />
        <div className="card-image-overlay" />
      </div>
      <div className="card-content">
        <h4 className="hack-title">Keep Bananas Fresh Longer</h4>
        <p className="hack-description">
          Wrap the stem of your bananas in plastic wrap to slow down ripening and keep them fresh for up to a week longer!
        </p>
        <div className="hack-tip">💡 Pro Tip: Separate bananas for even better results</div>
      </div>
    </div>
  );
};

// Simple Quote Card
const FoodQuoteCard = () => {
  return (
    <div className="card-inner">
      <div className="card-header">
        <div className="icon-wrapper">
          <Quote className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="card-title">Food Quote</h3>
      </div>
      <div className="quote-content">
        <blockquote className="quote-text">
          "Cooking is like love. It should be entered into with abandon or not at all."
        </blockquote>
        <div className="quote-author">— Harriet Van Horne</div>
      </div>
      <div className="decorative-pattern" />
    </div>
  );
};

// Simple Trivia Card
const TriviaCard = () => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="card-inner">
      <div className="card-header">
        <div className="icon-wrapper">
          <Brain className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="card-title">Food Trivia</h3>
      </div>
      
      <div className="trivia-content">
        <h4 className="trivia-question">Which fruit is technically a berry?</h4>
        
        <div className="trivia-options">
          <div className="trivia-option">A) Strawberry</div>
          <div className="trivia-option">B) Raspberry</div>
          <div className="trivia-option">C) Banana</div>
          <div className="trivia-option">D) Blackberry</div>
        </div>
        
        {!showAnswer ? (
          <button 
            onClick={() => setShowAnswer(true)}
            className="show-answer-btn"
          >
            Show Answer
          </button>
        ) : (
          <div className="answer-reveal">
            <div className="answer-text">Answer: C) Banana</div>
            <div className="answer-explanation">
              Botanically, bananas are berries while strawberries are not!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Big Feature Card
const BigFeatureCard = () => {
  return (
    <div className="sazon-feature-card" style={{
      position: 'relative',
      height: '100%',
      minHeight: '580px',
      borderRadius: '24px',
      overflow: 'hidden',
      background: '#1a1a1a'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <img 
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80"
          alt="Margherita Pizza"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.02)',
            zIndex: 1
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.85) 100%)',
          zIndex: 2
        }} />
        
        <div style={{
          position: 'relative',
          padding: '48px 40px',
          color: 'white',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            alignSelf: 'flex-start',
            letterSpacing: '0.5px'
          }}>
            <span style={{ fontSize: '1.25rem' }}>🍕</span>
            <span>Featured Recipe</span>
          </div>
          
          <div style={{ maxWidth: '600px' }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 700,
              marginBottom: '20px',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.12)'
            }}>
              Authentic<br />Margherita Pizza
            </h3>
            
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              marginBottom: '32px',
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
              maxWidth: '90%'
            }}>
              Master the art of Neapolitan pizza making with San Marzano tomatoes, fresh buffalo mozzarella, and fragrant basil leaves.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '0.9375rem',
              color: 'white',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 20px',
                borderRadius: '100px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                ':hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Clock style={{ width: '18px', height: '18px', opacity: 0.9 }} />
                <span>2 hours</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 20px',
                borderRadius: '100px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                ':hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Star style={{ width: '18px', height: '18px', opacity: 0.9 }} />
                <span>4.9/5</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 20px',
                borderRadius: '100px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                ':hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <span style={{ fontSize: '1.125rem' }}>👨‍🍳</span>
                <span>Intermediate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Explore Page Component
const ExplorePage = () => {
  const breakpointColumns = {
    default: 4,
    1536: 3,
    1280: 2,
    768: 1
  };

  return (
    <div className="explore-container">
      <div className="explore-content" style={{ padding: '40px 24px' }}>
        {/* Header Section */}
        <div className="header-section" style={{ marginBottom: '48px', maxWidth: '1400px', margin: '0 auto 48px' }}>
          <h1 className="page-title" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            lineHeight: '1.1'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Explore</span> Culinary Wonders
          </h1>
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: '#374151',
            maxWidth: '800px',
            lineHeight: '1.6'
          }}>
            Embark on a journey through <span style={{ color: '#FF6B35', fontWeight: '500' }}>flavors</span>, 
            <span style={{ color: '#2E9D63', fontWeight: '500' }}> techniques</span>, and 
            <span style={{ color: '#E94D88', fontWeight: '500' }}> stories</span> that make food an art form
          </p>
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          style={{ maxWidth: '1600px', margin: '0 auto' }}
        >
          {/* Featured Recipe Card - Warm Sunset */}
          <div style={{
            transform: 'translateY(0)',
            transition: 'all 0.4s ease-out',
            marginBottom: '24px',
            ':hover': {
              transform: 'translateY(-8px)'
            }
          }}>
            <BigFeatureCard />
          </div>

          {/* Food Comparison Card */}
          <div style={{
            background: 'linear-gradient(135deg, #E6FAF5 0%, #D1F3EA 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '24px',
            transition: 'transform 0.4s ease-out',
            ':hover': {
              transform: 'translateY(-8px)'
            }
          }}>
            <div style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '24px', color: '#1a1a1a' }}>
                🌍 Food Around the World
              </h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  background: 'rgba(255,255,255,0.7)',
                  padding: '16px',
                  borderRadius: '16px',
                  transition: 'transform 0.3s ease',
                  ':hover': { transform: 'translateX(8px)' }
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=200&q=80" 
                    alt="Xiaolongbao"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Chinese Xiaolongbao</h4>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>Steamed soup dumplings</p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  background: 'rgba(255,255,255,0.7)',
                  padding: '16px',
                  borderRadius: '16px',
                  transition: 'transform 0.3s ease',
                  ':hover': { transform: 'translateX(8px)' }
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1610197361600-33a3a5073cad?w=200&q=80" 
                    alt="Pierogi"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Polish Pierogi</h4>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>Boiled potato dumplings</p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  background: 'rgba(255,255,255,0.7)',
                  padding: '16px',
                  borderRadius: '16px',
                  transition: 'transform 0.3s ease',
                  ':hover': { transform: 'translateX(8px)' }
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&q=80" 
                    alt="Gyoza"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Japanese Gyoza</h4>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>Pan-fried pork dumplings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Food Hack Card */}
          <div style={{
            background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '24px',
            transition: 'all 0.4s ease-out',
            ':hover': {
              transform: 'translateY(-8px)'
            }
          }}>
            <div style={{ padding: '32px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px' 
              }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.5)', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <Lightbulb style={{ width: '24px', height: '24px', color: '#9333EA' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a' }}>Food Hack</h3>
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&q=80"
                alt="Bananas"
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '16px',
                  marginBottom: '24px'
                }}
              />

              <h4 style={{ 
                fontSize: '1.25rem', 
                color: '#1a1a1a', 
                marginBottom: '16px' 
              }}>
                Keep Bananas Fresh Longer
              </h4>
              
              <p style={{ 
                color: '#4b5563', 
                lineHeight: '1.6', 
                marginBottom: '20px' 
              }}>
                Wrap the stem of your bananas in plastic wrap to slow down ripening and keep them fresh for up to a week longer!
              </p>

              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: 'rgba(147, 51, 234, 0.1)',
                color: '#9333EA',
                borderRadius: '100px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                💡 Pro Tip: Separate bananas for even better results
              </div>
            </div>
          </div>

          {/* Quote Card */}
          <div style={{
            background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '24px',
            transition: 'all 0.4s ease-out',
            ':hover': {
              transform: 'translateY(-8px)'
            }
          }}>
            <div style={{ padding: '32px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '32px' 
              }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.5)', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <Quote style={{ width: '24px', height: '24px', color: '#0284C7' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a' }}>Food Quote</h3>
              </div>
              
              <blockquote style={{
                fontSize: '1.5rem',
                lineHeight: '1.4',
                color: '#1a1a1a',
                fontStyle: 'italic',
                position: 'relative',
                padding: '0 24px',
                marginBottom: '24px'
              }}>
                "Cooking is like love. It should be entered into with abandon or not at all."
              </blockquote>
              
              <div style={{
                textAlign: 'right',
                color: '#4b5563',
                fontSize: '1rem',
                fontStyle: 'normal'
              }}>
                — Harriet Van Horne
              </div>
            </div>
          </div>

          {/* Poll Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '24px',
            transition: 'all 0.4s ease-out',
            ':hover': {
              transform: 'translateY(-8px)'
            }
          }}>
            <div style={{ padding: '32px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px' 
              }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.5)', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <BarChart3 style={{ width: '24px', height: '24px', color: '#E11D48' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a' }}>Quick Poll</h3>
              </div>

              <h4 style={{ 
                fontSize: '1.25rem', 
                color: '#1a1a1a', 
                marginBottom: '24px',
                fontWeight: '600'
              }}>
                What's your favorite food?
              </h4>

              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { text: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80' },
                  { text: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
                  { text: 'Pasta', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=200&q=80' }
                ].map((option, index) => (
                  <button
                    key={index}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '80px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      ':hover': {
                        transform: 'translateX(8px)'
                      }
                    }}
                  >
                    <img 
                      src={option.image}
                      alt={option.text}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 24px'
                    }}>
                      <span style={{
                        color: 'white',
                        fontSize: '1.125rem',
                        fontWeight: '500'
                      }}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recipe Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '24px',
            transition: 'all 0.4s ease-out',
            ':hover': {
              transform: 'translateY(-8px)'
            }
          }}>
            <div style={{ padding: '32px' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '24px'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop"
                  alt="Pasta"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                />
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                color: '#1a1a1a',
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                Creamy Garlic Pasta
              </h3>

              <p style={{
                color: '#4b5563',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                A luxurious homemade pasta with rich garlic cream sauce and fresh herbs
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Star style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>4.8</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#4b5563'
                }}>
                  <Clock style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '0.9375rem' }}>25 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trivia Card */}
          <div style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '24px',
            transition: 'all 0.4s ease-out',
            ':hover': {
              transform: 'translateY(-8px)'
            }
          }}>
            <div style={{ padding: '32px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px' 
              }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.5)', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <Brain style={{ width: '24px', height: '24px', color: '#059669' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a' }}>Food Trivia</h3>
              </div>

              <h4 style={{ 
                fontSize: '1.25rem', 
                color: '#1a1a1a', 
                marginBottom: '24px',
                fontWeight: '600'
              }}>
                Which fruit is technically a berry?
              </h4>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                {['Strawberry', 'Raspberry', 'Banana', 'Blackberry'].map((option, index) => (
                  <button
                    key={index}
                    style={{
                      width: '100%',
                      padding: '16px',
                      textAlign: 'left',
                      background: 'rgba(255,255,255,0.7)',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        background: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}
                  >
                    {String.fromCharCode(65 + index)}) {option}
                  </button>
                ))}
              </div>

              <button style={{
                width: '100%',
                padding: '16px',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                  background: '#047857',
                  transform: 'translateY(-2px)'
                }
              }}>
                Show Answer
              </button>
            </div>
          </div>
        </Masonry>
      </div>
    </div>
  );
};

export default ExplorePage;