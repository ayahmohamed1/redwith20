'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import confetti from 'canvas-confetti'
import type { GiftData } from '@/lib/giftData'
import { defaultLoveLetterParagraphs } from '@/lib/giftData'

interface Props {
  data: GiftData
}

export type ScreenType =
  | 'intro'
  | 'card'
  | 'photoStory'
  | 'birthdayMessage'
  | 'bucketList'
  | 'loveLetter'
  | 'music'

export default function GiftClient({ data }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [screen, setScreen] = useState<ScreenType>('intro')
  const [introExiting, setIntroExiting] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00')
  const [durationStr, setDurationStr] = useState('0:00')

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Audio setup
  useEffect(() => {
    if (data.musicUrl) {
      const audio = new Audio(data.musicUrl)
      audio.loop = true
      audio.volume = 0.5
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDurationStr(formatTime(audio.duration))
      })

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100)
          setCurrentTimeStr(formatTime(audio.currentTime))
        }
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [data.musicUrl])

  const navigateTo = useCallback((newScreen: ScreenType) => {
    try {
      if (typeof window !== 'undefined' && window.history?.pushState) {
        window.history.pushState({ screen: newScreen }, '')
      }
    } catch {
      // Safe fallback for restricted webviews
    }
    setScreen(newScreen)
  }, [])

  // Reset scroll on screen transition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
      const activeScreens = document.querySelectorAll('.screen')
      activeScreens.forEach((el) => {
        el.scrollTop = 0
      })
    }
  }, [screen])

  // History Popstate Handling
  useEffect(() => {
    if (!isMounted) return
    try {
      window.history.replaceState({ screen: 'intro' }, '')
    } catch {
      // ignore
    }
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setScreen(event.state.screen)
      } else {
        setScreen('intro')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isMounted])

  // Confetti trigger when reaching birthday message screen
  useEffect(() => {
    if (screen === 'birthdayMessage') {
      try {
        confetti({
          particleCount: 80,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#0e2044', '#1e3870', '#8b1538', '#dfc08f', '#ffffff'],
        })
        const timer = setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: ['#dfc08f', '#0e2044', '#8b1538'],
          })
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: ['#0e2044', '#dfc08f', '#ffffff'],
          })
        }, 350)
        return () => clearTimeout(timer)
      } catch (e) {
        // Safe fallback
      }
    }
  }, [screen])

  const handleEnvelopeClick = useCallback(() => {
    if (screen !== 'intro') return
    setIntroExiting(true)
    setTimeout(() => {
      navigateTo('card')
      setIntroExiting(false)
    }, 550)
  }, [screen, navigateTo])

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setMusicPlaying(true)
    }
  }, [musicPlaying])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setProgress(val)
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (val / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setCurrentTimeStr(formatTime(newTime))
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="gift-page">
      {/* Ambient background particles / glow */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />

      {/* ── SCREEN 1: INTRO (الظرف) ── */}
      <section
        className={`screen intro-screen ${
          screen === 'intro' ? (introExiting ? 'exit' : 'visible') : 'hidden'
        }`}
        onClick={handleEnvelopeClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleEnvelopeClick()
          }
        }}
      >
        <div className="intro-content">
          <p className="handwritten intro-heading">hey babe!</p>
          <div className="envelope-wrapper">
            <Image
              src={data.envelopeImage}
              alt="Wax Sealed Envelope"
              width={290}
              height={205}
              className="envelope-image"
              priority
            />
          </div>
          <p className="handwritten intro-subtitle">you've got new emails</p>
          <button
            type="button"
            className="open-envelope-btn"
            onClick={(e) => {
              e.stopPropagation()
              handleEnvelopeClick()
            }}
          >
            tap anywhere to open ✨
          </button>
        </div>
      </section>

      {/* ── SCREEN 2: TO / FROM CARD (بيدج to , from) ── */}
      <section className={`screen card-screen ${screen === 'card' ? 'visible' : 'hidden'}`}>
        <div className="screen-scroll-container">
          <div className="stationery-card from-to-card">
            <div className="card-header">
              <p className="handwritten line-from">
                <span className="label-navy">From:</span> {data.senderName}
              </p>
              <p className="handwritten line-to">
                <span className="label-navy">To:</span> {data.receiverName}
              </p>
            </div>
            <div className="card-body">
              <p className="handwritten message-label">Message:</p>
              <p className="handwritten message-text">{data.cardMessage}</p>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('photoStory')
                }}
              >
                <span>see attachment</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 3: PHOTO STORY (بيدج الصورة ال تحتها كلام) ── */}
      <section
        className={`screen photo-screen ${screen === 'photoStory' ? 'visible' : 'hidden'}`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card story-card">
            <div className="story-image-frame">
              <Image
                src={data.birthdayImage}
                alt={`${data.receiverName} Photo`}
                width={380}
                height={380}
                className="story-image"
                priority
              />
            </div>
            <div className="story-text-container">
              <h2 className="handwritten story-title">{data.birthdayTitle}</h2>
              <p className="handwritten story-paragraph">{data.birthdayText}</p>
            </div>
            <div className="card-footer mt-4">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('birthdayMessage')
                }}
              >
                <span>birthday message</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 4: BIRTHDAY MESSAGE + BALLOON (بيدج مسدج العيد ميلاد + البالونة ballon) ── */}
      <section
        className={`screen birthday-message-screen ${
          screen === 'birthdayMessage' ? 'visible' : 'hidden'
        }`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card birthday-wishes-card">
            <div className="birthday-hero-duo">
              <div className="duo-balloon-wrap">
                <Image
                  src="/images/ballon.png"
                  alt="Birthday 20 Balloons"
                  width={210}
                  height={270}
                  className="hero-balloon-img"
                  priority
                />
              </div>
              <div className="duo-cat-wrap">
                <Image
                  src="/images/cat.png"
                  alt="Birthday Cat with Cake"
                  width={180}
                  height={280}
                  className="hero-cat-img"
                  priority
                />
              </div>
            </div>

            <div className="birthday-message-content">
              <div className="navy-badge-tag">Happy Birthday</div>
              <h2 className="handwritten birthday-wishes-title">
                {data.birthdayWishesTitle}
              </h2>
              <p className="handwritten birthday-wishes-body">
                {data.birthdayWishesMessage}
              </p>
            </div>

            <div className="card-footer mt-4">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('bucketList')
                }}
              >
                <span>things we wanna do</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 5: THINGS WE WANNA DO TOGETHER (بيدج things we wanna do) ── */}
      <section
        className={`screen bucket-screen ${screen === 'bucketList' ? 'visible' : 'hidden'}`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card bucket-list-card">
            <h2 className="handwritten bucket-title">things we wanna do together</h2>

            <ul className="things-bullet-list">
              {data.thingsWeWannaDo &&
                data.thingsWeWannaDo.map((item, idx) => (
                  <li key={idx} className="things-bullet-item">
                    <span className="bullet-dot">•</span>
                    <span className="bullet-text">{item}</span>
                  </li>
                ))}
            </ul>

            <div className="card-footer mt-6">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('loveLetter')
                }}
              >
                <span>the little things... 💌</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 6: LOVE LETTER (The little things I love about you) ── */}
      <section
        className={`screen love-letter-screen ${
          screen === 'loveLetter' ? 'visible' : 'hidden'
        }`}
      >
        <div className="screen-scroll-container">
          <div className="stationery-card love-letter-card">
            <h2 className="handwritten letter-header-title">
              {data.loveLetterTitle || 'The little things I love about you'}
            </h2>

            <p className="handwritten letter-salutation">
              {data.loveLetterSubtitle || 'To My Ahmed, With All My Love <3'}
            </p>

            <div className="letter-body-paragraphs handwritten">
              {(data.loveLetterParagraphs || defaultLoveLetterParagraphs).map(
                (para, idx) => {
                  const isAccent =
                    para.startsWith('Happy 20th birthday') ||
                    para.startsWith('Always and forever') ||
                    para.startsWith('To my Ahmed') ||
                    para.startsWith('Forever your favorite')

                  return (
                    <p
                      key={idx}
                      className={`letter-para ${
                        isAccent ? 'letter-para-accent' : ''
                      }`}
                    >
                      {para}
                    </p>
                  )
                }
              )}
            </div>

            <div className="letter-decor-footer">
              <span className="letter-heart-divider">✦ ❦ ✦</span>
            </div>

            <div className="card-footer mt-8">
              <button
                type="button"
                className="navy-action-btn"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('music')
                }}
              >
                <span>one more thing... 🎵</span>
                <span className="pulse-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREEN 6: MUSIC PLAYER (بيدج الاغنية) ── */}
      <section className={`screen music-screen ${screen === 'music' ? 'visible' : 'hidden'}`}>
        <div className="screen-scroll-container">
          <div className="stationery-card music-player-card">
            <div className="navy-badge-tag">Now Playing</div>
            <h2 className="handwritten music-header-title">Our Special Track</h2>

            <div className={`album-art ${musicPlaying ? 'playing' : ''}`}>
              <Image
                src={data.musicCoverImage}
                alt="Song Cover"
                fill
                className="album-img"
              />
              <div className="vinyl-center-dot" />
            </div>

            <h3 className="handwritten song-title">{data.songTitle}</h3>

            <div className="slider-container">
              <span className="time-text">{currentTimeStr}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="progress-slider"
                style={{ backgroundSize: `${progress}% 100%` }}
              />
              <span className="time-text">{durationStr}</span>
            </div>

            <div className="controls">
              <button
                className="play-btn"
                onClick={toggleMusic}
                aria-label={musicPlaying ? 'Pause Music' : 'Play Music'}
              >
                {musicPlaying ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}