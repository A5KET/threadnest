import useMessageTree from '../hooks/useMessageThree'
import { Message } from '../types'
import ThreadMessage from './Message'

function App() {
  const user1 = { username: "Alice" }
  const user2 = { username: "Bob" }
  const user3 = { username: "Charlie" }
  const user4 = { username: "David" }
  const user5 = { username: "Mark" }
  const user6 = { username: "Sarah" }

  const messages: Message[] = [
    {
      id: 1,
      parentId: null,
      author: user1,
      text: "Hello, this is the first message.",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      rating: 5,
      reaction: "like",
    },
    {
      id: 2,
      parentId: 1,
      author: user2,
      text: 'Hi Alice, nice to see your message!',
      createdAt: new Date("2024-01-01T10:05:00Z"),
      rating: -2,
      reaction: "dislike",
    },
    {
      id: 3,
      parentId: 1,
      author: user1,
      text: "Thanks, Bob! How are you doing?",
      createdAt: new Date("2024-01-01T10:10:00Z"),
      rating: 4,
      reaction: "like",
    },
    {
      id: 4,
      parentId: 2,
      author: user3,
      text: "I'm doing great, thanks for asking! How about you?",
      createdAt: new Date("2024-01-01T10:15:00Z"),
      rating: 1,
      reaction: "dislike",
    },
    {
      id: 5,
      parentId: 2,
      author: user1,
      text: "I'm doing well, Bob. Glad to hear you're doing great!",
      createdAt: new Date("2024-01-01T10:20:00Z"),
      rating: 3,
      reaction: "like",
    },
    {
      id: 6,
      parentId: 3,
      author: user4,
      text: "I'm doing fine too! What are you up to these days?",
      createdAt: new Date("2024-01-01T10:25:00Z"),
      rating: 0,
      reaction: "dislike",
    },
    {
      id: 7,
      parentId: 6,
      author: user1,
      text: "Just working on some new projects. Exciting stuff ahead!",
      createdAt: new Date("2024-01-01T10:30:00Z"),
      rating: 7,
      reaction: "like",
    },
    {
      id: 8,
      parentId: 7,
      author: user4,
      text: "Sounds awesome! I'm looking forward to hearing more about it.",
      createdAt: new Date("2024-01-01T10:35:00Z"),
      rating: 2,
      reaction: "like",
    },
    {
      id: 9,
      parentId: 1,
      author: user5,
      text: "Hi Alice, long time no see! How’s everything going?",
      createdAt: new Date("2024-01-01T10:40:00Z"),
      rating: 6,
      reaction: "like",
    },
    {
      id: 10,
      parentId: 9,
      author: user1,
      text: "Hi Mark, everything’s going well! How about you?",
      createdAt: new Date("2024-01-01T10:45:00Z"),
      rating: -1,
      reaction: "dislike",
    },
    {
      id: 11,
      parentId: 10,
      author: user5,
      text: "Good, just busy with work. Let’s catch up soon!",
      createdAt: new Date("2024-01-01T10:50:00Z"),
      rating: 2,
      reaction: "like",
    },
    {
      id: 12,
      parentId: 11,
      author: user1,
      text: "Definitely! Looking forward to it.",
      createdAt: new Date("2024-01-01T10:55:00Z"),
      rating: 5,
      reaction: "like",
    },
    {
      id: 13,
      parentId: 3,
      author: user6,
      text: "Hey Alice, long time no chat! How’s your day going?",
      createdAt: new Date("2024-01-01T11:00:00Z"),
      rating: 0,
      reaction: "dislike",
    },
    {
      id: 14,
      parentId: 13,
      author: user1,
      text: "It’s going great! How about you, Sarah?",
      createdAt: new Date("2024-01-01T11:05:00Z"),
      rating: 3,
      reaction: "like",
    },
    {
      id: 15,
      parentId: 14,
      author: user6,
      text: "Good! I’ve been working on a new hobby, painting!",
      createdAt: new Date("2024-01-01T11:10:00Z"),
      rating: 8,
      reaction: "like",
    },
    {
      id: 16,
      parentId: 15,
      author: user1,
      text: "That’s awesome! I’ve always wanted to try painting.",
      createdAt: new Date("2024-01-01T11:15:00Z"),
      rating: -3,
      reaction: "dislike",
    },
  ]

  const messageTreeRoots = useMessageTree(messages)

  return (
    <>
      <header>
        Threadnest
      </header>
      {messageTreeRoots.map(message => <ThreadMessage message={message} />)}
      <footer>
      
      </footer>
    </>
  )
}

export default App