# My Photo Gallery

My Photo Gallery is a web application that allows users to upload, organize, and analyze their photos. Built with React and Firebase, it offers a seamless experience for managing your personal photo collection.

## Features

- User authentication (sign up, sign in, sign out)
- Photo upload and storage
- Drag-and-drop photo organization
- Photo analysis using AI (detects faces, objects, and text in images)
- Categorization of photos (automatic and user-defined)
- Favorite photo marking
- Responsive design for desktop and mobile devices

## Technologies Used

- React
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS for styling
- dnd kit for drag-and-drop functionality
- Google Cloud Vision API for image analysis

## Getting Started

1. Clone the repository:
   ```
   git clone https://https://github.com/KinTatHo/photo-storage-app
   cd photo-storage-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage in your Firebase project
   - Copy your Firebase configuration and paste it into `src/firebase/config.js`

4. Set up Google Cloud Vision API:
   - Enable the Cloud Vision API in your Google Cloud Console
   - Create an API key and add it to your environment variables or directly in the code (be cautious with API keys in your code)

5. Start the development server:
   ```
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Deployment

To deploy the application, you can use Firebase Hosting:

1. Install the Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize your project:
   ```
   firebase init
   ```

4. Build your project:
   ```
   npm run build
   ```

5. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.