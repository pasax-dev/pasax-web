"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface GibberishTextProps {
  /**
   * The text to animate.
   */
  text: string

  /**
   * The class name to apply to each letter.
   */
  className?: string
}

const Letter = ({ letter, className }: { letter: string; className?: string }) => {
  const [char, setChar] = useState<string>(letter)

  useEffect(() => {
    // Initial scramble count (between 6 and 14 iterations)
    let count = Math.floor(Math.random() * 9) + 6
    const isUpper = letter >= "A" && letter <= "Z"
    const isLower = letter >= "a" && letter <= "z"
    const isDigit = letter >= "0" && letter <= "9"

    const interval = setInterval(() => {
      if (isUpper) {
        setChar(String.fromCharCode(Math.floor(Math.random() * 26) + 65))
      } else if (isLower) {
        setChar(String.fromCharCode(Math.floor(Math.random() * 26) + 97))
      } else if (isDigit) {
        setChar(String.fromCharCode(Math.floor(Math.random() * 10) + 48))
      } else if (letter !== " ") {
        const symbols = ["#", "@", "%", "&", "*", "/", "!", "$", "+", "="]
        setChar(symbols[Math.floor(Math.random() * symbols.length)])
      }
      count--
      if (count <= 0) {
        setChar(letter)
        clearInterval(interval)
      }
    }, 28)

    return () => clearInterval(interval)
  }, [letter])

  if (letter === " ") {
    return <span className="inline-block">&nbsp;</span>
  }

  return (
    <span className={cn("inline-block", className)}>
      {char}
    </span>
  )
}

export default function GibberishText({ text, className }: GibberishTextProps) {
  const words = text.split(" ")

  return (
    <>
      {words.map((word, wordIndex) => (
        <span key={`${wordIndex}-${word}`} className="inline-block whitespace-nowrap">
          {word.split("").map((letter, letterIndex) => (
            <Letter
              className={className}
              letter={letter}
              key={`${wordIndex}-${letterIndex}-${letter}`}
            />
          ))}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  )
}
