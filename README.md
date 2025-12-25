<img width="798" height="763" alt="image" src="https://github.com/user-attachments/assets/4b7d8b17-4b29-4791-be3b-49d25c27c5e6" /># Facebook Graph API Explorer

A web application that allows users to fetch and display data from the Facebook Graph API. This project demonstrates how to interact with Facebook's Graph API to retrieve user profile information.

## 📝 Project Description

This application provides a simple interface to interact with the Facebook Graph API. Users can input their access token and fetch their profile information, which is then displayed in a clean, responsive card layout.

## 🔌 API Details

### Base URL
```
https://graph.facebook.com/v24.0
```

### Endpoints Used

1. **Get User Profile** - `/{user-id}`
   - Retrieves basic user profile information
   - Fields: id, name, email (if available)



### Required Parameters

- **Access Token** (Query Parameter): Required for all API calls
  - Format: `access_token=YOUR_ACCESS_TOKEN`
- **Fields** (Query Parameter, Optional): Specify which fields to retrieve
  - Format: `fields=id,name,email`

### Authentication

**Method**: Token-based (Access Token)
- Access tokens are passed as query parameters in the API request
- Tokens can be obtained from Facebook Developer Console
- Tokens have expiration times and may need to be refreshed

## ✨ Features

- ✅ Fetch user profile information
- ✅ Display data in responsive card layout
- ✅ Input validation for access tokens
- ✅ Error handling with user-friendly messages
- ✅ Loading indicators during API calls
- ✅ Responsive design for all screen sizes
- ✅ Prevents double-clicks during processing

## 📁 File Structure

```
facebook_graph/
├── index.html          # Main HTML file
├── style.css           # Stylesheet for the application
├── script.js           # JavaScript logic and API calls
└── README.md          # Project documentation
```

## 🔧 Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A Facebook Access Token (obtained from Facebook Developer Console)
- A local web server (optional, for testing)

## 🚀 Setup Instructions

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd facebook_graph
   ```

2. **No additional dependencies required**
   - The project uses vanilla JavaScript
   - No package manager or build tools needed

3. **Get a Facebook Access Token**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use an existing one
   - Generate an access token with appropriate permissions

## ▶️ How to Run


Simply open `index.html` in your web browser. Note that some browsers may have CORS restrictions when opening files directly.

## 💻 Usage

1. **Open the application** in your web browser

2. **Enter your Access Token**
   - Paste your Facebook access token in the input field
   - Make sure the token has the necessary permissions

3. **Click "Get My Profile"**
   - The application will fetch your profile data
   - A loading indicator will show during the request

4. **View Results**
   - Your profile information will be displayed in cards
   - If there's an error, it will be shown in the error container

## 📡 Sample JSON Response

### User Profile Response
```json
{
  "id": "123456789",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Posts Response
```json
{
  "data": [
    {
      "id": "post_id_123",
      "message": "Hello World!",
      "created_time": "2024-01-15T10:30:00+0000",
      "likes": {
        "summary": {
          "total_count": 10
        }
      },
      "comments": {
        "summary": {
          "total_count": 5
        }
      }
    }
  ]
}
```

**Fields Displayed on UI:**
- User ID
- Name
- Email (if available)


## ⚠️ Error Handling

The application handles the following error scenarios:

- **No results found**: Displays appropriate message
- **Invalid input**: Validates access token format
- **Failed API request**: Shows error message from API
- **Authentication errors (401/403)**: Displays permission error
- **Not found (404)**: Shows resource not found message
- **Rate limiting (429)**: Displays rate limit exceeded message
- **Loading state**: Shows loading indicator during API calls

## 📸 Screenshots

<img width="798" height="763" alt="image" src="https://github.com/user-attachments/assets/b7a4d6f4-1b4f-48c2-8f8c-fb862203ac25" />


## 👥 Project Members



Adrian C. Sison - JavaScript Logic / Data Processing
Richielyn S. Canabe - GitHub & Documentation Manager
Stephanie Mae T. Arenas - API & Authentication Handler
Lemery Q. Soriano - UI & CSS Designer

**API Source**: [Facebook Graph API](https://developers.facebook.com/docs/graph-api)




