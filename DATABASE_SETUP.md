# Skin Scan Database Setup

This guide explains how to set up and use the SQLite database for the Skin Scan application.

## Features Added

✅ **SQLite Database Integration**
- Stores prediction history
- Tracks confidence scores
- Records timestamps
- Analytics dashboard

✅ **Flask Backend**
- RESTful API endpoints
- Database management
- File serving

✅ **Enhanced Frontend**
- Automatic prediction saving
- Success notifications
- Dashboard access

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python app.py
```

### 3. Access the Application
- **Main Scanner**: http://localhost:5000
- **Dashboard**: http://localhost:5000/dashboard

## Database Schema

### Users Table (Future Use)
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email
- `created_at`: Account creation timestamp

### Predictions Table
- `id`: Primary key
- `user_id`: Foreign key to users (optional)
- `image_filename`: Generated filename for the scan
- `predicted_class`: The predicted skin condition
- `confidence_score`: Model confidence (0-1)
- `top_predictions`: JSON string of top 3 predictions
- `created_at`: Prediction timestamp

## API Endpoints

### POST /api/predictions
Save a new prediction to the database.

**Request Body:**
```json
{
  "predicted_class": "mel, Melanoma",
  "confidence_score": 0.85,
  "top_predictions": "[{\"className\":\"mel, Melanoma\",\"probability\":0.85}]"
}
```

### GET /api/predictions
Retrieve recent predictions (last 50).

### GET /api/stats
Get analytics statistics.

## Dashboard Features

- **Total Predictions**: Count of all scans
- **Recent Activity**: Scans in last 7 days
- **Average Confidence**: Mean confidence score
- **Disease Distribution**: Chart showing prediction breakdown
- **Recent Predictions**: List of latest scans with confidence levels

## Database File

The SQLite database is automatically created as `skin_scan.db` in the project root when you first run the application.

## Troubleshooting

### Database Not Created
- Ensure you have write permissions in the project directory
- Check that Flask-SQLAlchemy is installed correctly

### Predictions Not Saving
- Verify the Flask server is running
- Check browser console for JavaScript errors
- Ensure the API endpoints are accessible

### Dashboard Not Loading
- Confirm the Flask server is running on port 5000
- Check that all static files are being served correctly

## Future Enhancements

- User authentication and accounts
- Image storage and retrieval
- Advanced analytics and reporting
- Export functionality
- Multi-user support

## Security Notes

- The current setup is for development use
- For production, consider:
  - HTTPS encryption
  - User authentication
  - Input validation
  - Rate limiting
  - Secure file uploads 