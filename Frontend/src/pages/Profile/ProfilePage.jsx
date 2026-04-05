import React from 'react'

const ProfilePage = () => {
  return (
   <>
    <div className="p-6 bg-gray-100 min-h-screen"> <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>

<div className="bg-white p-4 rounded-2xl shadow mb-6">
    <h2 className="font-semibold mb-2">User Information</h2>

    <input
      type="text"
      placeholder="Username"
      defaultValue=""
      className="w-full border p-2 rounded mb-3"
    />

    <input
      type="email"
      placeholder="Email"
      defaultValue=""
      className="w-full border p-2 rounded"
    />
  </div>

  <div className="bg-white p-4 rounded-2xl shadow">
    <h2 className="font-semibold mb-2">Change Password</h2>

    <input
      type="password"
      placeholder="Current Password"
      className="w-full border p-2 rounded mb-3"
    />

    <input
      type="password"
      placeholder="New Password"
      className="w-full border p-2 rounded mb-3"
    />

    <input
      type="password"
      placeholder="Confirm New Password"
      className="w-full border p-2 rounded"
    />

    <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
      Update Password
    </button>
  </div>
</div>


   </>
  )
}

export default ProfilePage

// // PAGE 1: Dashboard.jsx import React from "react";

// export default function Dashboard() { return ( <div className="p-6 bg-gray-100 min-h-screen"> <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

// <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//     <div className="bg-white p-4 rounded-2xl shadow">
//       <h2 className="text-gray-500">Total Documents</h2>
//       <p className="text-2xl font-bold">4</p>
//     </div>

//     <div className="bg-white p-4 rounded-2xl shadow">
//       <h2 className="text-gray-500">Total Flashcards</h2>
//       <p className="text-2xl font-bold">50</p>
//     </div>

//     <div className="bg-white p-4 rounded-2xl shadow">
//       <h2 className="text-gray-500">Total Quizzes</h2>
//       <p className="text-2xl font-bold">4</p>
//     </div>
//   </div>

//   <div className="mt-6 bg-white p-4 rounded-2xl shadow">
//     <h2 className="font-semibold mb-3">Recent Activity</h2>
//     {["React Concepts Detailed", "CSS Guide", "JavaScript Guide"].map((item, i) => (
//       <div key={i} className="flex justify-between border-b py-2">
//         <span>Accessed Document: {item}</span>
//         <button className="text-green-500">View</button>
//       </div>
//     ))}
//   </div>
// </div>

// ); }

// // PAGE 2: Flashcards.jsx (Only 2 cards) import React from "react";

// const cards = [ { title: "React JS Guide", progress: "50%", reviewed: "5/10" }, { title: "HTML Guide", progress: "20%", reviewed: "2/10" }, ];

// export function Flashcards() { return ( <div className="p-6 bg-gray-100 min-h-screen"> <h1 className="text-2xl font-bold mb-4">Flashcard Sets</h1>

// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     {cards.map((card, i) => (
//       <div key={i} className="bg-white p-4 rounded-2xl shadow">
//         <h2 className="font-semibold">{card.title}</h2>
//         <p className="text-sm text-gray-500">Progress: {card.reviewed}</p>

//         <div className="w-full bg-gray-200 h-2 rounded mt-2">
//           <div
//             className="bg-green-500 h-2 rounded"
//             style={{ width: card.progress }}
//           ></div>
//         </div>

//         <button className="mt-4 bg-green-400 text-white px-4 py-2 rounded-lg">
//           Study Now
//         </button>
//       </div>
//     ))}
//   </div>
// </div>

// ); }

// PAGE 3: Profile.jsx import React from "react";

