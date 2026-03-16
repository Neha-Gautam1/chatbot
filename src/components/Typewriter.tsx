import React, { useEffect, useState } from "react"

interface TypewriterProps {
  words: string[]
  loop?: boolean
  typingSpeed?: number
  deletingSpeed?: number
  pause?: number
  className?: string
}

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  loop = true,
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 1500,
  className = "",
}) => {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [typingInterval, setTypingInterval] = useState(typingSpeed)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentWord = words[wordIndex % words.length]

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText((prev) => prev.slice(0, -1))
        setTypingInterval(deletingSpeed)
      }, deletingSpeed)
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1))
        setTypingInterval(typingSpeed)
      }, typingSpeed)
    }

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pause)
    } else if (isDeleting && text === "") {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
    }

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isDeleting])

  useEffect(() => {
    setText("")
    setIsDeleting(false)
    setWordIndex(0)
  }, [words.join("")])

  return (
    <span className={`typewriter ${className}`}>
      {text}
      <span className="blinking-cursor">|</span>
    </span>
  )
}

export default Typewriter
