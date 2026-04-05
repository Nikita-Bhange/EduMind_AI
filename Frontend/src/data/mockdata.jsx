export const mockDocuments = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    fileName: 'ml-intro.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2025-01-15',
    pages: 45,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=500&fit=crop'
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    fileName: 'dsa-notes.pdf',
    fileSize: '3.8 MB',
    uploadDate: '2025-01-12',
    pages: 68,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=500&fit=crop'
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    fileName: 'web-dev.pdf',
    fileSize: '1.9 MB',
    uploadDate: '2025-01-10',
    pages: 32,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=500&fit=crop'
  },
  {
    id: '4',
    title: 'Database Management Systems',
    fileName: 'dbms.pdf',
    fileSize: '4.2 MB',
    uploadDate: '2025-01-08',
    pages: 56,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=500&fit=crop'
  }
];

export const mockChatHistory = [
  {
    id: '1',
    role: 'user',
    content: 'What is supervised learning?',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    role: 'ai',
    content: 'Supervised learning is a type of machine learning where the model is trained on labeled data. The algorithm learns to map inputs to outputs based on example input-output pairs. Common examples include classification and regression tasks.',
    timestamp: '10:30 AM'
  },
  {
    id: '3',
    role: 'user',
    content: 'Can you give me an example?',
    timestamp: '10:32 AM'
  },
  {
    id: '4',
    role: 'ai',
    content: 'Sure! A classic example is email spam detection. The model is trained on thousands of emails that are labeled as "spam" or "not spam". It learns patterns from these examples and can then predict whether new emails are spam or not.',
    timestamp: '10:32 AM'
  }
];

export const mockFlashcards = [
  {
    id: '1',
    documentId: '1',
    front: 'What is Machine Learning?',
    back: 'Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.',
    isFavorite: true,
    createdAt: '2025-01-15'
  },
  {
    id: '2',
    documentId: '1',
    front: 'Define Supervised Learning',
    back: 'Supervised learning is a machine learning approach where models are trained using labeled datasets. The algorithm learns to predict outputs based on input data by finding patterns in the training examples.',
    isFavorite: false,
    createdAt: '2025-01-15'
  },
  {
    id: '3',
    documentId: '1',
    front: 'What is Unsupervised Learning?',
    back: 'Unsupervised learning is a type of machine learning that finds hidden patterns in data without pre-existing labels. Common techniques include clustering, dimensionality reduction, and association rule learning.',
    isFavorite: true,
    createdAt: '2025-01-15'
  },
  {
    id: '4',
    documentId: '2',
    front: 'What is a Binary Search Tree?',
    back: 'A Binary Search Tree is a node-based binary tree data structure where each node has at most two children. For each node, all elements in the left subtree are less than the node, and all elements in the right subtree are greater.',
    isFavorite: false,
    createdAt: '2025-01-12'
  },
  {
    id: '5',
    documentId: '2',
    front: 'Explain Big O Notation',
    back: 'Big O notation describes the upper bound of the time complexity of an algorithm. It provides a way to express how the runtime grows relative to the input size, helping developers understand algorithm efficiency.',
    isFavorite: true,
    createdAt: '2025-01-12'
  }
];

export const mockQuizzes = [
  {
    id: '1',
    documentId: '1',
    title: 'Machine Learning Basics Quiz',
    questionCount: 5,
    createdAt: '2025-01-15',
    completed: true,
    score: 80
  },
  {
    id: '2',
    documentId: '2',
    title: 'Data Structures Quiz',
    questionCount: 10,
    createdAt: '2025-01-12',
    completed: true,
    score: 90
  },
  {
    id: '3',
    documentId: '3',
    title: 'Web Development Quiz',
    questionCount: 8,
    createdAt: '2025-01-10',
    completed: false,
    score: null
  }
];

export const mockQuizQuestions = [
  {
    id: '1',
    question: 'What is the primary goal of supervised learning?',
    options: [
      'To find hidden patterns in unlabeled data',
      'To learn a mapping from inputs to outputs using labeled data',
      'To maximize rewards through trial and error',
      'To reduce the dimensionality of data'
    ],
    correctAnswer: 1,
    explanation: 'Supervised learning aims to learn a function that maps inputs to outputs based on labeled training examples.'
  },
  {
    id: '2',
    question: 'Which of the following is an example of unsupervised learning?',
    options: [
      'Email spam detection',
      'Image classification',
      'Customer segmentation using clustering',
      'Stock price prediction'
    ],
    correctAnswer: 2,
    explanation: 'Customer segmentation using clustering is unsupervised learning as it groups data without predefined labels.'
  },
  {
    id: '3',
    question: 'What does the term "overfitting" mean in machine learning?',
    options: [
      'The model performs well on training data but poorly on new data',
      'The model is too simple to capture patterns',
      'The training process takes too long',
      'The model requires too much memory'
    ],
    correctAnswer: 0,
    explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data.'
  },
  {
    id: '4',
    question: 'What is a neural network?',
    options: [
      'A biological system in the human brain',
      'A computing system inspired by biological neural networks',
      'A type of database management system',
      'A programming language for AI'
    ],
    correctAnswer: 1,
    explanation: 'Neural networks are computing systems inspired by biological neural networks that constitute animal brains.'
  },
  {
    id: '5',
    question: 'Which algorithm is commonly used for classification tasks?',
    options: [
      'K-means clustering',
      'Principal Component Analysis',
      'Decision Trees',
      'Linear Regression'
    ],
    correctAnswer: 2,
    explanation: 'Decision Trees are commonly used for classification tasks as they can split data into distinct categories.'
  }
];

export const mockDashboardStats = {
  totalDocuments: 12,
  totalFlashcards: 48,
  totalQuizzes: 15,
  quizzesCompleted: 12,
  averageScore: 85,
  studyStreak: 7
};

export const mockRecentActivity = [
  {
    id: '1',
    type: 'upload',
    title: 'Uploaded "Introduction to Machine Learning"',
    time: '2 hours ago',
    icon: 'FileUp'
  },
  {
    id: '2',
    type: 'quiz',
    title: 'Completed Data Structures Quiz - Score: 90%',
    time: '5 hours ago',
    icon: 'CheckCircle'
  },
  {
    id: '3',
    type: 'flashcard',
    title: 'Created 8 new flashcards',
    time: '1 day ago',
    icon: 'Layers'
  },
  {
    id: '4',
    type: 'summary',
    title: 'Generated summary for "Web Development Fundamentals"',
    time: '2 days ago',
    icon: 'FileText'
  }
];